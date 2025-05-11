export default function AdminMinimalTextPage() {
  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", padding: "20px" }}>
      {`ADMIN DASHBOARD - MINIMAL TEXT

This is a minimal page with no imports or dependencies.
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
`}
    </div>
  )
}
