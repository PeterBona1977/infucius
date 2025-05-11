"use client"

import { useState, useEffect } from "react"

export function useUserCountry() {
  const [countryCode, setCountryCode] = useState<string>("us") // Default to US
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // In a real app, you would use a geolocation API service
        // For this example, we'll simulate an API call
        setLoading(true)

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Try to get country from browser's language settings as a fallback
        const browserLang = navigator.language || (navigator as any).userLanguage
        let detectedCountry = "us" // Default

        if (browserLang) {
          const countryFromLang = browserLang.split("-")[1]?.toLowerCase()
          if (countryFromLang) {
            detectedCountry = countryFromLang
          }
        }

        // In a real app, you would use a more reliable method:
        // const response = await fetch('https://ipapi.co/json/')
        // const data = await response.json()
        // const detectedCountry = data.country_code.toLowerCase()

        setCountryCode(detectedCountry)
      } catch (err) {
        console.error("Error detecting country:", err)
        setError("Failed to detect country")
      } finally {
        setLoading(false)
      }
    }

    detectCountry()
  }, [])

  return { countryCode, loading, error }
}
