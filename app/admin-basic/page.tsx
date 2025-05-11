"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminBasicPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simple auth check without using the auth context
  useEffect(() => {
    // Check localStorage directly
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          if (userData.role === "admin") {
            setIsAdmin(true)
          } else {
            router.push("/unauthorized")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!isAdmin) {
    return <div className="p-8 text-center">Redirecting...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Basic Admin Dashboard</h1>
        <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded">
          Back to Site
        </a>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Admin Navigation</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/admin/themes" className="px-4 py-2 bg-gray-200 rounded">
            Themes
          </a>
          <a href="/admin/content" className="px-4 py-2 bg-gray-200 rounded">
            Content
          </a>
          <a href="/admin/orders" className="px-4 py-2 bg-gray-200 rounded">
            Orders
          </a>
          <a href="/admin/analytics" className="px-4 py-2 bg-gray-200 rounded">
            Analytics
          </a>
          <a href="/admin/settings" className="px-4 py-2 bg-gray-200 rounded">
            Settings
          </a>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium">Total Users</h3>
            <p className="text-2xl font-bold">127</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium">QR Scans</h3>
            <p className="text-2xl font-bold">543</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-medium">Revenue</h3>
            <p className="text-2xl font-bold">$2,845</p>
          </div>
        </div>
      </div>
    </div>
  )
}
