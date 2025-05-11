import type React from "react"
export default function AdminIsolatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.25rem" }}>Infucius Admin (Isolated)</div>
        <a
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          Back to Site
        </a>
      </div>
      {children}
    </div>
  )
}
