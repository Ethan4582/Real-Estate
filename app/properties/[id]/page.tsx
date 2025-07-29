import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { getUser } from "@/lib/auth"
import { MapPin, Bed, Bath, Square, Calendar, User } from "lucide-react"
import { PropertyDetailClient } from "./PropertyDetailClient"

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, name: true },
            },
          },
        },
      },
    })

    // Get unique interested users (senders who are not the owner)
    const interestedUsers = property?.messages
      .filter(msg => msg.sender.id !== property.ownerId)
      .map(msg => msg.sender)
      .filter((user, i, arr) => arr.findIndex(u => u.id === user.id) === i) // unique by id

    // Remove messages from property before returning (optional)
    const { messages, ...rest } = property

    return { ...rest, interestedUsers }
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return null
  }
}

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const property = await getProperty(params.id)
  const user = await getUser()

  if (!property) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-24 rounded overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="text-3xl font-bold text-blue-600">
                ${property.price.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{property.location}</span>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              {property.bedrooms && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm">{property.area.toString()} sqft</span>
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {property.propertyType}
                  </span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Listed {new Date(property.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Property Owner</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-200 rounded-full p-3">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{property.owner.name}</p>
                <p className="text-gray-600 text-sm">{property.owner.email}</p>
                {property.owner.phone && (
                  <p className="text-gray-600 text-sm">{property.owner.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Client-side interactive parts */}
          <PropertyDetailClient property={property} user={user} />
        </div>
      </div>
    </div>
  )
}