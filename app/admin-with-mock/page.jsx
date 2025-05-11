// Import icons from our mock implementation instead of lucide-react
import { Home, Settings, ShoppingBag } from "../../lib/mock-lucide"

export default function AdminWithMockPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Admin Dashboard (With Mock Icons)</h1>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Navigation</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/"
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Home /> Back to Home
          </a>
          <a
            href="#themes"
            style={{
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ShoppingBag /> Themes
          </a>
          <a
            href="#settings"
            style={{
              padding: "8px 16px",
              backgroundColor: "#e5e7eb",
              borderRadius: "4px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Settings /> Settings
          </a>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Quick Stats</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h3 style={{ fontWeight: "500", marginBottom: "8px" }}>Total Users</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>127</p>
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h3 style={{ fontWeight: "500", marginBottom: "8px" }}>QR Scans</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>543</p>
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <h3 style={{ fontWeight: "500", marginBottom: "8px" }}>Revenue</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>$2,845</p>
          </div>
        </div>
      </div>
    </div>
  )
}
