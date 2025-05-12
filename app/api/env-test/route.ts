import { NextResponse } from "next/server"

export async function GET() {
  // Only show non-sensitive environment variables
  const safeVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
    VERCEL_ENV: process.env.VERCEL_ENV || "Not set",

    // Check if sensitive variables exist without revealing their values
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set (value hidden)" : "Not set",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Set (value hidden)" : "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (value hidden)" : "Not set",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "Set (value hidden)" : "Not set",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Set (value hidden)" : "Not set",
    ADMIN_SECRET: process.env.ADMIN_SECRET ? "Set (value hidden)" : "Not set",

    // OAuth providers
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Set (value hidden)" : "Not set",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Set (value hidden)" : "Not set",
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? "Set (value hidden)" : "Not set",
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET ? "Set (value hidden)" : "Not set",
  }

  return NextResponse.json({
    message: "Environment variables (safe ones only)",
    variables: safeVars,
    timestamp: new Date().toISOString(),
  })
}
