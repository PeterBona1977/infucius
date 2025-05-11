import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTeaTheme } from "@/lib/tea-themes"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"

interface ShopThemePageProps {
  params: {
    themeId: string
  }
}

export function generateMetadata({ params }: ShopThemePageProps): Metadata {
  const theme = getTeaTheme(params.themeId)

  if (!theme) {
    return {
      title: "Product Not Found | Infucius",
    }
  }

  return {
    title: `${theme.name} Tea | Infucius`,
    description: theme.description,
  }
}

export default function ShopThemePage({ params }: ShopThemePageProps) {
  const { themeId } = params
  const theme = getTeaTheme(themeId)

  if (!theme) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className={`${theme.bgColor} p-8 rounded-lg flex items-center justify-center`}>
          <Image
            src={theme.image || "/placeholder.svg"}
            alt={theme.name}
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{theme.name} Tea</h1>
          <div className="text-xl font-semibold mb-4">$14.99</div>
          <p className="text-muted-foreground mb-6">{theme.description}</p>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="font-medium">Quantity:</div>
              <select className="border rounded p-2">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">About {theme.name} Tea</h3>
              <p className="text-sm text-muted-foreground">
                Our {theme.name} tea is carefully crafted to evoke feelings of {theme.name.toLowerCase()}. Each package
                contains a unique QR code that provides you with personalized messages tailored to your current state
                and surroundings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
