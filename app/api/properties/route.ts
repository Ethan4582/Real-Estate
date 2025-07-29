import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get("mine")

    let where: any = {}
    if (mine && user) {
      where.ownerId = user.id
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { title, description, price, location, propertyType, bedrooms, bathrooms, area, images } =
      await request.json()

    // Validate required fields
    if (!title || !price || !location || !propertyType) {
      return NextResponse.json({ error: "Title, price, location, and property type are required" }, { status: 400 })
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: Number.parseFloat(price),
        location,
        propertyType,
        bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
        bathrooms: bathrooms ? Number.parseInt(bathrooms) : null,
        area: area ? Number.parseFloat(area) : null,
        images: images || [],
        ownerId: user.id,
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(property, { status: 201 })
  } catch (error) {
    console.error("Failed to create property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
