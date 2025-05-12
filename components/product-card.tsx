import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductCardProps {
  product: any
  showAddToCart?: boolean
}

export function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-square relative">
        <Image
          src={product.product_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.sale_price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          {product.sale_price ? (
            <>
              <span className="font-bold">${product.sale_price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.short_description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/shop/product/${product.id}`}>View</Link>
        </Button>
        {showAddToCart && <AddToCartButton productId={product.id} />}
      </CardFooter>
    </Card>
  )
}
