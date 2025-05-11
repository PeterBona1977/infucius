import type { Metadata } from "next"
import ShopPageClient from "./ShopPageClient"

export const metadata: Metadata = {
  title: "Shop | Infucius",
  description: "Explore and shop our collection of themed teas",
}

export default function ShopPage() {
  return <ShopPageClient />
}
