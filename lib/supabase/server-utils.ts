import { cookies } from "next/headers"
import { createClient } from "./server"

// This function should only be used in server components or API routes
export function createServerClient() {
  try {
    // Try to get cookies from the request
    const cookieStore = cookies()
    return createClient(cookieStore)
  } catch (error) {
    // If cookies() fails (e.g., in API routes), use the client without cookies
    return createClient()
  }
}
