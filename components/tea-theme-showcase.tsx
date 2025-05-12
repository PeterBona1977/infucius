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
    price: 19.99,
  },
  {
    id: "serenity",
    name: "Serenity",
    description: "Find your inner peace",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-blue-100",
    price: 18.99,
  },
  {
    id: "adventure",
    name: "Adventure",
    description: "Embark on new journeys",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-green-100",
    price: 21.99,
  },
  {
    id: "joy",
    name: "Joy",
    description: "Celebrate life's moments",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-yellow-100",
    price: 17.99,
  },
  {
    id: "well-being",
    name: "Well-being",
    description: "Nurture body and mind",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-red-100",
    price: 22.99,
  },
  {
    id: "mysticism",
    name: "Mysticism",
    description: "Explore the unknown",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-purple-100",
    price: 24.99,
  },
  {
    id: "introspection",
    name: "Introspection",
    description: "Journey within yourself",
    image: "/placeholder.svg?height=200&width=200",
    color: "bg-indigo-100",
    price: 20.99,
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
            <div className="mt-1 mb-2">
              <span className="font-bold text-lg">${theme.price.toFixed(2)}</span>
            </div>
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
