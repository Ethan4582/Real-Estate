"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [] as string[],
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data)
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          location: data.location || "",
          propertyType: data.propertyType || "",
          bedrooms: data.bedrooms?.toString() || "",
          bathrooms: data.bathrooms?.toString() || "",
          area: data.area?.toString() || "",
          images: data.images || [],
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (url) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }))
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const res = await fetch(`/api/properties/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push(`/properties/${params.id}`)
    else setError("Failed to update property")
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!property) return <div className="p-8">Property not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Property</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Beautiful 2BR apartment in downtown"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="input-field"
                placeholder="2500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={form.location}
                onChange={handleChange}
                className="input-field"
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Property Type *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                required
                value={form.propertyType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                className="input-field"
                placeholder="2"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                min="0"
                step="0.5"
                value={form.bathrooms}
                onChange={handleChange}
                className="input-field"
                placeholder="2"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area (sqft)
              </label>
              <input
                type="number"
                id="area"
                name="area"
                min="0"
                value={form.area}
                onChange={handleChange}
                className="input-field"
                placeholder="1200"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe your property..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
            <div className="space-y-2">
              {form.images.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input type="url" value={url} readOnly className="input-field flex-1" />
                  <button type="button" onClick={() => removeImage(index)} className="btn-secondary">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addImageUrl} className="btn-secondary flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Add Image URL</span>
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.back()} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}