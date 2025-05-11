"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Edit, Eye, FileText, Image, Layout, Globe } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare } from "lucide-react"

// Mock content data
const mockPages = [
  { id: "home", title: "Home Page", lastUpdated: "2023-03-10", status: "published" },
  { id: "about", title: "About Us", lastUpdated: "2023-02-15", status: "published" },
  { id: "terms", title: "Terms of Service", lastUpdated: "2023-01-20", status: "published" },
  { id: "privacy", title: "Privacy Policy", lastUpdated: "2023-01-20", status: "published" },
  { id: "faq", title: "FAQ", lastUpdated: "2023-03-05", status: "draft" },
]

const mockBlogPosts = [
  {
    id: "post-1",
    title: "The Art of Tea Brewing",
    author: "Jane Smith",
    date: "2023-03-01",
    status: "published",
    excerpt: "Discover the ancient techniques for brewing the perfect cup of tea...",
  },
  {
    id: "post-2",
    title: "Tea Ceremonies Around the World",
    author: "John Doe",
    date: "2023-02-15",
    status: "published",
    excerpt: "From Japanese matcha ceremonies to British afternoon tea...",
  },
  {
    id: "post-3",
    title: "Health Benefits of Different Tea Types",
    author: "Dr. Alice Williams",
    date: "2023-03-10",
    status: "draft",
    excerpt: "Scientific research on how various teas can improve your health...",
  },
]

const mockAssets = [
  {
    id: "asset-1",
    name: "Hero Banner",
    type: "image",
    size: "1.2 MB",
    dimensions: "1920x1080",
    uploaded: "2023-02-10",
  },
  { id: "asset-2", name: "Logo", type: "image", size: "0.5 MB", dimensions: "500x500", uploaded: "2023-01-15" },
  { id: "asset-3", name: "Product Catalog", type: "pdf", size: "3.5 MB", dimensions: "-", uploaded: "2023-03-05" },
  { id: "asset-4", name: "Tea Brewing Guide", type: "pdf", size: "1.8 MB", dimensions: "-", uploaded: "2023-02-20" },
]

export default function ContentManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pages")
  const [pages, setPages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tableExists, setTableExists] = useState(false)
  const [editablePages, setEditablePages] = useState<string[]>([])
  const [isLoadingPages, setIsLoadingPages] = useState(true)

  // Update the useEffect to check for admin role
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/unauthorized")
      }
    }
  }, [loading, user, router])

  // Load editable pages
  useEffect(() => {
    async function loadPages() {
      try {
        // Check if table exists using the API
        const tableCheckResponse = await fetch("/api/admin/check-content-table")
        const tableCheckData = await tableCheckResponse.json()
        setTableExists(tableCheckData.exists)

        if (!tableCheckData.exists) {
          setIsLoading(false)
          setIsLoadingPages(false)
          return
        }

        // Get content pages using the API
        const pagesResponse = await fetch("/api/content?type=pages")
        const pagesData = await pagesResponse.json()

        if (Array.isArray(pagesData)) {
          setPages(pagesData)
          setEditablePages(pagesData)
        }
      } catch (error) {
        console.error("Error loading editable pages:", error)
      } finally {
        setIsLoading(false)
        setIsLoadingPages(false)
      }
    }

    loadPages()
  }, [])

  // Update the conditional rendering
  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        {!tableExists ? (
          <Card>
            <CardHeader>
              <CardTitle>Content Database Not Initialized</CardTitle>
              <CardDescription>
                The content database needs to be initialized before you can manage content.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/content/initialize">Initialize Content Database</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Content Database</CardTitle>
              <CardDescription>
                Initialize the content database to enable editable content throughout the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                If you're seeing errors about the content_blocks table not existing, you need to initialize the content
                database.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/admin/content/initialize">Initialize Content Database</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="editable" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Editable Content
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Assets
          </TabsTrigger>
        </TabsList>

        {/* Editable Content Tab */}
        <TabsContent value="editable">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Editable Website Content</CardTitle>
              <Button asChild>
                <Link href="/admin/content/edit/home">Edit Home Page</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingPages ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        Loading pages...
                      </TableCell>
                    </TableRow>
                  ) : editablePages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No editable pages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    editablePages.map((page) => (
                      <TableRow key={page}>
                        <TableCell className="font-medium capitalize">{page}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/content/edit/${encodeURIComponent(page)}`}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/${page === "home" ? "" : page}`} target="_blank">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pages Tab */}
        <TabsContent value="pages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Website Pages</CardTitle>
              <Button asChild>
                <Link href="/admin/content/pages/new">Create New Page</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            page.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {page.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/content/pages/${page.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/${page.id}`} target="_blank">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Blog Posts</CardTitle>
              <Button asChild>
                <Link href="/admin/content/blog/new">Create New Post</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBlogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{post.date}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/content/blog/${post.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.id}`} target="_blank">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Assets Tab */}
        <TabsContent value="assets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Media Assets</CardTitle>
              <Button>Upload New Asset</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell>{asset.size}</TableCell>
                      <TableCell>{asset.dimensions}</TableCell>
                      <TableCell>{asset.uploaded}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="themes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tea Themes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild className="w-full">
                <Link href="/admin/themes">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Manage Themes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
