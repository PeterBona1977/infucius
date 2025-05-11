"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { getTeaTheme } from "@/lib/tea-themes"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save } from "lucide-react"

interface ThemeEditPageProps {
  params: {
    themeId: string
  }
}

export default function ThemeEditPage({ params }: ThemeEditPageProps) {
  const { themeId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState(getTeaTheme(themeId))
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    active: true,
    bgColor: "",
    borderColor: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Load theme data
  useEffect(() => {
    if (theme) {
      setFormData({
        name: theme.name,
        description: theme.description,
        active: theme.active,
        bgColor: theme.bgColor.replace("bg-", ""),
        borderColor: theme.borderColor.replace("border-", ""),
      })
    }
  }, [theme])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  if (!theme) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Theme Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested theme could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin">Back to Admin</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would update the database
      console.log("Saved theme:", {
        id: themeId,
        ...formData,
        bgColor: `bg-${formData.bgColor}`,
        borderColor: `border-${formData.borderColor}`,
      })
      setIsSaving(false)
      router.push("/admin")
    }, 1000)
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Theme: {theme.name}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Input
                  id="bgColor"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleChange}
                  placeholder="e.g., amber-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderColor">Border Color</Label>
                <Input
                  id="borderColor"
                  name="borderColor"
                  value={formData.borderColor}
                  onChange={handleChange}
                  placeholder="e.g., amber-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="active" checked={formData.active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="active">Active</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
