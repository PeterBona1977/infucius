"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save, Plus, Trash } from "lucide-react"
import { getPageContent, updateContentBlock, createContentBlock, type ContentBlock } from "@/lib/content-service"
import { useToast } from "@/components/ui/use-toast"

interface PageEditorProps {
  params: {
    page: string
  }
}

export default function ContentEditorPage({ params }: PageEditorProps) {
  const { page } = params
  const decodedPage = decodeURIComponent(page)
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Load page content
  useEffect(() => {
    async function loadContent() {
      try {
        const content = await getPageContent(decodedPage)
        setContentBlocks(content)
      } catch (error) {
        console.error(`Error loading content for page ${decodedPage}:`, error)
        toast({
          title: "Error",
          description: `Failed to load content for page ${decodedPage}`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (decodedPage) {
      loadContent()
    }
  }, [decodedPage, toast])

  if (loading || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  const handleContentChange = (id: string, field: keyof ContentBlock, value: string) => {
    setContentBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, [field]: value } : block)))
  }

  const handleAddContent = () => {
    const newBlock: ContentBlock = {
      id: `temp-${Date.now()}`,
      page: decodedPage,
      section: "",
      key: "",
      value: "",
      type: "text",
    }
    setContentBlocks((prev) => [...prev, newBlock])
  }

  const handleRemoveContent = (id: string) => {
    setContentBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Validate content blocks
      const invalidBlocks = contentBlocks.filter((block) => !block.section || !block.key)
      if (invalidBlocks.length > 0) {
        toast({
          title: "Validation Error",
          description: "All content blocks must have a section and key",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Process each content block
      for (const block of contentBlocks) {
        if (block.id.startsWith("temp-")) {
          // New block, create it
          const { id, created_at, updated_at, ...newBlock } = block
          await createContentBlock(newBlock)
        } else {
          // Existing block, update it
          await updateContentBlock(block.id, block)
        }
      }

      toast({
        title: "Success",
        description: "Content updated successfully",
      })

      // Reload content to get fresh IDs
      const updatedContent = await getPageContent(decodedPage)
      setContentBlocks(updatedContent)
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Error",
        description: "Failed to save content changes",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
        <h1 className="text-2xl font-bold">Edit Content: {decodedPage}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Page Content Blocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contentBlocks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No content blocks found for this page. Add some below.
            </div>
          ) : (
            contentBlocks.map((block) => (
              <div key={block.id} className="p-4 border rounded-md space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`section-${block.id}`}>Section</Label>
                    <Input
                      id={`section-${block.id}`}
                      value={block.section}
                      onChange={(e) => handleContentChange(block.id, "section", e.target.value)}
                      placeholder="e.g., hero, features, footer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`key-${block.id}`}>Key</Label>
                    <Input
                      id={`key-${block.id}`}
                      value={block.key}
                      onChange={(e) => handleContentChange(block.id, "key", e.target.value)}
                      placeholder="e.g., title, subtitle, description"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`type-${block.id}`}>Content Type</Label>
                  <select
                    id={`type-${block.id}`}
                    value={block.type}
                    onChange={(e) => handleContentChange(block.id, "type", e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="image">Image URL</option>
                    <option value="json">JSON</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`value-${block.id}`}>Content</Label>
                  {block.type === "html" || block.type === "json" ? (
                    <Textarea
                      id={`value-${block.id}`}
                      value={block.value}
                      onChange={(e) => handleContentChange(block.id, "value", e.target.value)}
                      rows={5}
                    />
                  ) : (
                    <Input
                      id={`value-${block.id}`}
                      value={block.value}
                      onChange={(e) => handleContentChange(block.id, "value", e.target.value)}
                    />
                  )}
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveContent(block.id)}>
                    <Trash className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}

          <Button onClick={handleAddContent} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Content Block
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/content")}>
            Cancel
          </Button>
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
