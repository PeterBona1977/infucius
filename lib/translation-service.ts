// Translation service using OpenAI with fallback to mock translations
import { createClient } from "@supabase/supabase-js"

// Types for translation
export interface TranslationRequest {
  sourceLanguage: string
  targetLanguage: string
  text: string
}

export interface TranslationResponse {
  translatedText: string
  success: boolean
  error?: string
  usedFallback?: boolean
}

export interface BulkTranslationRequest {
  sourceLanguage: string
  targetLanguage: string
  translations: Record<string, string>
}

export interface BulkTranslationResponse {
  translations: Record<string, string>
  success: boolean
  error?: string
  usedFallback?: boolean
}

// Enhanced mock translation system for fallback
function mockTranslate(text: string, targetLanguage: string): string {
  // Skip translation if text is empty
  if (!text || text.trim() === "") {
    return text
  }

  // This is a sophisticated mock that simulates translations
  // for demo and testing purposes
  const langPrefixes: Record<string, (text: string) => string> = {
    es: (text) => {
      // Spanish-like transformations
      return text
        .replace(/the /gi, "el ")
        .replace(/The /g, "El ")
        .replace(/is /gi, "es ")
        .replace(/are /gi, "son ")
        .replace(/and /gi, "y ")
        .replace(/or /gi, "o ")
        .replace(/welcome/gi, "bienvenido")
        .replace(/hello/gi, "hola")
        .replace(/thank you/gi, "gracias")
        .replace(/please/gi, "por favor")
        .replace(/tea/gi, "té")
        .replace(/fortune/gi, "fortuna")
        .replace(/reading/gi, "lectura")
        .replace(/discover/gi, "descubrir")
        .replace(/explore/gi, "explorar")
        .replace(/collection/gi, "colección")
        .replace(/ancient/gi, "antiguo")
        .replace(/art/gi, "arte")
        .replace(/get/gi, "obtener")
        .replace(/your/gi, "tu")
    },
    fr: (text) => {
      // French-like transformations
      return text
        .replace(/the /gi, "le ")
        .replace(/The /g, "Le ")
        .replace(/is /gi, "est ")
        .replace(/are /gi, "sont ")
        .replace(/and /gi, "et ")
        .replace(/or /gi, "ou ")
        .replace(/welcome/gi, "bienvenue")
        .replace(/hello/gi, "bonjour")
        .replace(/thank you/gi, "merci")
        .replace(/please/gi, "s'il vous plaît")
        .replace(/tea/gi, "thé")
        .replace(/fortune/gi, "fortune")
        .replace(/reading/gi, "lecture")
        .replace(/discover/gi, "découvrir")
        .replace(/explore/gi, "explorer")
        .replace(/collection/gi, "collection")
        .replace(/ancient/gi, "ancien")
        .replace(/art/gi, "art")
        .replace(/get/gi, "obtenir")
        .replace(/your/gi, "votre")
    },
    de: (text) => {
      // German-like transformations
      return text
        .replace(/the /gi, "die ")
        .replace(/The /g, "Die ")
        .replace(/is /gi, "ist ")
        .replace(/are /gi, "sind ")
        .replace(/and /gi, "und ")
        .replace(/or /gi, "oder ")
        .replace(/welcome/gi, "willkommen")
        .replace(/hello/gi, "hallo")
        .replace(/thank you/gi, "danke")
        .replace(/please/gi, "bitte")
        .replace(/tea/gi, "Tee")
        .replace(/fortune/gi, "Glück")
        .replace(/reading/gi, "Lesung")
        .replace(/discover/gi, "entdecken")
        .replace(/explore/gi, "erkunden")
        .replace(/collection/gi, "Sammlung")
        .replace(/ancient/gi, "antik")
        .replace(/art/gi, "Kunst")
        .replace(/get/gi, "bekommen")
        .replace(/your/gi, "dein")
    },
    pt: (text) => {
      // Portuguese-like transformations
      return text
        .replace(/the /gi, "o ")
        .replace(/The /g, "O ")
        .replace(/is /gi, "é ")
        .replace(/are /gi, "são ")
        .replace(/and /gi, "e ")
        .replace(/or /gi, "ou ")
        .replace(/welcome/gi, "bem-vindo")
        .replace(/hello/gi, "olá")
        .replace(/thank you/gi, "obrigado")
        .replace(/please/gi, "por favor")
        .replace(/tea/gi, "chá")
        .replace(/fortune/gi, "fortuna")
        .replace(/reading/gi, "leitura")
        .replace(/discover/gi, "descobrir")
        .replace(/explore/gi, "explorar")
        .replace(/collection/gi, "coleção")
        .replace(/ancient/gi, "antigo")
        .replace(/art/gi, "arte")
        .replace(/get/gi, "obter")
        .replace(/your/gi, "seu")
    },
    zh: (text) => {
      // Simple Chinese-like prefix (would be better with actual translations)
      return `[中文] ${text}`
    },
    ja: (text) => {
      // Simple Japanese-like prefix (would be better with actual translations)
      return `[日本語] ${text}`
    },
    ko: (text) => {
      // Simple Korean-like prefix (would be better with actual translations)
      return `[한국어] ${text}`
    },
    ar: (text) => {
      // Simple Arabic-like prefix (would be better with actual translations)
      return `[العربية] ${text}`
    },
  }

  // If we have a specific transformer for this language, use it
  if (langPrefixes[targetLanguage]) {
    return langPrefixes[targetLanguage](text)
  }

  // Otherwise, just add a language prefix
  return `[${targetLanguage.toUpperCase()}] ${text}`
}

// OpenAI translation function
async function translateWithOpenAI(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OpenAI API key is not configured")
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a translation assistant. Translate the text from ${sourceLanguage} to ${targetLanguage}. Provide only the translated text without any explanations or additional text.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()

    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim()
    } else {
      throw new Error("Unexpected response format from OpenAI API")
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    throw error
  }
}

// Translation function with OpenAI and fallback to mock
export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  try {
    // Skip translation if source and target languages are the same
    if (request.sourceLanguage === request.targetLanguage) {
      return {
        translatedText: request.text,
        success: true,
      }
    }

    // Try to use OpenAI API
    try {
      const translatedText = await translateWithOpenAI(request.text, request.sourceLanguage, request.targetLanguage)

      return {
        translatedText,
        success: true,
      }
    } catch (apiError) {
      // If OpenAI API fails, log the error and fall back to mock translation
      console.error("OpenAI API error, falling back to mock translation:", apiError)
      return {
        translatedText: mockTranslate(request.text, request.targetLanguage),
        success: true,
        error: `API error (using fallback): ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
        usedFallback: true,
      }
    }
  } catch (error) {
    console.error("Translation error:", error)
    // Final fallback - if everything else fails, still try to return something
    try {
      return {
        translatedText: mockTranslate(request.text, request.targetLanguage),
        success: true,
        error: `Error with fallback: ${error instanceof Error ? error.message : "Unknown error"}`,
        usedFallback: true,
      }
    } catch (mockError) {
      return {
        translatedText: `[${request.targetLanguage}] ${request.text}`,
        success: false,
        error: error instanceof Error ? error.message : "Failed to translate text",
      }
    }
  }
}

export async function bulkTranslate(request: BulkTranslationRequest): Promise<BulkTranslationResponse> {
  try {
    // Skip translation if source and target languages are the same
    if (request.sourceLanguage === request.targetLanguage) {
      return {
        translations: request.translations,
        success: true,
      }
    }

    // For bulk translations, we'll process them in batches to avoid rate limits
    const batchSize = 5 // Smaller batch size to reduce likelihood of quota issues
    const entries = Object.entries(request.translations)
    const batches = []
    let usedFallback = false

    for (let i = 0; i < entries.length; i += batchSize) {
      batches.push(entries.slice(i, i + batchSize))
    }

    const results = []

    for (const batch of batches) {
      try {
        const batchResults = await Promise.all(
          batch.map(async ([key, value]) => {
            const translation = await translateText({
              sourceLanguage: request.sourceLanguage,
              targetLanguage: request.targetLanguage,
              text: value,
            })

            if (translation.usedFallback) {
              usedFallback = true
            }

            return [key, translation.success ? translation.translatedText : value]
          }),
        )

        results.push(...batchResults)
      } catch (batchError) {
        console.error("Error processing batch, falling back to mock for this batch:", batchError)
        // If a batch fails, use mock translations for that batch
        const mockBatchResults = batch.map(([key, value]) => [key, mockTranslate(value, request.targetLanguage)])
        results.push(...mockBatchResults)
        usedFallback = true
      }

      // Add a delay between batches to avoid rate limits
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    const translations = Object.fromEntries(results)

    return {
      translations,
      success: true,
      usedFallback,
    }
  } catch (error) {
    console.error("Bulk translation error, using mock fallback:", error)

    // If everything fails, fall back to mock translations
    try {
      const mockTranslations = Object.entries(request.translations).reduce(
        (acc, [key, value]) => {
          acc[key] = mockTranslate(value, request.targetLanguage)
          return acc
        },
        {} as Record<string, string>,
      )

      return {
        translations: mockTranslations,
        success: true,
        error: `API error (using fallback): ${error instanceof Error ? error.message : "Unknown error"}`,
        usedFallback: true,
      }
    } catch (mockError) {
      return {
        translations: {},
        success: false,
        error: error instanceof Error ? error.message : "Failed to perform bulk translation",
      }
    }
  }
}

// Function to save translations to Supabase or your database
export async function saveTranslations(language: string, translations: Record<string, any>) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials")
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Example: store in a translations table
    const { data, error } = await supabase.from("translations").upsert(
      {
        language_code: language,
        translations: translations,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "language_code",
      },
    )

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error saving translations:", error)
    return { success: false, error }
  }
}

// Function to export translations to JSON files
export async function exportTranslationsToFiles() {
  // In a real implementation, this would write to the file system
  // For the browser environment, we'd generate downloadable files
  return { success: true }
}
