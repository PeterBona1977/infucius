export default function AdminIsolatedThemesPage() {
  // Mock themes data
  const themes = [
    {
      id: "inspiration",
      name: "Inspiration",
      description: "A blend designed to ignite your creative spark and fuel your imagination.",
      active: true,
    },
    {
      id: "serenity",
      name: "Serenity",
      description: "Find your center with this calming blend that promotes peace and tranquility.",
      active: true,
    },
    {
      id: "adventure",
      name: "Adventure",
      description: "Embark on new journeys with this bold blend that awakens your spirit of exploration.",
      active: true,
    },
    {
      id: "joy",
      name: "Joy",
      description: "Celebrate life's moments with this uplifting blend that brings happiness with every sip.",
      active: false,
    },
  ]

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="/admin-isolated"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Back to Dashboard
          </a>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Tea Themes Management</h1>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Tea Themes</h2>
          <a
            href="/admin-isolated/themes/new"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "0.25rem",
              textDecoration: "none",
            }}
          >
            Create New Theme
          </a>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.25rem",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h3 style={{ fontWeight: "500" }}>{theme.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{theme.description}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span
                  style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    backgroundColor: theme.active ? "#10b981" : "#ef4444",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  {theme.active ? "Active" : "Inactive"}
                </span>
                <a
                  href={`/admin-isolated/themes/${theme.id}/edit`}
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  Edit
                </a>
                <a
                  href={`/admin-isolated/themes/${theme.id}/qr`}
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  QR Codes
                </a>
                <a
                  href={`/admin-isolated/themes/${theme.id}/messages`}
                  style={{
                    padding: "0.25rem 0.75rem",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  Messages
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
