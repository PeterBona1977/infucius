import { NextResponse } from "next/server"
import { translateText } from "@/lib/translation-service"

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

    // Validate required fields
    const { sourceLanguage, targetLanguage, text } = body

    if (!sourceLanguage || !targetLanguage || !text) {
      return NextResponse.json(
        {
          error: "Missing required fields: sourceLanguage, targetLanguage, or text",
        },
        { status: 400 },
      )
    }

    // Translate the text
    const result = await translateText({
      sourceLanguage,
      targetLanguage,
      text,
    })

    // Return the translated text
    return NextResponse.json({
      translatedText: result.translatedText,
      success: true,
      usedFallback: result.usedFallback,
      error: result.error, // Pass through any error messages for client-side handling
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
