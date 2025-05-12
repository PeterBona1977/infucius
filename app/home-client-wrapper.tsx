"use client"

import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "@/components/language-wrapper"
import { FeaturedProducts } from "@/components/featured-products"
import { EditableContent } from "@/components/editable-content"

function HomeContent() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4">
      <section className="mb-12">
        <EditableContent
          page="home"
          section="welcome"
          keyName="title"
          defaultValue="Welcome to Infucius"
          as="h2"
          className="text-3xl font-bold text-center mb-4"
        />
        <EditableContent
          page="home"
          section="welcome"
          keyName="description"
          defaultValue="Discover our collection of premium teas and receive personalized fortune messages that resonate with your spirit."
          as="p"
          className="text-center max-w-2xl mx-auto"
        />
      </section>

      <FeaturedProducts />
    </div>
  )
}

export function HomeClientWrapper() {
  return (
    <LanguageWrapper>
      <HomeContent />
    </LanguageWrapper>
  )
}
