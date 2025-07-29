import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, price } = await request.json()
  const property = await prisma.property.update({
    where: { id: Number(params.id) },
    data: { title, description, price: Number(price) },
  })
  return NextResponse.json(property)
}