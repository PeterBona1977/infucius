import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserPreferences, setUserPreference, removeUserPreference } from "@/lib/db"

// Get user preferences
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

    // Get user preferences
    const preferences = await getUserPreferences(session.user.id)

    return NextResponse.json(preferences)
  } catch (error: any) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch preferences" }, { status: 500 })
  }
}

// Set user preference
export async function POST(request: Request) {
  try {
    const { themeId } = await request.json()

    if (!themeId) {
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Set user preference
    const preference = await setUserPreference(session.user.id, themeId)

    return NextResponse.json(preference)
  } catch (error: any) {
    console.error("Error setting preference:", error)
    return NextResponse.json({ error: error.message || "Failed to set preference" }, { status: 500 })
  }
}

// Remove user preference
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get("themeId")

    if (!themeId) {
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove user preference
    await removeUserPreference(session.user.id, themeId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error removing preference:", error)
    return NextResponse.json({ error: error.message || "Failed to remove preference" }, { status: 500 })
  }
}
