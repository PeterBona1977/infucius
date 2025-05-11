import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/server"

export async function POST() {
  try {
    // Create the stored procedure to create the content_blocks table
    const { error } = await supabase.query(`
      CREATE OR REPLACE FUNCTION create_content_blocks_table()
      RETURNS void AS $$
      BEGIN
        -- Create the content_blocks table if it doesn't exist
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
        );
      END;
      $$ LANGUAGE plpgsql;
    `)

    if (error) {
      console.error("Error creating stored procedure:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Stored procedure created successfully" })
  } catch (error) {
    console.error("Error in create-content-function API route:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
