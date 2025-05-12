import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Basic environment info
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL ? "Set" : "Missing",
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
      googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
      facebookClientId: process.env.FACEBOOK_CLIENT_ID ? "Set" : "Missing",
      openaiApiKey: process.env.OPENAI_API_KEY ? "Set" : "Missing",
      adminSecret: process.env.ADMIN_SECRET ? "Set" : "Missing",
    }

    // Test Supabase connection
    let supabaseStatus = "Not tested"
    let tables = []

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

        const { data, error } = await supabase
          .from("pg_catalog.pg_tables")
          .select("tablename")
          .eq("schemaname", "public")

        if (error) {
          supabaseStatus = `Error: ${error.message}`
        } else {
          supabaseStatus = "Connected"
          tables = data?.map((t) => t.tablename) || []
        }
      } catch (e) {
        supabaseStatus = `Exception: ${e instanceof Error ? e.message : String(e)}`
      }
    } else {
      supabaseStatus = "Missing credentials"
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envInfo,
      supabase: {
        status: supabaseStatus,
        tables: tables,
      },
      deployment: {
        url: process.env.VERCEL_URL || "Unknown",
        environment: process.env.VERCEL_ENV || "Unknown",
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred while gathering debug information",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
