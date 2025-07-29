"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Home, Search, Plus, User, LogOut, Bell, MessageSquare } from "lucide-react"

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    checkMessages()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    }
  }

  const checkMessages = async () => {
    try {
      const response = await fetch("/api/messages/unread")
      if (response.ok) {
        const { hasUnread } = await response.json()
        setHasUnreadMessages(hasUnread)
      }
    } catch (error) {
      console.error("Message check failed:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PropertyHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link href="/search" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="relative">
                    <User className="h-5 w-5 text-gray-700" />
                    {hasUnreadMessages && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/messages"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Messages
                      {hasUnreadMessages && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </Link>
                    <Link
                      href="/manage-properties"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Manage Properties
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}