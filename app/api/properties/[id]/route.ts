import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number(params.id) },
    })
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Convert Decimal fields to string/number
    const safeProperty = {
      ...property,
      price: property.price?.toString(),
      area: property.area?.toString(),
    }

    return NextResponse.json(safeProperty)
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, price } = await request.json()
  const property = await prisma.property.update({
    where: { id: Number(params.id) },
    data: { title, description, price: Number(price) },
  })
  return NextResponse.json(property)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.property.delete({
      where: { id: Number(params.id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}