"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Check if translation function is working
    if (typeof t === "function") {
      setIsReady(true)
    }
  }, [t])

  if (!isReady) {
    return <div className="p-4">Loading translations...</div>
  }

  return <>{children}</>
}
