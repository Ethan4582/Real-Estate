// 'use client'

// import { useState } from 'react'
// import { ChatBox } from "@/components/ChatBox"
// import { User } from "lucide-react"

// export function PropertyDetailClient({
//   property,
//   user
// }: {
//   property: {
//     id: number
//     ownerId: string
//     owner: {
//       id: string
//       name: string
//       email: string
//       phone?: string | null
//     }
//     interestedUsers?: Array<{
//       id: string
//       name: string
//     }>
//   }
//   user: {
//     id: string
//     name: string
//     email: string
//   } | null
// }) {
  
// }



'use client'

import { useState } from 'react'
import { ChatBox } from "@/components/ChatBox"
import { User } from "lucide-react"
import type { PropertyWithRelations } from "@/types/property"

export function PropertyDetailClient({
  property,
  user
}: {
  property: PropertyWithRelations
  user: {
    id: string
    name: string
    email: string
  } | null
}) {
  // ... rest of the component remains the same ...
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null)
  const canChat = user && user.id !== property.ownerId
  const isOwner = user && user.id === property.ownerId

  return (
    <>
      {/* Chat Box for non-owners */}
      {canChat ? (
        <ChatBox propertyId={property.id} receiverId={property.ownerId} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
          {!user ? (
            <p className="text-gray-600 mb-4">Please log in to contact the property owner.</p>
          ) : (
            <p className="text-gray-600 mb-4">This is your own property listing.</p>
          )}
        </div>
      )}

      {/* Messages from Interested Users (owner view) */}
      {isOwner && property.interestedUsers && property.interestedUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Messages from Interested Users</h3>
          {property.interestedUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setActiveChatUser(user.id)}
              className="block w-full text-left text-blue-600 hover:underline mb-2"
            >
              {user.name}
            </button>
          ))}
          {activeChatUser && (
            <ChatBox propertyId={property.id} receiverId={activeChatUser} />
          )}
        </div>
      )}
    </>
  )
}