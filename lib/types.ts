export interface User {
  id: number
  email: string
  name: string
  phone?: string
}

export interface Property {
  id: number
  title: string
  description?: string
  price: number
  location: string
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  ownerId: number
  owner?: User
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: number
  propertyId: number
  senderId: number
  receiverId: number
  content: string
  createdAt: string
  sender?: User
  receiver?: User
}

export interface SearchFilters {
  location?: string
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
}
