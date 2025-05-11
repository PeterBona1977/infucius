// This file uses only raw JavaScript with no JSX or imports

import React from "react"

export default function AdminRawPage() {
  // Use React.createElement to create a valid React element
  return React.createElement(
    "div",
    {
      style: {
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        padding: "20px",
      },
    },
    "ADMIN DASHBOARD - RAW JS\n\nThis is a raw JavaScript page with no JSX or imports.\nIt contains only plain text and should not trigger any errors.\n\n=== NAVIGATION ===\n- Home\n- Themes\n- Content\n- Orders\n\n=== QUICK STATS ===\nTotal Users: 127\nQR Scans: 543\nRevenue: $2,845\n\n=== RECENT ACTIVITY ===\n- New Order #ORD-005 (Today at 10:23 AM)\n- User Registration: alice@example.com (Yesterday at 3:45 PM)\n- Content Updated: About Page (Yesterday at 1:12 PM)",
  )
}
