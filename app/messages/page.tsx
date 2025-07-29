"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PropertyWithMessages } from "@/types/type"

const LOCAL_STORAGE_KEY = "propertyMessagesCache"
const CACHE_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes cache expiry

export default function MessagesPage() {
  const [properties, setProperties] = useState<PropertyWithMessages[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)
        const now = new Date().getTime()
        
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          if (now - timestamp < CACHE_EXPIRY_MS) {
            setProperties(data)
            setLoading(false)
            return
          }
        }

        // Fetch fresh data if cache is expired or doesn't exist
        const res = await fetch("/api/messages/properties")
        if (!res.ok) throw new Error("Failed to fetch properties")
        
        const data = await res.json()
        setProperties(data)
        
        // Update cache
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            data,
            timestamp: now
          })
        )
      } catch (error) {
        console.error("Failed to fetch properties:", error)
        // If fetch fails but we have cached data, use that
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (cachedData) {
          const { data } = JSON.parse(cachedData)
          setProperties(data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const clearCache = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setLoading(true)
    fetchProperties() // You'll need to hoist this function or reimplement
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Your Messages</h1>
          <p className="text-gray-600">View all your property conversations</p>
        </div>
        <button 
          onClick={clearCache}
          className="text-sm text-blue-600 hover:underline"
          title="Refresh messages"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No messages found.</p>
          <Link href="/properties" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Link 
              href={`/properties/${property.id}`}
              key={property.id}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{property.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{property.address}</p>
                    {property.latestMessage && (
                      <div className="mt-2">
                        <p className="text-gray-600 truncate">
                          <span className="font-medium">
                            {property.latestMessage.senderId === property.userId ? "You" : property.latestMessage.sender.name}:
                          </span>{" "}
                          {property.latestMessage.content}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(property.latestMessage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                      {property.unreadCount > 0 ? (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs absolute -mt-6 -mr-6">
                          {property.unreadCount}
                        </span>
                      ) : null}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}