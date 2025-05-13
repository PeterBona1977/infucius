"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AddToCartButtonProps {
  productId: string
  quantity?: number
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function AddToCartButton({
  productId,
  quantity = 1,
  variant = "default",
  size = "icon",
  className = "",
  showText = false,
}: AddToCartButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAddToCart = async () => {
    if (!user) {
      // Store the product info in localStorage to add after login
      localStorage.setItem("pendingCartItem", JSON.stringify({ productId, quantity }))
      router.push(`/login?callbackUrl=/shop/product/${productId}`)
      return
    }

    setIsLoading(true)
    setIsSuccess(false)

    try {
      console.log("Adding to cart:", { productId, quantity })

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add to cart")
      }

      console.log("Add to cart response:", data)

      // Show success state
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2000)

      toast({
        title: "Added to cart",
        description: "The item has been added to your cart.",
      })

      // Force refresh to update cart count in header
      router.refresh()
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add the item to your cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`${className} relative`}
      aria-label="Add to cart"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSuccess ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {showText && <span className="ml-2">Add to cart</span>}
        </>
      )}
    </Button>
  )
}
