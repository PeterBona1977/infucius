import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { productId = "test-product-id", quantity = 1 } = await request.json()

    // Create server client
    const supabase = createServerClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          authenticated: false,
        },
        { status: 401 },
      )
    }

    // Step 1: Check if user has a cart
    const { data: carts, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("user_id", session.user.id)
      .limit(1)

    if (cartError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check for existing cart",
          details: cartError,
        },
        { status: 500 },
      )
    }

    // Step 2: Create cart if it doesn't exist
    let cartId

    if (carts.length === 0) {
      const { data: newCart, error: createCartError } = await supabase
        .from("carts")
        .insert({ user_id: session.user.id })
        .select()
        .single()

      if (createCartError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create cart",
            details: createCartError,
          },
          { status: 500 },
        )
      }

      cartId = newCart.id
    } else {
      cartId = carts[0].id
    }

    // Step 3: Check if item already exists in cart
    const { data: existingItems, error: existingItemError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", productId)

    if (existingItemError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to check for existing item",
          details: existingItemError,
        },
        { status: 500 },
      )
    }

    // Step 4: Add or update cart item
    let result

    if (existingItems.length > 0) {
      // Update existing item
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItems[0].quantity + quantity })
        .eq("id", existingItems[0].id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update cart item",
            details: error,
          },
          { status: 500 },
        )
      }

      result = { updated: true, item: data }
    } else {
      // Add new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ cart_id: cartId, product_id: productId, quantity })
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to add item to cart",
            details: error,
          },
          { status: 500 },
        )
      }

      result = { added: true, item: data }
    }

    return NextResponse.json({
      success: true,
      message: "Cart operation successful",
      result,
    })
  } catch (error: any) {
    console.error("Error in cart test:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
