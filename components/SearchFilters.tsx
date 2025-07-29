"use client"

import type React from "react"

import { useState } from "react"
import type { SearchFilters } from "@/lib/types"
import { Search } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export function SearchFiltersComponent({ onSearch, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleInputChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Enter city or area"
            value={filters.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType || ""}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            value={filters.bedrooms || ""}
            onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value))}
            className="input-field"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice || ""}
            onChange={(e) => handleInputChange("minPrice", Number.parseInt(e.target.value))}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            placeholder="No limit"
            value={filters.maxPrice || ""}
            onChange={(e) => handleInputChange("maxPrice", Number.parseInt(e.target.value))}
            className="input-field"
          />
        </div>

        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  )
}
