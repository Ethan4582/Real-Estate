import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const location = searchParams.get("location")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const propertyType = searchParams.get("propertyType")
    const bedrooms = searchParams.get("bedrooms")

    const where: any = {}

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = Number.parseFloat(minPrice)
      if (maxPrice) where.price.lte = Number.parseFloat(maxPrice)
    }

    if (propertyType) {
      where.propertyType = propertyType
    }

    if (bedrooms) {
      where.bedrooms = {
        gte: Number.parseInt(bedrooms),
      }
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
    console.error("Search failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
