import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// Remove all user preferences
export async function POST(request: Request) {
  try {
    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove all user preferences
    const { error } = await supabase.from("user_preferences").delete().eq("user_id", session.user.id)

    if (error) {
      console.error("Error removing preferences:", error)
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error removing preferences:", error)
    return NextResponse.json({ error: error.message || "Failed to remove preferences" }, { status: 500 })
  }
}
