import { NextResponse } from "next/server"

export async function GET() {
  // Only show if environment variables are set, not their values
  const envStatus = {
    // NextAuth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "Set" : "Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set" : "Missing",

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",

    // OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? "Set" : "Missing",
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? "Set" : "Missing",

    // OpenAI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set" : "Missing",

    // Admin
    ADMIN_SECRET: process.env.ADMIN_SECRET ? "Set" : "Missing",
  }

  // Count how many are set vs missing
  const counts = {
    set: Object.values(envStatus).filter((status) => status === "Set").length,
    missing: Object.values(envStatus).filter((status) => status === "Missing").length,
    total: Object.keys(envStatus).length,
  }

  return NextResponse.json({
    status:
      counts.missing === 0 ? "All environment variables are set" : `Missing ${counts.missing} environment variables`,
    environment: envStatus,
    counts: counts,
    timestamp: new Date().toISOString(),
  })
}
