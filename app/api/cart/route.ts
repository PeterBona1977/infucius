import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserCart, addToCart, removeFromCart, updateCartItem } from "@/lib/db"
import { getCartTotal } from "@/lib/cart-service"

// Get user's cart
export async function GET(request: Request) {
  try {
    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's cart
    const cart = await getUserCart(session.user.id)

    // Calculate cart totals
    const totals = await getCartTotal(cart)

    return NextResponse.json({ ...cart, ...totals })
  } catch (error: any) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Add to cart
    const cartItem = await addToCart(session.user.id, productId, quantity)

    // Get updated cart
    const cart = await getUserCart(session.user.id)

    // Calculate cart totals
    const totals = await getCartTotal(cart)

    return NextResponse.json({ cartItem, cart: { ...cart, ...totals } })
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: error.message || "Failed to add to cart" }, { status: 500 })
  }
}

// Update cart item
export async function PUT(request: Request) {
  try {
    const { cartItemId, quantity } = await request.json()

    if (!cartItemId || !quantity) {
      return NextResponse.json({ error: "Cart item ID and quantity are required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update cart item
    await updateCartItem(cartItemId, quantity)

    // Get updated cart
    const cart = await getUserCart(session.user.id)

    // Calculate cart totals
    const totals = await getCartTotal(cart)

    return NextResponse.json({ ...cart, ...totals })
  } catch (error: any) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: error.message || "Failed to update cart item" }, { status: 500 })
  }
}

// Delete cart item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("id")

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove from cart
    await removeFromCart(cartItemId)

    // Get updated cart
    const cart = await getUserCart(session.user.id)

    // Calculate cart totals
    const totals = await getCartTotal(cart)

    return NextResponse.json({ ...cart, ...totals })
  } catch (error: any) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: error.message || "Failed to remove from cart" }, { status: 500 })
  }
}
