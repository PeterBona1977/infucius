"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { LanguageWrapper } from "@/components/language-wrapper"

function CartPageContent() {
  const { t } = useLanguage()

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title") || "Your Shopping Cart"}</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("cart.items") || "Cart Items"}</CardTitle>
          <CardDescription>{t("cart.itemsDescription") || "Items you've added to your cart"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t("cart.empty") || "Your cart is empty"}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {t("cart.emptyDescription") || "Add some tea products to your cart to see them here."}
            </p>
            <Button asChild>
              <Link href="/shop">{t("cart.browseShop") || "Browse Shop"}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("cart.orderSummary") || "Order Summary"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("cart.subtotal") || "Subtotal"}</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart.shipping") || "Shipping"}</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>{t("cart.tax") || "Tax"}</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>{t("cart.total") || "Total"}</span>
                <span>$0.00</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>
              {t("cart.checkout") || "Checkout"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("cart.promoCode") || "Have a Promo Code?"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("cart.enterPromoCode") || "Enter promo code"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button variant="outline">{t("cart.apply") || "Apply"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <LanguageWrapper>
      <CartPageContent />
    </LanguageWrapper>
  )
}
