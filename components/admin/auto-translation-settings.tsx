"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react"

export function AutoTranslationSettings() {
  const [isAutoTranslateEnabled, setIsAutoTranslateEnabled] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  const toggleAutoTranslate = () => {
    setIsAutoTranslateEnabled(!isAutoTranslateEnabled)
    // In a real implementation, this would save the setting to the database
    // and set up or remove the webhook/cron job
  }

  const runManualTranslation = async () => {
    setIsRunning(true)
    setError(null)
    setResults(null)
    setUsedFallback(false)

    try {
      // Define sample translations to update
      // In a real implementation, this would come from your content database
      const sampleTranslations = {
        welcome: "Welcome to Infucius Tea",
        about: "Discover the ancient art of tea fortune telling",
        explore: "Explore our tea collections",
        fortune: "Get your tea fortune reading",
      }

      const response = await fetch("/api/translations/auto-translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage: "en",
          targetLanguages: ["es", "fr", "de", "pt", "zh", "ja", "ko", "ar"],
          translations: sampleTranslations,
        }),
      })

      // First check if the response is ok
      if (!response.ok) {
        // Try to parse the error as JSON
        let errorData
        try {
          errorData = await response.json()
          throw new Error(errorData.error || `Server error: ${response.status}`)
        } catch (jsonError) {
          // If JSON parsing fails, use the status text
          throw new Error(`Server error: ${response.status} ${response.statusText}`)
        }
      }

      // If we get here, the response is ok, so parse the JSON
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error("Invalid response format from server")
      }

      setResults(data.results)

      // Check if any translations used fallback
      const anyFallback = data.results.some((result: any) => result.status === "completed with fallback")
      setUsedFallback(anyFallback)
    } catch (err: any) {
      console.error("Error running auto-translation:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatic Translation</CardTitle>
        <CardDescription>Configure automatic translation of content for your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Enable Auto-Translation</h3>
            <p className="text-sm text-gray-500">Automatically translate new content when it's added to the site</p>
          </div>
          <Switch checked={isAutoTranslateEnabled} onCheckedChange={toggleAutoTranslate} />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Manual Translation</h3>
          <p className="text-sm text-gray-500 mb-4">
            Run translation process manually to update all language files with missing translations
          </p>
          <Button onClick={runManualTranslation} disabled={isRunning} className="w-full">
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate Missing Content"
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Translation Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {results && (
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-medium text-green-800 mb-2 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Translation Complete
            </h4>
            <div className="space-y-2">
              {results.map((result: any) => (
                <div key={result.language} className="flex justify-between text-sm">
                  <span>{result.language.toUpperCase()}</span>
                  <span className="flex items-center">
                    {result.status === "complete" ? (
                      "Already up to date"
                    ) : result.status === "updated" ? (
                      `Added ${result.added} translations`
                    ) : result.status === "completed with fallback" ? (
                      <span className="flex items-center">
                        <Info className="h-3 w-3 text-amber-500 mr-1" />
                        {`Added ${result.added} translations (fallback)`}
                      </span>
                    ) : result.status === "skipped" ? (
                      "Skipped (same as source)"
                    ) : (
                      `Error: ${result.error}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {usedFallback && (
          <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
            <p className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-500" />
              Some translations were processed using fallback mode due to API limitations.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-500">
        Translations are processed using Google's Gemini AI with automatic fallback mechanisms.
      </CardFooter>
    </Card>
  )
}
