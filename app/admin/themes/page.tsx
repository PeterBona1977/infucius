"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTeaThemes } from "@/lib/tea-themes"
import { useAuth } from "@/contexts/auth-context"
import { PlusCircle, Edit, QrCode, MessageSquare } from "lucide-react"

export default function ThemesManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [themes, setThemes] = useState(getTeaThemes(false))

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

  // Function to toggle theme active status
  const toggleThemeStatus = (themeId: string) => {
    setThemes(themes.map((theme) => (theme.id === themeId ? { ...theme, active: !theme.active } : theme)))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
        <h1 className="text-2xl font-bold">Tea Themes Management</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tea Themes</CardTitle>
          <Button asChild>
            <Link href="/admin/themes/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Theme
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{theme.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button
                    variant={theme.active ? "default" : "destructive"}
                    size="sm"
                    onClick={() => toggleThemeStatus(theme.id)}
                  >
                    {theme.active ? "Active" : "Inactive"}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/themes/${theme.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/themes/${theme.id}/qr`}>
                      <QrCode className="h-4 w-4 mr-1" />
                      QR Codes
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/themes/${theme.id}/messages`}>
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Messages
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
