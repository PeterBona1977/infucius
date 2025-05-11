"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function MinimalAdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/unauthorized")
      }
    }
  }, [loading, user, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/">Back to Site</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a minimal version of the admin dashboard to troubleshoot loading issues.</p>
          <div className="mt-4">
            <Button asChild className="mr-2">
              <Link href="/admin/themes">Manage Themes</Link>
            </Button>
            <Button asChild className="mr-2">
              <Link href="/admin/content">Manage Content</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/orders">Manage Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
