"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Scan } from "lucide-react"
import { QrScanner } from "@/components/qr-scanner"

export function QrScanButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Scan className="h-5 w-5" />
          Scan Your Tea QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-md">
          <QrScanner onResult={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
