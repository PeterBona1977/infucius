"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff } from "lucide-react"

interface QrScannerProps {
  onResult?: (result: string) => void
}

export function QrScanner({ onResult }: QrScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader")
        setScanning(true)

        const qrCodeSuccessCallback = (decodedText: string) => {
          // Handle the scanned code
          if (html5QrCode) {
            html5QrCode.stop().catch((error) => console.error("Error stopping scanner:", error))
            setScanning(false)
          }

          // Check if the QR code is valid for our app
          if (decodedText.startsWith("infucius:")) {
            const themeId = decodedText.split(":")[1]
            router.push(`/fortune/${themeId}`)
            if (onResult) onResult(decodedText)
          } else {
            alert("Invalid QR code. Please scan a valid Infucius tea QR code.")
          }
        }

        const config = { fps: 10, qrbox: { width: 250, height: 250 } }
        await html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, undefined)
      } catch (err) {
        console.error("Error starting QR scanner:", err)
        setPermissionDenied(true)
        setScanning(false)
      }
    }

    if (scanning && !html5QrCode) {
      startScanner()
    }

    return () => {
      if (html5QrCode) {
        // Check if scanning is active before attempting to stop
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch((error) => {
            // Just log the error but don't throw it to prevent component unmount issues
            console.log("Warning when stopping scanner:", error)
          })
        }
        // Clear the scanner element to prevent DOM issues
        const scannerElement = document.getElementById("qr-reader")
        if (scannerElement) {
          scannerElement.innerHTML = ""
        }
      }
    }
  }, [scanning, router, onResult])

  return (
    <div className="flex flex-col items-center gap-4">
      <div id="qr-reader" className="w-full"></div>
      {permissionDenied ? (
        <div className="text-center p-4">
          <CameraOff className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-4">
            Camera access was denied. Please allow camera access to scan QR codes.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        !scanning && (
          <Button onClick={() => setScanning(true)}>
            <Camera className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        )
      )}
    </div>
  )
}
