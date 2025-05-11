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
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save, Eye } from "lucide-react"

// Mock pages data
const mockPages = [
  {
    id: "home",
    title: "Home Page",
    content: "<h1>Welcome to Infucius</h1><p>Discover personalized tea-inspired messages with every scan.</p>",
    metaTitle: "Infucius - Tea Fortune",
    metaDescription: "Discover personalized tea-inspired messages with every scan",
    lastUpdated: "2023-03-10",
    status: "published",
  },
  {
    id: "about",
    title: "About Us",
    content: "<h1>About Infucius</h1><p>Learn about our story and mission to bring personalized tea experiences.</p>",
    metaTitle: "About Us | Infucius",
    metaDescription: "Learn about the Infucius story and our mission",
    lastUpdated: "2023-02-15",
    status: "published",
  },
  {
    id: "terms",
    title: "Terms of Service",
    content: "<h1>Terms of Service</h1><p>Please read these terms carefully before using our service.</p>",
    metaTitle: "Terms of Service | Infucius",
    metaDescription: "Infucius terms of service and conditions of use",
    lastUpdated: "2023-01-20",
    status: "published",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    content: "<h1>Privacy Policy</h1><p>How we collect, use, and protect your personal information.</p>",
    metaTitle: "Privacy Policy | Infucius",
    metaDescription: "How Infucius protects your privacy and personal data",
    lastUpdated: "2023-01-20",
    status: "published",
  },
  {
    id: "faq",
    title: "FAQ",
    content: "<h1>Frequently Asked Questions</h1><p>Find answers to common questions about our service.</p>",
    metaTitle: "FAQ | Infucius",
    metaDescription: "Answers to frequently asked questions about Infucius",
    lastUpdated: "2023-03-05",
    status: "draft",
  },
]

interface PageEditorProps {
  params: {
    pageId: string
  }
}

export default function PageEditorPage({ params }: PageEditorProps) {
  const { pageId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [page, setPage] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    status: "draft",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Load page data
  useEffect(() => {
    const foundPage = mockPages.find((p) => p.id === pageId)
    if (foundPage) {
      setPage(foundPage)
      setFormData({
        title: foundPage.title,
        content: foundPage.content,
        metaTitle: foundPage.metaTitle,
        metaDescription: foundPage.metaDescription,
        status: foundPage.status,
      })
    }
  }, [pageId])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  if (!page) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested page could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/content">Back to Content</Link>
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

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, status: checked ? "published" : "draft" }))
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Saved page:", {
        id: pageId,
        ...formData,
        lastUpdated: new Date().toISOString().split("T")[0],
      })
      setIsSaving(false)
      router.push("/admin/content")
    }, 1000)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/content">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Page: {page.title}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required />
            <p className="text-xs text-muted-foreground">
              Enter HTML content for the page. In a real CMS, this would be a rich text editor.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input id="metaTitle" name="metaTitle" value={formData.metaTitle} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="published" checked={formData.status === "published"} onCheckedChange={handleStatusChange} />
            <Label htmlFor="published">{formData.status === "published" ? "Published" : "Draft"}</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            {formData.status === "published"
              ? "This page is visible to all users."
              : "This page is only visible to administrators."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/${pageId}`} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/content")}>
              Cancel
            </Button>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
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
      </Card>
    </div>
  )
}
