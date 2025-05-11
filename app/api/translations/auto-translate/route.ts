import { NextResponse } from "next/server"
import { bulkTranslate } from "@/lib/translation-service"

export async function POST(request: Request) {
  try {
    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Failed to parse request body:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    // Log the received body for debugging
    console.log("Received translation request:", JSON.stringify(body, null, 2))

    // Validate required fields
    const { sourceLanguage, targetLanguages, translations } = body

    if (!sourceLanguage) {
      return NextResponse.json({ error: "Missing sourceLanguage" }, { status: 400 })
    }

    if (!targetLanguages || !Array.isArray(targetLanguages)) {
      return NextResponse.json({ error: "targetLanguages must be an array" }, { status: 400 })
    }

    if (!translations || typeof translations !== "object") {
      return NextResponse.json({ error: "translations must be an object" }, { status: 400 })
    }

    // Process translations for each target language
    const results = await Promise.all(
      targetLanguages.map(async (language: string) => {
        // Skip if source and target are the same
        if (language === sourceLanguage) {
          return { language, status: "skipped", added: 0 }
        }

        try {
          const result = await bulkTranslate({
            sourceLanguage,
            targetLanguage: language,
            translations,
          })

          // Here you would save the translations to your database or files
          // For now, we'll just return the result
          return {
            language,
            status: result.usedFallback ? "completed with fallback" : "updated",
            added: Object.keys(result.translations).length,
            note: result.usedFallback ? "Used fallback translation due to API issues" : undefined,
          }
        } catch (error) {
          console.error(`Error translating to ${language}:`, error)
          return {
            language,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            added: 0,
          }
        }
      }),
    )

    // Return results
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Auto-translation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
