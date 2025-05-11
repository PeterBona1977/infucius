import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient()

    // Check if the table already exists
    const { error: checkError } = await supabase.from("content_blocks").select("id").limit(1)

    if (!checkError) {
      return NextResponse.json({ success: true, message: "Content blocks table already exists" })
    }

    if (checkError.code !== "42P01") {
      return NextResponse.json(
        { success: false, error: `Error checking table: ${checkError.message}` },
        { status: 500 },
      )
    }

    // Create the content_blocks table
    try {
      // Create the uuid-ossp extension if it doesn't exist
      await supabase.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

      // Create the content_blocks table
      const { error: createError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS content_blocks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          page TEXT NOT NULL,
          section TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          type TEXT DEFAULT 'text',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(page, section, key)
        )
      `)

      if (createError) {
        return NextResponse.json(
          { success: false, error: `Error creating table: ${createError.message}` },
          { status: 500 },
        )
      }
    } catch (error) {
      return NextResponse.json({ success: false, error: `Error creating table: ${String(error)}` }, { status: 500 })
    }

    // Initialize default content for the homepage
    const defaultContent = [
      { page: "home", section: "hero", key: "title", value: "Discover Your Personalized Message", type: "text" },
      {
        page: "home",
        section: "hero",
        key: "subtitle",
        value: "Scan, sip, and discover messages uniquely crafted for you.",
        type: "text",
      },
      {
        page: "home",
        section: "scan",
        key: "description",
        value:
          "Scan the QR code on your tea package to receive a personalized message that resonates with your current state and surroundings.",
        type: "text",
      },
      { page: "home", section: "scan", key: "button", value: "Scan Your Tea QR Code", type: "text" },
      {
        page: "home",
        section: "scan",
        key: "note",
        value: "Each message is unique and crafted just for you.",
        type: "text",
      },
      { page: "home", section: "themes", key: "title", value: "Our Tea Themes", type: "text" },
    ]

    for (const content of defaultContent) {
      const { error: insertError } = await supabase.from("content_blocks").insert(content)

      if (insertError && insertError.code !== "23505") {
        // Ignore unique constraint violations
        console.error(
          `Error inserting default content for ${content.page}/${content.section}/${content.key}:`,
          insertError,
        )
      }
    }

    return NextResponse.json({ success: true, message: "Content blocks table created and initialized" })
  } catch (error) {
    console.error("Error in initialize-content API route:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
