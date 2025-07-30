import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { getUser } from "@/lib/auth"
import { MapPin, Bed, Bath, Square, Calendar, User, Home, Ruler, Wifi, Snowflake, PawPrint, Car } from "lucide-react"
import { PropertyDetailClient } from "./PropertyDetailClient"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PropertyImageGallery } from "./PropertyImageGallery"

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

    if (!property) return null

    // Get unique interested users
    const interestedUsers = property.messages
      .filter(msg => msg.sender.id !== property.ownerId)
      .map(msg => msg.sender)
      .filter((user, i, arr) => arr.findIndex(u => u.id === user.id) === i)

    const similarProperties = await prisma.property.findMany({
      where: {
        id: { not: property.id },
        location: property.location,
        propertyType: property.propertyType,
      },
      select: {
        id: true,
        title: true,
        location: true,
        price: true,
        images: true, // <-- Make sure this is included!
      },
      take: 4,
    })

    return { ...property, interestedUsers, similarProperties }
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

  // Mock features for UI demonstration
  const features = [
    { icon: <Snowflake className="h-5 w-5" />, name: "Air Conditioning" },
    { icon: <PawPrint className="h-5 w-5" />, name: "Pet-Friendly" },
    { icon: <Car className="h-5 w-5" />, name: "Parking" },
    { icon: <Wifi className="h-5 w-5" />, name: "WiFi" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Property Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center text-gray-600 mb-2 md:mb-0">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            <span className="text-lg">{property.location}</span>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            ${property.price.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <PropertyImageGallery images={property.images} title={property.title} />

          {/* Property Highlights */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b">Property Highlights</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {property.bedrooms && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <Bed className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-gray-700 font-medium">{property.bedrooms}</span>
                  <span className="text-sm text-gray-600">Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <Bath className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-gray-700 font-medium">{property.bathrooms}</span>
                  <span className="text-sm text-gray-600">Bathrooms</span>
                </div>
              )}
              {property.area && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <Ruler className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-gray-700 font-medium">{property.area.toString()}</span>
                  <span className="text-sm text-gray-600">Sq. Ft.</span>
                </div>
              )}
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <Home className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-gray-700 font-medium capitalize">{property.propertyType}</span>
                <span className="text-sm text-gray-600">Type</span>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <Badge key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700">
                    {feature.icon}
                    <span>{feature.name}</span>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Listed {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
                <Badge className="px-3 py-1 bg-blue-100 text-blue-800">
                  {property.propertyType}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Property Owner</h3>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gray-200 rounded-full p-3">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">{property.owner.name}</p>
                <p className="text-gray-600 text-sm">{property.owner.email}</p>
                {property.owner.phone && (
                  <p className="text-gray-600 text-sm mt-1">{property.owner.phone}</p>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Get in touch and find your perfect home</h4>
              <p className="text-gray-700 text-sm">
                Contact the owner to schedule a viewing or ask questions about this property.
              </p>
            </div>
            
            <PropertyDetailClient property={property} user={user} />
          </div>

          {/* Similar Properties */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Similar Properties</h3>
            <div className="space-y-4">
              {property.similarProperties?.length > 0 ? (
                property.similarProperties.map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/properties/${similar.id}`}
                    className="flex border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors items-center"
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image
                        src={similar.images?.[0] || "/placeholder.svg"}
                        alt={similar.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{similar.title}</h4>
                      <div className="flex items-center text-gray-600 text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{similar.location}</span>
                      </div>
                      <p className="font-bold text-blue-600 mt-1">
                        ${Number(similar.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">No similar properties found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}