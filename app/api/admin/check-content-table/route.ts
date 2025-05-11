import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("content_blocks").select("id").limit(1)

    if (error && error.message.includes("does not exist")) {
      return NextResponse.json({
        exists: false,
        message: "The content_blocks table does not exist in the database",
      })
    }

    return NextResponse.json({
      exists: true,
      message: "The content_blocks table exists in the database",
    })
  } catch (error) {
    console.error("Error in check-content-table API route:", error)
    return NextResponse.json({ exists: false, error: String(error) }, { status: 500 })
  }
}
