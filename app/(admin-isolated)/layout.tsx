import type React from "react"
export const metadata = {
  title: "Admin Isolated",
  description: "Isolated admin section",
}

export default function IsolatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
