export default function AdminIsolatedPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Isolated Admin Dashboard</h1>
        <p style={{ marginTop: "0.5rem" }}>This page uses a completely isolated layout with no shared dependencies</p>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Navigation</h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Back to Home
          </a>
          <a
            href="/admin-isolated/themes"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Themes
          </a>
          <a
            href="/admin-isolated/content"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Content
          </a>
          <a
            href="/admin-isolated/orders"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Orders
          </a>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          padding: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Quick Stats</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "500" }}>Total Users</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>127</p>
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "500" }}>QR Scans</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>543</p>
          </div>
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.25rem",
              padding: "1rem",
            }}
          >
            <h3 style={{ fontWeight: "500" }}>Revenue</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>$2,845</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Recent Activity</h2>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li
            style={{
              padding: "0.75rem",
              borderLeft: "4px solid #3b82f6",
              backgroundColor: "#f9fafb",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontWeight: "500" }}>New Order #ORD-005</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Today at 10:23 AM</p>
          </li>
          <li
            style={{
              padding: "0.75rem",
              borderLeft: "4px solid #10b981",
              backgroundColor: "#f9fafb",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontWeight: "500" }}>User Registration: alice@example.com</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Yesterday at 3:45 PM</p>
          </li>
          <li
            style={{
              padding: "0.75rem",
              borderLeft: "4px solid #f59e0b",
              backgroundColor: "#f9fafb",
              marginBottom: "0.5rem",
            }}
          >
            <p style={{ fontWeight: "500" }}>Content Updated: About Page</p>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Yesterday at 1:12 PM</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
