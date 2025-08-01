"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  // Animation variants
  const navItemVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-800">Dream House</span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
              <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Home</span>
              </Link>
            </motion.div>

            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
              <Link href="/search" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                <Search className="h-5 w-5" />
                <span className="text-sm font-medium">Search</span>
              </Link>
            </motion.div>

            {user && (
              <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Link href="/properties/new" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">List Property</span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
                >
                  <User className="h-5 w-5 text-gray-700" />
                  {hasUnreadMessages && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"
                    />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
                    >
                      <Link
                        href="/messages"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <div className="relative">
                          <MessageSquare className="h-4 w-4 mr-3" />
                          {hasUnreadMessages && (
                            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                          )}
                        </div>
                        Messages
                      </Link>
                      <Link
                        href="/manage-properties"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Home className="h-4 w-4 mr-3" />
                        Manage Properties
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Sign In
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/auth/register" 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}


