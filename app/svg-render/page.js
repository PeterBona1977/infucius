export default function SvgRenderPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>SVG Rendered Page</h1>
      <p style={{ marginBottom: "20px" }}>
        This page uses SVG for rendering complex elements without external dependencies.
      </p>

      <svg
        width="800"
        height="400"
        viewBox="0 0 800 400"
        style={{
          maxWidth: "100%",
          height: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          backgroundColor: "white",
        }}
      >
        {/* Card background */}
        <rect x="20" y="20" width="760" height="150" rx="8" ry="8" fill="#f8fafc" stroke="#e2e8f0" />

        {/* Card title */}
        <text x="40" y="50" fontFamily="system-ui" fontSize="18" fontWeight="bold">
          Navigation
        </text>

        {/* Buttons */}
        <g>
          {/* Home button */}
          <rect x="40" y="70" width="80" height="40" rx="4" ry="4" fill="#3b82f6" />
          <text x="60" y="95" fontFamily="system-ui" fontSize="14" fill="white">
            Home
          </text>

          {/* Shop button */}
          <rect x="140" y="70" width="80" height="40" rx="4" ry="4" fill="#e5e7eb" />
          <text x="160" y="95" fontFamily="system-ui" fontSize="14">
            Shop
          </text>

          {/* Scan QR button */}
          <rect x="240" y="70" width="80" height="40" rx="4" ry="4" fill="#e5e7eb" />
          <text x="250" y="95" fontFamily="system-ui" fontSize="14">
            Scan QR
          </text>

          {/* Profile button */}
          <rect x="340" y="70" width="80" height="40" rx="4" ry="4" fill="#e5e7eb" />
          <text x="360" y="95" fontFamily="system-ui" fontSize="14">
            Profile
          </text>
        </g>

        {/* Stats card background */}
        <rect x="20" y="190" width="760" height="190" rx="8" ry="8" fill="#f8fafc" stroke="#e2e8f0" />

        {/* Stats card title */}
        <text x="40" y="220" fontFamily="system-ui" fontSize="18" fontWeight="bold">
          Quick Stats
        </text>

        {/* Stat boxes */}
        <g>
          {/* Total Users */}
          <rect x="40" y="240" width="200" height="100" rx="4" ry="4" fill="white" stroke="#e2e8f0" />
          <text x="60" y="270" fontFamily="system-ui" fontSize="14" fill="#64748b">
            Total Users
          </text>
          <text x="60" y="310" fontFamily="system-ui" fontSize="24" fontWeight="bold">
            127
          </text>

          {/* QR Scans */}
          <rect x="280" y="240" width="200" height="100" rx="4" ry="4" fill="white" stroke="#e2e8f0" />
          <text x="300" y="270" fontFamily="system-ui" fontSize="14" fill="#64748b">
            QR Scans
          </text>
          <text x="300" y="310" fontFamily="system-ui" fontSize="24" fontWeight="bold">
            543
          </text>

          {/* Revenue */}
          <rect x="520" y="240" width="200" height="100" rx="4" ry="4" fill="white" stroke="#e2e8f0" />
          <text x="540" y="270" fontFamily="system-ui" fontSize="14" fill="#64748b">
            Revenue
          </text>
          <text x="540" y="310" fontFamily="system-ui" fontSize="24" fontWeight="bold">
            $2,845
          </text>
        </g>
      </svg>

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
