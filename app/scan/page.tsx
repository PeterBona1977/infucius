import type { Metadata } from "next"
import { QrScanner } from "@/components/qr-scanner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Scan QR Code | Infucius",
  description: "Scan your tea QR code to receive your personalized message",
}

export default function ScanPage() {
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Scan Your Tea QR Code</CardTitle>
          <CardDescription>
            Point your camera at the QR code on your tea package to receive your personalized message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-full overflow-hidden rounded-md">
            <QrScanner />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
