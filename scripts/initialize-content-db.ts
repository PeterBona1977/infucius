import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeContentDatabase() {
  console.log("Initializing content database...")

  // Create content_blocks table if it doesn't exist
  const { error: tableError } = await supabase.rpc("create_content_blocks_table_if_not_exists", {})

  if (tableError) {
    console.error("Error creating content_blocks table:", tableError)

    // Try direct SQL approach if RPC fails
    const { error: sqlError } = await supabase.from("content_blocks").select("count(*)")

    if (sqlError && sqlError.code === "42P01") {
      // Table doesn't exist
      console.log("Creating content_blocks table via SQL...")

      const { error: createError } = await supabase.sql`
        CREATE TABLE IF NOT EXISTS content_blocks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          page TEXT NOT NULL,
          section TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          type TEXT NOT NULL DEFAULT 'text',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(page, section, key)
        );
      `

      if (createError) {
        console.error("Error creating content_blocks table via SQL:", createError)
        process.exit(1)
      }
    } else if (sqlError) {
      console.error("Error checking content_blocks table:", sqlError)
      process.exit(1)
    }
  }

  // Check if we have any content for the home page
  const { data: existingContent, error: countError } = await supabase
    .from("content_blocks")
    .select("*", { count: "exact" })
    .eq("page", "home")

  if (countError) {
    console.error("Error checking existing content:", countError)
    process.exit(1)
  }

  // If no content exists for home page, create default content
  if (!existingContent || existingContent.length === 0) {
    console.log("Creating default content for home page...")

    const defaultContent = [
      {
        page: "home",
        section: "hero",
        key: "title",
        value: "Discover Your Personalized Message",
        type: "text",
      },
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
      {
        page: "home",
        section: "scan",
        key: "note",
        value: "Each message is unique and crafted just for you.",
        type: "text",
      },
      {
        page: "home",
        section: "themes",
        key: "title",
        value: "Our Tea Themes",
        type: "text",
      },
    ]

    for (const content of defaultContent) {
      const { error: insertError } = await supabase.from("content_blocks").insert(content)

      if (insertError) {
        console.error(`Error inserting content ${content.key}:`, insertError)
      }
    }

    console.log("Default content initialized")
  } else {
    console.log(`Found ${existingContent.length} existing content blocks for home page`)
  }

  console.log("Content database initialization complete")
}

initializeContentDatabase()
  .then(() => {
    console.log("Done")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Initialization failed:", error)
    process.exit(1)
  })
