import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { encrypt } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    const session = await encrypt(sessionData)

    // Create JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

    // Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: sessionData,
        token,
      },
      { status: 200 }
    )

    response.cookies.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
