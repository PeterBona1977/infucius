"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  salePrice?: number
  imageSrc?: string
  themeId?: string
}

export function ProductCard({ id, name, description, price, salePrice, imageSrc, themeId }: ProductCardProps) {
  const isOnSale = salePrice !== undefined && salePrice < price
  const displayPrice = isOnSale ? salePrice : price

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/shop/product/${id}`}>
          <Image
            src={imageSrc || `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(name)}`}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>
          )}
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/shop/product/${id}`} className="hover:underline">
            <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
          </Link>
          <AddToCartButton productId={id} size="sm" />
        </div>

        {description && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{description}</p>}

        <div className="flex items-center">
          <span className="font-bold text-lg">${displayPrice.toFixed(2)}</span>
          {isOnSale && <span className="ml-2 text-sm text-gray-500 line-through">${price.toFixed(2)}</span>}
        </div>

        {themeId && (
          <Link href={`/shop/${themeId}`} className="text-xs text-blue-600 hover:underline mt-2 block">
            View collection
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
