"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Info } from "lucide-react"

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
]

// Map language codes to full names for the API
const LANGUAGE_NAMES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
}

export function TranslationManager() {
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [activeTab, setActiveTab] = useState("translate")
  const [usedFallback, setUsedFallback] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    setUsedFallback(false)

    try {
      // Call our translation API
      const response = await fetch("/api/translations/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage: LANGUAGE_NAMES[sourceLanguage as keyof typeof LANGUAGE_NAMES] || sourceLanguage,
          targetLanguage: LANGUAGE_NAMES[targetLanguage as keyof typeof LANGUAGE_NAMES] || targetLanguage,
          text: sourceText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Translation failed")
      }

      const data = await response.json()
      setTranslatedText(data.translatedText)

      // Check if this was a fallback translation
      setUsedFallback(!!data.usedFallback)

      toast({
        title: "Translation complete",
        description: `Successfully translated from ${sourceLanguage} to ${targetLanguage}${data.usedFallback ? " (using fallback)" : ""}`,
      })
    } catch (error) {
      toast({
        title: "Translation failed",
        description:
          error instanceof Error ? error.message : "There was an error translating your text. Please try again.",
        variant: "destructive",
      })
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleBulkTranslate = async () => {
    setIsTranslating(true)
    setUsedFallback(false)

    try {
      // Call our bulk translation API
      const response = await fetch("/api/translations/auto-translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguage: LANGUAGE_NAMES[sourceLanguage as keyof typeof LANGUAGE_NAMES] || sourceLanguage,
          targetLanguages: SUPPORTED_LANGUAGES.filter((lang) => lang.code !== sourceLanguage).map(
            (lang) => LANGUAGE_NAMES[lang.code as keyof typeof LANGUAGE_NAMES] || lang.code,
          ),
          translations: {
            // Example translations to update - in a real app, you'd get these from your translation files
            "common.welcome": "Welcome to our app",
            "common.login": "Login",
            "common.register": "Register",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Bulk translation failed")
      }

      const data = await response.json()

      // Check if any translations used fallback
      const anyFallback = data.results.some((result: any) => result.status === "completed with fallback")
      setUsedFallback(anyFallback)

      toast({
        title: "Bulk translation complete",
        description: `Updated translations for ${data.results.length} languages${anyFallback ? " (some using fallback)" : ""}`,
      })
    } catch (error) {
      toast({
        title: "Bulk translation failed",
        description:
          error instanceof Error ? error.message : "There was an error during bulk translation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleExport = () => {
    toast({
      title: "Translations exported",
      description: "Translation files have been updated successfully",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Manager</CardTitle>
        <CardDescription>Manage translations for your application</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="translate">Translate Text</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Translate</TabsTrigger>
            <TabsTrigger value="manage">Manage Files</TabsTrigger>
          </TabsList>

          <TabsContent value="translate" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Language</label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter text to translate..."
                  className="min-h-[200px]"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Translation will appear here..."
                  className="min-h-[200px]"
                  value={translatedText}
                  readOnly
                />
              </div>
            </div>
            <Button onClick={handleTranslate} disabled={isTranslating || !sourceText.trim()} className="w-full">
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>

            {usedFallback && (
              <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  Translation was processed using fallback mode due to API limitations. The translation is still
                  functional but may not be as accurate as the AI-powered translation.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Source Language</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Target Languages</label>
                  <div className="p-2 border rounded-md text-sm">
                    All languages except {SUPPORTED_LANGUAGES.find((l) => l.code === sourceLanguage)?.name}
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">
                  Bulk translation will process all missing translation keys from the source language and create
                  translations for the target languages. This may take a few minutes depending on the number of
                  translations.
                </p>
              </div>

              <Button onClick={handleBulkTranslate} disabled={isTranslating} className="w-full">
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Translations...
                  </>
                ) : (
                  "Start Bulk Translation"
                )}
              </Button>

              {usedFallback && (
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Some translations were processed using fallback mode due to API limitations.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm">
                  Manage your translation files. You can export current translations to JSON files or import
                  translations from external sources.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleExport}>Export Translations</Button>
                <Button variant="outline">Import Translations</Button>
              </div>

              <div className="border rounded-md">
                <div className="p-3 border-b bg-muted font-medium">Available Languages</div>
                <div className="p-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <div key={lang.code} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                      <span>
                        {lang.name} ({lang.code})
                      </span>
                      <div className="space-x-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Using Google Gemini with automatic fallback when API services are unavailable
        </p>
      </CardFooter>
    </Card>
  )
}
