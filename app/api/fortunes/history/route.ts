import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserFortunes } from "@/lib/db"

export async function GET(request: Request) {
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

    // Get user's fortune history
    const fortunes = await getUserFortunes(session.user.id)

    return NextResponse.json(fortunes)
  } catch (error: any) {
    console.error("Error fetching fortune history:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch fortune history" }, { status: 500 })
  }
}
