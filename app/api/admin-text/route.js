import { NextResponse } from "next/server"

export async function GET() {
  const text = `ADMIN DASHBOARD - API ROUTE

This is a plain text response from an API route.
It contains only plain text and should not trigger any errors.

=== NAVIGATION ===
- Home
- Themes
- Content
- Orders

=== QUICK STATS ===
Total Users: 127
QR Scans: 543
Revenue: $2,845

=== RECENT ACTIVITY ===
- New Order #ORD-005 (Today at 10:23 AM)
- User Registration: alice@example.com (Yesterday at 3:45 PM)
- Content Updated: About Page (Yesterday at 1:12 PM)
`

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
