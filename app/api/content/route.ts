import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page")
    const section = searchParams.get("section")
    const key = searchParams.get("key")

    if (!page || !section || !key) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create client without cookies for API routes
    const supabase = createClient()

    const { data, error } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("page", page)
      .eq("section", section)
      .eq("key", key)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Content not found
        return NextResponse.json({ value: null })
      }

      if (error.message.includes("does not exist")) {
        // Table doesn't exist
        return NextResponse.json({ value: null })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ value: data.value })
  } catch (error) {
    console.error("Error in content API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, section, key, value } = body

    if (!page || !section || !key || value === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create client without cookies for API routes
    const supabase = createClient()

    const { error } = await supabase.from("content_blocks").upsert({ page, section, key, value })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in content API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
