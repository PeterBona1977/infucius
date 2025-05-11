import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Simple middleware that doesn't use any external packages
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin-basic/:path*"],
}
