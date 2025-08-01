const { Pool } = require('pg');
const crypto = require('crypto');

// Database configuration
const pool = new Pool({
  host: process.env.NEON_HOST, // "ep-mute-waterfall-a1k20aec-pooler.ap-southeast-1.aws.neon.tech"
  database: process.env.NEON_DATABASE, // "neondb"
  user: process.env.NEON_USER, // "neondb_owner"
  password: process.env.NEON_PASSWORD, // "npg_zgjLNyCoPR24"
  port: 5432,
  ssl: { 
    rejectUnauthorized: false // Required for Neon.tech
  },
  max: 1 // Recommended for Lambda to avoid connection leaks
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;

// Helper functions
const generateResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...headers
  },
  body: JSON.stringify(body)
});

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
};

const generateJWT = (userId) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { id: userId, exp: Math.floor(Date.now() / 1000) + 86400 };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifyJWT = (token) => {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    const checkSignature = crypto.createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
    
    if (signature !== checkSignature) return null;
    
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return payload;
  } catch (error) {
    return null;
  }
};

// Database query helper with proper connection handling
const queryDatabase = async (sql, params = []) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', { sql, error });
    throw error;
  } finally {
    if (client) client.release();
  }
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    const { httpMethod, path, headers, queryStringParameters = {}, pathParameters = {}, body: rawBody } = event;
    const body = rawBody ? JSON.parse(rawBody) : {};
    
    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
      return generateResponse(200, { message: 'CORS preflight successful' });
    }
    
    // ===== AUTH ROUTES =====
    if (httpMethod === 'POST' && path === '/api/auth/login') {
      const { email, password } = body;
      
      if (!email || !password) {
        return generateResponse(400, { error: 'Email and password are required' });
      }
      
      try {
        const result = await queryDatabase(
          'SELECT id, password, name, email FROM users WHERE email = $1', 
          [email]
        );
        
        if (result.rows.length === 0) {
          return generateResponse(401, { error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        if (user.password !== hashPassword(password)) {
          return generateResponse(401, { error: 'Invalid credentials' });
        }
        
        const token = generateJWT(user.id);
        const { password: _, ...userData } = user;
        
        return generateResponse(200, {
          message: 'Login successful',
          user: userData,
          token
        });
      } catch (error) {
        console.error('Login error:', error);
        return generateResponse(500, { 
          error: 'Login failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
    
    // Add other endpoints (register, properties, messages) following the same pattern
    
    return generateResponse(404, { error: 'Route not found' });
    
  } catch (error) {
    console.error('Lambda execution error:', error);
    return generateResponse(500, { 
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Initialize connection pool outside handler
let coldStart = true;

exports.handler = async (event, context) => {
  if (coldStart) {
    console.log('Cold start - testing DB connection');
    try {
      await queryDatabase('SELECT NOW()');
      console.log('Database connection successful');
    } catch (err) {
      console.error('Database connection failed:', err);
      return generateResponse(500, { error: 'Database connection failed' });
    }
    coldStart = false;
  }
  
  // Rest of your handler logic...
};