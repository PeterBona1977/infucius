"use client"

import { useState, useEffect } from "react"

export function useCountryCode() {
  const [countryCode, setCountryCode] = useState<string>("")
  const [countryName, setCountryName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getCountryCode() {
      try {
        // Try to get location first
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // In a real app, you would use a reverse geocoding service with the coordinates
                // For now, just use a basic IP-based service
                const response = await fetch("https://ipapi.co/json/")
                const data = await response.json()

                if (data.country_calling_code) {
                  setCountryCode(data.country_calling_code)
                  setCountryName(data.country_name || "")
                } else {
                  // Default to US
                  setCountryCode("+1")
                  setCountryName("United States")
                }
              } catch (error) {
                console.error("Error getting country from location:", error)
                // Default to US
                setCountryCode("+1")
                setCountryName("United States")
              }
              setLoading(false)
            },
            async (error) => {
              console.error("Error getting location:", error)
              // Fallback to IP-based detection
              try {
                const response = await fetch("https://ipapi.co/json/")
                const data = await response.json()

                if (data.country_calling_code) {
                  setCountryCode(data.country_calling_code)
                  setCountryName(data.country_name || "")
                } else {
                  // Default to US
                  setCountryCode("+1")
                  setCountryName("United States")
                }
              } catch (error) {
                console.error("Error getting country from IP:", error)
                // Default to US
                setCountryCode("+1")
                setCountryName("United States")
              }
              setLoading(false)
            },
          )
        } else {
          // Fallback to IP-based detection if geolocation is not available
          try {
            const response = await fetch("https://ipapi.co/json/")
            const data = await response.json()

            if (data.country_calling_code) {
              setCountryCode(data.country_calling_code)
              setCountryName(data.country_name || "")
            } else {
              // Default to US
              setCountryCode("+1")
              setCountryName("United States")
            }
          } catch (error) {
            console.error("Error getting country from IP:", error)
            // Default to US
            setCountryCode("+1")
            setCountryName("United States")
          }
          setLoading(false)
        }
      } catch (error) {
        console.error("Error in getCountryCode:", error)
        // Default to US
        setCountryCode("+1")
        setCountryName("United States")
        setLoading(false)
      }
    }

    getCountryCode()
  }, [])

  return { countryCode, countryName, loading }
}
