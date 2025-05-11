"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  image?: string
  role: "user" | "admin" // Add role field
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (provider: string) => Promise<void>
  loginWithCredentials: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => {},
  loginWithCredentials: async () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContextValue)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Mock login function
  const login = async (provider: string) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mock user based on provider
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: provider === "google" ? "Google User" : "Facebook User",
        email: provider === "google" ? "user@gmail.com" : "user@facebook.com",
        image: `/placeholder.svg?height=40&width=40`,
        role: "user", // Default role is user
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mock credentials login
  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Admin credentials check
      if (email === "admin@infucius.com" && password === "admin123") {
        const mockUser: User = {
          id: `admin-${Math.random().toString(36).substr(2, 9)}`,
          name: "Admin User",
          email: email,
          role: "admin", // Set role as admin
        }

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)
      }
      // Regular user credentials check
      else if (email === "user@example.com" && password === "password") {
        const mockUser: User = {
          id: `user-${Math.random().toString(36).substr(2, 9)}`,
          name: "Test User",
          email: email,
          role: "user", // Set role as user
        }

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
