import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Message History | Infucius",
  description: "View your personalized tea message history",
}

// This would be fetched from a database in a real app
const mockHistory = [
  {
    id: "msg1",
    themeId: "inspiration",
    themeName: "Inspiration",
    message: "The spark you've been seeking is already within you, waiting to be kindled.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "msg2",
    themeId: "serenity",
    themeName: "Serenity",
    message: "Find peace in the space between breaths, just as flavor exists in the pause between sips.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
  },
  {
    id: "msg3",
    themeId: "adventure",
    themeName: "Adventure",
    message: "The journey of a thousand miles begins with a single sip.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
]

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Message History</h1>

      {mockHistory.length > 0 ? (
        <div className="grid gap-6 max-w-2xl mx-auto">
          {mockHistory.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.themeName} Tea</CardTitle>
                <CardDescription>
                  {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic">"{item.message}"</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/shop/${item.themeId}`}>Shop Again</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/fortune/${item.themeId}`}>New Message</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Messages Yet</CardTitle>
            <CardDescription>Scan a tea QR code to receive your first personalized message</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/scan">Scan QR Code</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
