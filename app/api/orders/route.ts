import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getUserOrders } from "@/lib/db"
import { createOrderFromCart } from "@/lib/cart-service"

// Get user's orders
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

    // Get user's orders
    const orders = await getUserOrders(session.user.id)

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    const { shippingAddress, billingAddress, paymentMethod, shippingMethod } = await request.json()

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
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

    // Create order from cart
    const order = await createOrderFromCart(
      session.user,
      shippingAddress,
      billingAddress || shippingAddress,
      paymentMethod,
      shippingMethod,
    )

    return NextResponse.json(order)
  } catch (error: any) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
