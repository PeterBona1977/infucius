import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "Supabase environment variables are not set",
          variables: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
          },
        },
        { status: 500 },
      )
    }

    // Create Supabase client with service role key for admin access
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test connection by listing tables
    const { data: tables, error: tablesError } = await supabase
      .from("pg_catalog.pg_tables")
      .select("schemaname, tablename")
      .eq("schemaname", "public")

    if (tablesError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to query database tables",
          error: tablesError,
        },
        { status: 500 },
      )
    }

    // Try to get some actual data
    let sampleData = {}
    if (tables && tables.length > 0) {
      // Try to get a few rows from the first table
      const firstTable = tables[0].tablename
      const { data: rows, error: rowsError } = await supabase.from(firstTable).select("*").limit(3)

      if (!rowsError) {
        sampleData = {
          table: firstTable,
          rowCount: rows?.length || 0,
          sample: rows,
        }
      }
    }

    return NextResponse.json({
      status: "connected",
      message: "Successfully connected to Supabase",
      tables: tables?.map((t) => t.tablename) || [],
      tableCount: tables?.length || 0,
      sampleData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
