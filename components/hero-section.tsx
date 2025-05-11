"use client"

import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "./language-wrapper"
import { EditableContent } from "./editable-content"

export function HeroSection() {
  return (
    <LanguageWrapper>
      <HeroContent />
    </LanguageWrapper>
  )
}

function HeroContent() {
  const { t, currentLanguage } = useLanguage()

  // Use translated content if available, otherwise use editable content
  const useTranslation = currentLanguage !== "en"

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            {useTranslation ? (
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                {t("hero.title") || "Discover Your Personalized Message"}
              </h1>
            ) : (
              <EditableContent
                page="home"
                section="hero"
                keyName="title"
                defaultValue="Discover Your Personalized Message"
                as="h1"
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
              />
            )}

            {useTranslation ? (
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t("hero.subtitle") || "Scan, sip, and discover messages uniquely crafted for you."}
              </p>
            ) : (
              <EditableContent
                page="home"
                section="hero"
                keyName="subtitle"
                defaultValue="Scan, sip, and discover messages uniquely crafted for you."
                as="p"
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
