// WARNING: This file should only be imported in server components or API routes
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Create a mock cookies implementation for when real cookies aren't available
const mockCookies = {
  get: (name: string) => null,
  set: (name: string, value: string, options: any) => {},
  remove: (name: string, options: any) => {},
}

// Export createClient function with optional cookies parameter
export const createClient = (cookies?: any) => {
  // Use mock cookies if none are provided
  const cookieStore = cookies || mockCookies

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get?.(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set?.({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set?.({ name, value: "", ...options })
        },
      },
    },
  )
}

// Export createServerClient for backward compatibility
export const createServerClient = createClient

// Export a placeholder supabase object for backward compatibility
export const supabase = {
  from: (table: string) => {
    console.warn("Using server.ts supabase client directly is not recommended")
    return {
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: new Error("Not implemented") }),
        }),
      }),
      insert: () => ({ data: null, error: new Error("Not implemented") }),
      update: () => ({ data: null, error: new Error("Not implemented") }),
    }
  },
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
}
