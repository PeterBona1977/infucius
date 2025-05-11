import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getPersonalizedFortuneMessage, applyPersonalizationRules } from "@/lib/fortune-service"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { themeId } = await request.json()

    if (!themeId) {
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    // Create server client
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user || undefined

    // Get personalized fortune message, passing the request for device info
    const fortune = await getPersonalizedFortuneMessage(themeId, user, request)

    // Apply personalization rules if user is logged in
    const personalizedFortune = user ? await applyPersonalizationRules(fortune, user) : fortune

    return NextResponse.json(personalizedFortune)
  } catch (error: any) {
    console.error("Error generating fortune:", error)
    return NextResponse.json({ error: error.message || "Failed to generate fortune" }, { status: 500 })
  }
}
