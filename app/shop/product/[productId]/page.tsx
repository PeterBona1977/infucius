import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProduct } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Heart } from "lucide-react"

interface ProductPageProps {
  params: {
    productId: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.productId)

  if (!product) {
    return {
      title: "Product Not Found | Infucius",
    }
  }

  return {
    title: `${product.name} | Infucius`,
    description: product.short_description || product.description || undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = params
  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border">
            <Image
              src={product.product_images?.[0]?.url || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.sale_price && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                SALE
              </div>
            )}
          </div>

          {product.product_images && product.product_images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.product_images.map((image: any) => (
                <div key={image.id} className="aspect-square relative rounded-md overflow-hidden border">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {product.sale_price ? (
              <>
                <span className="text-xl font-semibold">${product.sale_price.toFixed(2)}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.short_description}</p>

          <div className="space-y-4 mb-6">
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
              <AddToCartButton productId={product.id} variant="default" size="default" className="flex-1">
                Add to Cart
              </AddToCartButton>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {product.description || product.short_description}
            </p>
          </div>

          {product.weight || product.dimensions ? (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.weight && (
                  <>
                    <div className="text-muted-foreground">Weight:</div>
                    <div>{product.weight}g</div>
                  </>
                )}
                {product.dimensions && (
                  <>
                    <div className="text-muted-foreground">Dimensions:</div>
                    <div>{product.dimensions}</div>
                  </>
                )}
                <div className="text-muted-foreground">SKU:</div>
                <div>{product.sku}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
