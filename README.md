# Property Marketplace

A full-stack property listing marketplace built with Next.js, TypeScript, and PostgreSQL. Property owners can list their properties and seekers can browse, search, and chat with owners.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Property Management**: CRUD operations for property listings
- **Advanced Search**: Filter properties by location, price, type, and more
- **Real-time Chat**: Direct messaging between property seekers and owners
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM

## Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- bcryptjs for password hashing

### Deployment
- AWS ECS Fargate
- Docker containerization
- AWS Secrets Manager for environment variables

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Docker (for deployment)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd property-marketplace
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Fill in your database URL and JWT secret in the `.env` file.

4. Set up the database:
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

### Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string to your `.env` file as `DATABASE_URL`

### Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `property_marketplace`
3. Update the `DATABASE_URL` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create new property (authenticated)
- `GET /api/properties/search` - Search properties with filters

### Messages
- `GET /api/messages?propertyId={id}` - Get messages for a property
- `POST /api/messages` - Send a message (authenticated)

## Deployment

### AWS ECS Fargate

1. Build and push Docker image to ECR:
\`\`\`bash
# Build image
docker build -t property-marketplace .

# Tag for ECR
docker tag property-marketplace:latest YOUR_ECR_REPO_URI:latest

# Push to ECR
docker push YOUR_ECR_REPO_URI:latest
\`\`\`

2. Create ECS cluster and service using the provided task definition
3. Set up AWS Secrets Manager for environment variables
4. Configure Application Load Balancer for HTTPS

### Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NODE_ENV`: Set to "production" for production builds

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── properties/        # Property pages
│   └── search/            # Search page
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── scripts/              # Database setup scripts
└── public/               # Static assets
\`\`\`

## Key Features Explained

### Authentication
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Protected routes and API endpoints

### Property Search
- Advanced filtering by location, price range, property type, and bedrooms
- Case-insensitive search
- Responsive search interface

### Real-time Chat
- Direct messaging between users
- Property-specific chat threads
- Message history persistence

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Optimized for all screen sizes

## Performance Optimizations

- Server Components for improved performance
- Image optimization with Next.js Image component
- Database indexing for search queries
- Efficient data fetching with Prisma

## Security Best Practices

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS protection
- SQL injection prevention with Prisma

## Common Issues and Solutions

### Database Connection Issues
- Ensure your DATABASE_URL is correct
- Check if your database is accessible from your deployment environment
- Verify SSL settings for production databases

### Authentication Problems
- Make sure JWT_SECRET is set and consistent
- Check cookie settings for your domain
- Verify HTTPS configuration in production

### Build Failures
- Ensure all environment variables are set
- Check TypeScript errors
- Verify Prisma client generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
