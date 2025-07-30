"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { X, Filter, Home, Bed, Bath, Ruler, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Property = {
  id: string
  title: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  type: string
}

type SearchFilters = {
  location?: string
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  bedrooms?: number
}

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const searchParams = useSearchParams()



  useEffect(() => {
    const initialFilters: SearchFilters = {}
    if (searchParams.get("location")) initialFilters.location = searchParams.get("location")!
    if (searchParams.get("minPrice")) initialFilters.minPrice = Number(searchParams.get("minPrice")!)
    if (searchParams.get("maxPrice")) initialFilters.maxPrice = Number(searchParams.get("maxPrice")!)
    if (searchParams.get("propertyType")) initialFilters.propertyType = searchParams.get("propertyType")!
    if (searchParams.get("bedrooms")) initialFilters.bedrooms = Number(searchParams.get("bedrooms")!)

    setFilters(initialFilters)
    searchProperties(initialFilters)
  }, [searchParams])

  const searchProperties = async (searchFilters: SearchFilters) => {
    setLoading(true)
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (searchFilters.location) queryParams.append("location", searchFilters.location)
      if (searchFilters.propertyType) queryParams.append("propertyType", searchFilters.propertyType)
      if (searchFilters.bedrooms) queryParams.append("bedrooms", String(searchFilters.bedrooms))
      if (searchFilters.minPrice) queryParams.append("minPrice", String(searchFilters.minPrice))
      if (searchFilters.maxPrice) queryParams.append("maxPrice", String(searchFilters.maxPrice))

      const response = await fetch(`/api/properties/search?${queryParams.toString()}`)
      const results = await response.json()
      setProperties(results)
    } catch (error) {
      console.error("Search failed:", error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (name: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    searchProperties(newFilters)
  }

  const resetFilters = () => {
    const newFilters: SearchFilters = {}
    setFilters(newFilters)
    searchProperties(newFilters)
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Properties</h1>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-1/4 ${mobileFiltersOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
          {mobileFiltersOpen && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="space-y-6">
            {/* Location Filter */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Location</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Property Type Filter */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Property Type</h3>
              <div className="space-y-2">
                {["House", "Condo", "Townhouse", "Loft"].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="radio"
                      id={type.toLowerCase()}
                      name="propertyType"
                      checked={filters.propertyType === type}
                      onChange={() => handleFilterChange("propertyType", type)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={type.toLowerCase()} className="ml-3 text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="any"
                    name="propertyType"
                    checked={!filters.propertyType}
                    onChange={() => handleFilterChange("propertyType", undefined)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="any" className="ml-3 text-gray-700">
                    All Types
                  </label>
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bedrooms</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleFilterChange("bedrooms", filters.bedrooms === count ? undefined : count)}
                    className={`py-2 px-3 rounded-lg text-center ${
                      filters.bedrooms === count
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {count === 5 ? "5+" : count}
                  </button>
                ))}
                <button
                  onClick={() => handleFilterChange("bedrooms", undefined)}
                  className={`py-2 px-3 rounded-lg text-center ${
                    !filters.bedrooms
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Any
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={resetFilters}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Property Results */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              {properties.length} {properties.length === 1 ? "Property" : "Properties"} Found
            </h2>
            
            
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="block"
                    >
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        custom={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 cursor-pointer"
                      >
                        {/* Property Image */}
                        <div className="h-48 relative">
                          <Image
                            src={property.images?.[0] || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={index < 4}
                          />
                          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                            {property.type}
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                            <p className="text-lg font-bold text-blue-600">
                              ${property.price.toLocaleString()}
                            </p>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">
                            {property.address}, {property.city}, {property.state} {property.zip}
                          </p>
                          
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {property.description}
                          </p>
                          
                          <div className="flex justify-between border-t border-gray-100 pt-3">
                            <div className="flex items-center text-gray-600">
                              <Bed className="h-4 w-4 mr-1" />
                              <span>{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Bath className="h-4 w-4 mr-1" />
                              <span>{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Ruler className="h-4 w-4 mr-1" />
                              <span>{property.area.toLocaleString()} sqft</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Home className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We couldn't find any properties matching your criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}