"use client"

import { useEffect, useRef } from "react"

export default function CanvasRenderPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px system-ui"
    ctx.fillText("Canvas Rendered Page", 20, 40)

    // Draw subtitle
    ctx.font = "16px system-ui"
    ctx.fillText("This page is rendered entirely using canvas with no external dependencies", 20, 70)

    // Draw card
    ctx.fillStyle = "#f8fafc"
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(20, 100, 760, 150, 8)
    ctx.fill()
    ctx.stroke()

    // Draw card title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px system-ui"
    ctx.fillText("Navigation", 40, 130)

    // Draw buttons
    const buttons = [
      { text: "Home", x: 40, y: 160, primary: true },
      { text: "Shop", x: 140, y: 160, primary: false },
      { text: "Scan QR", x: 240, y: 160, primary: false },
      { text: "Profile", x: 340, y: 160, primary: false },
    ]

    buttons.forEach((button) => {
      // Button background
      ctx.fillStyle = button.primary ? "#3b82f6" : "#e5e7eb"
      ctx.beginPath()
      ctx.roundRect(button.x, button.y, 80, 40, 4)
      ctx.fill()

      // Button text
      ctx.fillStyle = button.primary ? "#ffffff" : "#000000"
      ctx.font = "14px system-ui"
      ctx.fillText(button.text, button.x + 20, button.y + 25)
    })

    // Draw stats card
    ctx.fillStyle = "#f8fafc"
    ctx.strokeStyle = "#e2e8f0"
    ctx.beginPath()
    ctx.roundRect(20, 280, 760, 200, 8)
    ctx.fill()
    ctx.stroke()

    // Draw stats card title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 18px system-ui"
    ctx.fillText("Quick Stats", 40, 310)

    // Draw stat boxes
    const stats = [
      { title: "Total Users", value: "127", x: 40, y: 340 },
      { title: "QR Scans", value: "543", x: 280, y: 340 },
      { title: "Revenue", value: "$2,845", x: 520, y: 340 },
    ]

    stats.forEach((stat) => {
      // Stat box
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#e2e8f0"
      ctx.beginPath()
      ctx.roundRect(stat.x, stat.y, 200, 100, 4)
      ctx.fill()
      ctx.stroke()

      // Stat title
      ctx.fillStyle = "#64748b"
      ctx.font = "14px system-ui"
      ctx.fillText(stat.title, stat.x + 20, stat.y + 30)

      // Stat value
      ctx.fillStyle = "#000000"
      ctx.font = "bold 24px system-ui"
      ctx.fillText(stat.value, stat.x + 20, stat.y + 70)
    })
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          height: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <a
          href="/"
          style={{
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
