"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getTeaThemes } from "@/lib/tea-themes"

export default function TeaPreferencesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState<Record<string, boolean>>({})
  const themes = getTeaThemes(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Initialize preferences with mock data
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      // For now, we'll set some default preferences
      setPreferences({
        inspiration: true,
        serenity: true,
        adventure: false,
        joy: true,
        "well-being": true,
        mysticism: false,
        introspection: true,
      })
    }
  }, [user])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  const handleTogglePreference = (themeId: string) => {
    setPreferences((prev) => ({
      ...prev,
      [themeId]: !prev[themeId],
    }))
  }

  const handleSavePreferences = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would save to the database
      console.log("Saved preferences:", preferences)
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Tea Preferences</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Tea Preferences</CardTitle>
          <CardDescription>
            Select the tea themes you prefer. These preferences will be used to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {themes.map((theme) => (
              <div key={theme.id} className="flex items-start space-x-3 space-y-0">
                <Checkbox
                  id={theme.id}
                  checked={preferences[theme.id] || false}
                  onCheckedChange={() => handleTogglePreference(theme.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={theme.id} className="text-base">
                    {theme.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Notification Preferences</h3>
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox id="email-notifications" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="email-notifications" className="text-base">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new tea releases and personalized recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 space-y-0">
              <Checkbox id="special-offers" defaultChecked />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="special-offers" className="text-base">
                  Special Offers
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about special offers and discounts.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePreferences} disabled={isSaving} className="ml-auto">
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
