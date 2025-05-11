"use client"

import { TeaThemeShowcase } from "@/components/tea-theme-showcase"
import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "@/components/language-wrapper"

function ShopPageContent() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">{t("shop.title") || "Shop Our Tea Collection"}</h1>
      <TeaThemeShowcase />
    </div>
  )
}

export default function ShopPage() {
  return (
    <LanguageWrapper>
      <ShopPageContent />
    </LanguageWrapper>
  )
}
