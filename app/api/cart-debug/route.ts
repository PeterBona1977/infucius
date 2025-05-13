import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized", authenticated: false }, { status: 401 })
    }

    // Check if carts table exists
    const { data: cartsTableExists, error: cartsTableError } = await supabase.from("carts").select("id").limit(1)

    // Check if cart_items table exists
    const { data: cartItemsTableExists, error: cartItemsTableError } = await supabase
      .from("cart_items")
      .select("id")
      .limit(1)

    // Check if products table exists
    const { data: productsTableExists, error: productsTableError } = await supabase
      .from("products")
      .select("id")
      .limit(1)

    // Get user's cart
    const { data: userCart, error: userCartError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", session.user.id)
      .limit(1)

    // Get cart items if cart exists
    let cartItems = null
    let cartItemsError = null

    if (userCart && userCart.length > 0) {
      const { data, error } = await supabase.from("cart_items").select("*, products(*)").eq("cart_id", userCart[0].id)

      cartItems = data
      cartItemsError = error
    }

    return NextResponse.json({
      authenticated: true,
      userId: session.user.id,
      tables: {
        carts: {
          exists: !cartsTableError,
          error: cartsTableError ? cartsTableError.message : null,
          sample: cartsTableExists,
        },
        cartItems: {
          exists: !cartItemsTableError,
          error: cartItemsTableError ? cartItemsTableError.message : null,
          sample: cartItemsTableExists,
        },
        products: {
          exists: !productsTableError,
          error: productsTableError ? productsTableError.message : null,
          sample: productsTableExists,
        },
      },
      userCart: {
        exists: userCart && userCart.length > 0,
        error: userCartError ? userCartError.message : null,
        data: userCart,
      },
      cartItems: {
        exists: cartItems && cartItems.length > 0,
        error: cartItemsError ? cartItemsError.message : null,
        data: cartItems,
      },
    })
  } catch (error: any) {
    console.error("Error in cart debug:", error)
    return NextResponse.json(
      {
        error: error.message || "An unexpected error occurred",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
