import { PropertyCard } from "@/components/PropertyCard"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Search, Home, TrendingUp } from "lucide-react"

async function getRecentProperties() {
  try {
    const properties = await prisma.property.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    })
    return properties
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return []
  }
}

export default async function HomePage() {
  const properties = await getRecentProperties()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">Find Your Perfect Property</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover amazing properties for rent or sale. Connect directly with property owners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search" className="btn-primary flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Properties</span>
          </Link>
          <Link href="/properties/new" className="btn-secondary flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>List Your Property</span>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
          <p className="text-gray-600">Properties Listed</p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
          <p className="text-gray-600">Support Available</p>
        </div>
      </div>

      {/* Recent Properties */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recent Properties</h2>
          <Link href="/search" className="text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No properties yet</h3>
            <p className="text-gray-600 mb-4">Be the first to list a property!</p>
            <Link href="/properties/new" className="btn-primary">
              List Your Property
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
