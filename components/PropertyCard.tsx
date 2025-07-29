import Image from "next/image"
import Link from "next/link"
import type { Property } from "@/lib/types"
import { MapPin, Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={property.images[0] || "/placeholder.svg?height=200&width=300&query=property"}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
          ${property.price.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center space-x-4 text-gray-600 mb-3">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms} bed</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms} bath</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.area} sqft</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>

        <div className="mt-3 text-xs text-gray-500">
          {property.propertyType} • Listed {new Date(property.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  )
}
