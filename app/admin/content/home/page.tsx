"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { upsertContent, getContentByKey, checkContentTableExists } from "@/lib/content-service"
import { useToast } from "@/hooks/use-toast"

export default function HomePageContentEditor() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [tableExists, setTableExists] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Hero section
  const [heroTitle, setHeroTitle] = useState("Discover Your Personalized Message")
  const [heroSubtitle, setHeroSubtitle] = useState("Scan, sip, and discover messages uniquely crafted for you.")

  // Scan section
  const [scanDescription, setScanDescription] = useState(
    "Scan the QR code on your tea package to receive a personalized message that resonates with your current state and surroundings.",
  )
  const [scanNote, setScanNote] = useState("Each message is unique and crafted just for you.")

  // Themes section
  const [themesTitle, setThemesTitle] = useState("Our Tea Themes")

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true)

        // Check if table exists
        const exists = await checkContentTableExists()
        setTableExists(exists)

        if (!exists) {
          setIsLoading(false)
          return
        }

        // Load hero content
        const heroTitleValue = await getContentByKey("home", "hero", "title")
        if (heroTitleValue) setHeroTitle(heroTitleValue)

        const heroSubtitleValue = await getContentByKey("home", "hero", "subtitle")
        if (heroSubtitleValue) setHeroSubtitle(heroSubtitleValue)

        // Load scan content
        const scanDescriptionValue = await getContentByKey("home", "scan", "description")
        if (scanDescriptionValue) setScanDescription(scanDescriptionValue)

        const scanNoteValue = await getContentByKey("home", "scan", "note")
        if (scanNoteValue) setScanNote(scanNoteValue)

        // Load themes content
        const themesTitleValue = await getContentByKey("home", "themes", "title")
        if (themesTitleValue) setThemesTitle(themesTitleValue)
      } catch (error) {
        console.error("Error loading homepage content:", error)
        toast({
          title: "Error",
          description: "Failed to load homepage content",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [toast])

  async function handleSave() {
    try {
      setIsSaving(true)

      if (!tableExists) {
        toast({
          title: "Error",
          description: "Content database not initialized. Please initialize it first.",
          variant: "destructive",
        })
        return
      }

      // Save hero content
      await upsertContent("home", "hero", "title", heroTitle)
      await upsertContent("home", "hero", "subtitle", heroSubtitle)

      // Save scan content
      await upsertContent("home", "scan", "description", scanDescription)
      await upsertContent("home", "scan", "note", scanNote)

      // Save themes content
      await upsertContent("home", "themes", "title", themesTitle)

      toast({
        title: "Success",
        description: "Homepage content saved successfully",
      })
    } catch (error) {
      console.error("Error saving homepage content:", error)
      toast({
        title: "Error",
        description: "Failed to save homepage content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading homepage content...</div>
  }

  if (!tableExists) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Content Database Not Initialized</CardTitle>
            <CardDescription>
              The content database needs to be initialized before you can edit homepage content.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <a href="/admin/content/initialize">Initialize Content Database</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Edit Homepage Content</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Edit the main hero section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Title</Label>
            <Input id="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtitle</Label>
            <Input id="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scan Section</CardTitle>
          <CardDescription>Edit the QR code scanning section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scanDescription">Description</Label>
            <Textarea
              id="scanDescription"
              value={scanDescription}
              onChange={(e) => setScanDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scanNote">Note</Label>
            <Input id="scanNote" value={scanNote} onChange={(e) => setScanNote(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Themes Section</CardTitle>
          <CardDescription>Edit the tea themes section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="themesTitle">Title</Label>
            <Input id="themesTitle" value={themesTitle} onChange={(e) => setThemesTitle(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
