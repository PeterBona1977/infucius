"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [currentLocation, setCurrentLocation] = useState<string>("Fetching location...")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Get user's location with fallback
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // First try to use a mock location service that doesn't require geolocation permissions
        setCurrentLocation("Determining location...")

        // Simulate an API call to get location based on IP address
        // In a real app, you would use a service like ipapi.co or ipinfo.io
        setTimeout(() => {
          // This would normally be the result of the IP geolocation API
          setCurrentLocation("San Francisco, CA (IP based)")
        }, 1000)

        // In a real app, you would do something like:
        // const response = await fetch('https://ipapi.co/json/');
        // const data = await response.json();
        // setCurrentLocation(`${data.city}, ${data.region} (IP based)`);
      } catch (error) {
        console.error("Error getting location:", error)
        setCurrentLocation("Location unavailable")
      }
    }

    fetchLocation()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="text-2xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/profile/preferences">Tea Preferences</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p>{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                <p className="truncate">{user.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p className="capitalize">{user.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Birth Date</h3>
                <p>January 1, 1990</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                <p>+1 555-123-4567</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Known Location</h3>
                <p>{currentLocation}</p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground">I love tea because...</h3>
              <p className="mt-1 italic">"It brings me a moment of calm in a busy day."</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
