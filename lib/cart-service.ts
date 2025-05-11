import { getUserCart, clearCart, createOrder, addOrderItem } from "./db"
import type { User } from "@supabase/supabase-js"

export type CartItem = {
  id: string
  product_id: string
  quantity: number
  products: {
    id: string
    name: string
    price: number
    sale_price: number | null
    [key: string]: any
  }
}

export type Cart = {
  id: string
  user_id: string | null
  items: CartItem[]
  [key: string]: any
}

export type OrderAddress = {
  first_name: string
  last_name: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  email?: string
}

export async function getCartTotal(cart: Cart): Promise<{
  subtotal: number
  tax: number
  shipping: number
  total: number
}> {
  let subtotal = 0

  // Calculate subtotal
  for (const item of cart.items) {
    const price = item.products.sale_price || item.products.price
    subtotal += price * item.quantity
  }

  // Calculate tax (assuming 8% tax rate)
  const taxRate = 0.08
  const tax = subtotal * taxRate

  // Calculate shipping
  // Simplified logic - free shipping over $50, otherwise $5.99
  const shipping = subtotal > 50 ? 0 : 5.99

  // Calculate total
  const total = subtotal + tax + shipping

  return {
    subtotal,
    tax,
    shipping,
    total,
  }
}

export async function createOrderFromCart(
  user: User,
  shippingAddress: OrderAddress,
  billingAddress: OrderAddress = shippingAddress,
  paymentMethod = "credit_card",
  shippingMethod = "standard",
) {
  try {
    // Get user's cart
    const cart = await getUserCart(user.id)

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty")
    }

    // Calculate totals
    const { subtotal, tax, shipping, total } = await getCartTotal(cart)

    // Create the order
    const order = await createOrder({
      user_id: user.id,
      status: "pending",
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod,
      shipping_cost: shipping,
      subtotal,
      tax,
      total,
      payment_status: "pending",
    })

    // Add order items
    for (const item of cart.items) {
      const price = item.products.sale_price || item.products.price
      await addOrderItem({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      })
    }

    // Clear the cart
    await clearCart(cart.id)

    return order
  } catch (error) {
    console.error("Error creating order from cart:", error)
    throw error
  }
}
