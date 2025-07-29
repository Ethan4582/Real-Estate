import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json([], { status: 401 })

  // Find all properties where user is owner or has sent/received a message
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { messages: { some: { senderId: user.id } } },
        { messages: { some: { receiverId: user.id } } },
      ],
    },
    select: {
      id: true,
      title: true,
    },
  })

  return NextResponse.json(properties)
}