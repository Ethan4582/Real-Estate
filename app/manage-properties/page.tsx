"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function ManagePropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/properties?mine=true")
      .then(res => res.json())
      .then(data => {
        setProperties(data)
        setLoading(false)
      })
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return
    const res = await fetch(`/api/properties/${id}`, { method: "DELETE" })
    if (res.ok) setProperties(props => props.filter(p => p.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Your Listings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>You have no listings.</p>
      ) : (
        <ul className="space-y-4">
          {properties.map(property => (
            <li key={property.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <Link href={`/properties/${property.id}`} className="font-semibold text-blue-600 hover:underline">
                  {property.title}
                </Link>
                <div className="text-gray-500 text-sm">{property.location}</div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/properties/${property.id}/edit`} className="btn-secondary">Edit</Link>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}