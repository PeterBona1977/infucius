import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Check if the path is an admin route
  if (pathname.startsWith("/admin")) {
    // For client-side auth, we'll let the admin page component handle the auth check
    // This middleware will just pass through and let the client-side auth handle redirection
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
