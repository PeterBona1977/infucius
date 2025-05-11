"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTeaTheme } from "@/lib/tea-themes"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Download, Printer, Share2 } from "lucide-react"

interface QRCodePageProps {
  params: {
    themeId: string
  }
}

export default function QRCodePage({ params }: QRCodePageProps) {
  const { themeId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [theme, setTheme] = useState(getTeaTheme(themeId))
  const [quantity, setQuantity] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrCodes, setQrCodes] = useState<string[]>([])

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

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

  const handleGenerateQRCodes = () => {
    setIsGenerating(true)

    // Simulate API call to generate QR codes
    setTimeout(() => {
      // In a real app, this would generate actual QR codes
      const newQRCodes = Array(quantity)
        .fill(0)
        .map((_, i) => `/placeholder.svg?height=200&width=200&text=QR-${theme.id}-${i + 1}`)
      setQrCodes(newQRCodes)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">QR Codes: {theme.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Generate QR Codes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Each QR code will link to a unique fortune message for the {theme.name} theme.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleGenerateQRCodes} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate QR Codes"}
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {qrCodes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {qrCodes.map((qrCode, index) => (
                    <div key={index} className="border rounded p-2 flex flex-col items-center">
                      <Image
                        src={qrCode || "/placeholder.svg"}
                        alt={`QR Code ${index + 1}`}
                        width={150}
                        height={150}
                        className="mb-2"
                      />
                      <p className="text-xs text-center text-muted-foreground">
                        {theme.name} #{index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {isGenerating ? <p>Generating QR codes...</p> : <p>Generate QR codes to see them here</p>}
                </div>
              )}
            </CardContent>
            {qrCodes.length > 0 && (
              <CardFooter className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
