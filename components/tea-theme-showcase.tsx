"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "./language-wrapper"

const teaThemes = [
  {
    id: "inspiration",
    name: "Inspiration",
    description: "Ignite your creative spark",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-amber-100",
  },
  {
    id: "serenity",
    name: "Serenity",
    description: "Find your inner peace",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-blue-100",
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Embark on new journeys",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-green-100",
  },
  {
    id: "joy",
    name: "Joy",
    description: "Celebrate life's moments",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-yellow-100",
  },
  {
    id: "well-being",
    name: "Well-being",
    description: "Nurture body and mind",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-red-100",
  },
  {
    id: "mysticism",
    name: "Mysticism",
    description: "Explore the unknown",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-purple-100",
  },
  {
    id: "introspection",
    name: "Introspection",
    description: "Journey within yourself",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-indigo-100",
  },
]

export function TeaThemeShowcase() {
  return (
    <LanguageWrapper>
      <TeaThemeContent />
    </LanguageWrapper>
  )
}

function TeaThemeContent() {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {teaThemes.map((theme) => (
        <Card key={theme.id} className="overflow-hidden">
          <div className={`${theme.color} p-6 flex justify-center`}>
            <Image
              src={theme.image || "/placeholder.svg"}
              alt={theme.name}
              width={150}
              height={150}
              className="object-contain"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{t(`teaThemes.${theme.id}.name`) || theme.name}</h3>
            <p className="text-sm text-muted-foreground">
              {t(`teaThemes.${theme.id}.description`) || theme.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/shop/${theme.id}`}>{t("teaThemes.shopNow") || "Shop Now"}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
