"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getTeaTheme } from "@/lib/tea-themes"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Plus, Save, Trash2, Sparkles } from "lucide-react"
import { generateAIFortune } from "@/lib/ai-fortune-service"

interface MessagesPageProps {
  params: {
    themeId: string
  }
}

// Sample messages for each theme from the fortune.ts file
const themeMessages: Record<string, string[]> = {
  inspiration: [
    "The spark you've been seeking is already within you, waiting to be kindled.",
    "Today, your creativity will flow like the steam rising from your cup.",
    "Look to the patterns in your tea leaves – they mirror the patterns of opportunity in your life.",
    "The inspiration you seek is in the quiet moments between thoughts.",
    "A creative breakthrough awaits you where you least expect it.",
  ],
  serenity: [
    "Find peace in the space between breaths, just as flavor exists in the pause between sips.",
    "Like this tea, let warmth spread through you, melting away tension.",
    "The stillness in your cup reflects the calm you can cultivate within.",
    "Today, let your thoughts settle like tea leaves after the pour.",
    "Peace isn't found in the absence of chaos, but in your response to it.",
  ],
  adventure: [
    "The journey of a thousand miles begins with a single sip.",
    "New horizons await beyond the rim of your comfort zone.",
    "Like this tea's journey from distant lands, your path will cross unexpected territories.",
    "The best adventures often start with a moment of courage and a cup of tea.",
    "Today, let curiosity be your compass and boldness your map.",
  ],
}

export default function MessagesPage({ params }: MessagesPageProps) {
  const { themeId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState(getTeaTheme(themeId))
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Load messages for the theme
  useEffect(() => {
    if (theme) {
      // Get messages from our mock data or use empty array
      setMessages(themeMessages[themeId] || [])
    }
  }, [theme, themeId])

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

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, newMessage.trim()])
      setNewMessage("")
    }
  }

  const handleRemoveMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index))
  }

  const handleSaveMessages = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would save to the database
      console.log(`Saved messages for ${theme.name}:`, messages)
      setIsSaving(false)
      router.push("/admin")
    }, 1000)
  }

  const handleGenerateAIMessage = async () => {
    setIsGenerating(true)
    try {
      const aiContext = {
        themeId,
        themeName: theme.name,
        time: new Date(),
      }

      // Call our AI service to generate a fortune
      const aiMessage = await generateAIFortune(aiContext)
      setNewMessage(aiMessage)
    } catch (error) {
      console.error("Error generating AI message:", error)
      setNewMessage("Failed to generate AI message. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Messages: {theme.name}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="newMessage">Message Text</Label>
            <Textarea
              id="newMessage"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter a new fortune message..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleGenerateAIMessage} variant="outline" disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate AI Message"}
          </Button>
          <Button onClick={handleAddMessage} disabled={!newMessage.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Message
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded">
                  <div className="flex-1">
                    <p>{message}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveMessage(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No messages yet. Add your first message above.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          <Button onClick={handleSaveMessages} disabled={isSaving || messages.length === 0}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Messages
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
