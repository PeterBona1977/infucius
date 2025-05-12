"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { useLanguage } from "@/contexts/language-context"

// Sample featured products with prices
const sampleProducts = [
  {
    id: 1,
    name: "Jasmine Serenity Tea",
    short_description: "A calming blend with jasmine flowers",
    price: 14.99,
    product_images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
  {
    id: 2,
    name: "Ginger Vitality Tea",
    short_description: "Energizing blend with ginger and citrus",
    price: 12.99,
    sale_price: 9.99,
    product_images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
  {
    id: 3,
    name: "Oolong Wisdom Tea",
    short_description: "Traditional oolong for clarity and focus",
    price: 16.99,
    product_images: [{ url: "/placeholder.svg?height=300&width=300" }],
  },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState(sampleProducts)
  const { t } = useLanguage()

  // In a real implementation, you would fetch products from your database
  useEffect(() => {
    // Fetch products from API
    // For now, we'll use the sample data
  }, [])

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">{t("home.featuredProducts") || "Featured Products"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
