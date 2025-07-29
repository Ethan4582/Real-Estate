"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PropertyCard } from "@/components/PropertyCard"
import { SearchFiltersComponent } from "@/components/SearchFilters"
import type { Property, SearchFilters } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize filters from URL params
    const initialFilters: SearchFilters = {}
    if (searchParams.get("location")) initialFilters.location = searchParams.get("location")!
    if (searchParams.get("minPrice")) initialFilters.minPrice = Number.parseInt(searchParams.get("minPrice")!)
    if (searchParams.get("maxPrice")) initialFilters.maxPrice = Number.parseInt(searchParams.get("maxPrice")!)
    if (searchParams.get("propertyType")) initialFilters.propertyType = searchParams.get("propertyType")!
    if (searchParams.get("bedrooms")) initialFilters.bedrooms = Number.parseInt(searchParams.get("bedrooms")!)

    setFilters(initialFilters)
    searchProperties(initialFilters)
  }, [searchParams])

  const searchProperties = async (searchFilters: SearchFilters) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString())
        }
      })

      const response = await fetch(`/api/properties/search?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    searchProperties(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Properties</h1>

      <div className="mb-8">
        <SearchFiltersComponent onSearch={handleSearch} initialFilters={filters} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Searching properties...</span>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{properties.length} Properties Found</h2>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No properties found matching your criteria.</p>
              <p className="text-gray-500">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
