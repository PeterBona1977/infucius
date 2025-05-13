import { supabase } from "./supabase/client"
import type { Database } from "@/types/supabase"

// Products
export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*, product_images(*)")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data
}

export async function getProduct(id: string) {
  const { data, error } = await supabase.from("products").select("*, product_images(*)").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product ${id}:`, error)
    return null
  }

  return data
}

export async function createProduct(product: Database["public"]["Tables"]["products"]["Insert"]) {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProduct(id: string, product: Database["public"]["Tables"]["products"]["Update"]) {
  const { data, error } = await supabase.from("products").update(product).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }

  return true
}

// Product Images
export async function addProductImage(productImage: Database["public"]["Tables"]["product_images"]["Insert"]) {
  const { data, error } = await supabase.from("product_images").insert(productImage).select().single()

  if (error) {
    console.error("Error adding product image:", error)
    throw error
  }

  return data
}

export async function deleteProductImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product image ${id}:`, error)
    throw error
  }

  return true
}

// Themes
export async function getThemes(activeOnly = false) {
  let query = supabase.from("themes").select("*")

  if (activeOnly) {
    query = query.eq("active", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching themes:", error)
    return []
  }

  return data
}

export async function getTheme(id: string) {
  const { data, error } = await supabase.from("themes").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching theme ${id}:`, error)
    return null
  }

  return data
}

export async function createTheme(theme: Database["public"]["Tables"]["themes"]["Insert"]) {
  const { data, error } = await supabase.from("themes").insert(theme).select().single()

  if (error) {
    console.error("Error creating theme:", error)
    throw error
  }

  return data
}

export async function updateTheme(id: string, theme: Database["public"]["Tables"]["themes"]["Update"]) {
  const { data, error } = await supabase.from("themes").update(theme).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating theme ${id}:`, error)
    throw error
  }

  return data
}

// Profiles
export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "Row not found" error
    console.error(`Error fetching profile for user ${userId}:`, error)
    throw error
  }

  return data
}

export async function upsertProfile(profile: Database["public"]["Tables"]["profiles"]["Insert"]) {
  const { data, error } = await supabase.from("profiles").upsert(profile).select().single()

  if (error) {
    console.error("Error upserting profile:", error)
    throw error
  }

  return data
}

// Fortunes
export async function createFortune(fortune: Database["public"]["Tables"]["fortunes"]["Insert"]) {
  const { data, error } = await supabase.from("fortunes").insert(fortune).select().single()

  if (error) {
    console.error("Error creating fortune:", error)
    throw error
  }

  return data
}

export async function getUserFortunes(userId: string) {
  const { data, error } = await supabase
    .from("fortunes")
    .select("*, themes(name)")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false })

  if (error) {
    console.error(`Error fetching fortunes for user ${userId}:`, error)
    return []
  }

  return data
}

// Message Templates
export async function getMessageTemplates(themeId?: string) {
  let query = supabase.from("message_templates").select("*").eq("active", true)

  if (themeId) {
    query = query.eq("theme_id", themeId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching message templates:", error)
    return []
  }

  return data
}

export async function createMessageTemplate(template: Database["public"]["Tables"]["message_templates"]["Insert"]) {
  const { data, error } = await supabase.from("message_templates").insert(template).select().single()

  if (error) {
    console.error("Error creating message template:", error)
    throw error
  }

  return data
}

export async function updateMessageTemplate(
  id: string,
  template: Database["public"]["Tables"]["message_templates"]["Update"],
) {
  const { data, error } = await supabase.from("message_templates").update(template).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating message template ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteMessageTemplate(id: string) {
  const { error } = await supabase.from("message_templates").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting message template ${id}:`, error)
    throw error
  }

  return true
}

// Carts
export async function getUserCart(userId: string) {
  console.log(`getUserCart: Fetching cart for user ${userId}`)

  try {
    // First, check if the user has a cart
    const { data: carts, error: cartError } = await supabase.from("carts").select("*").eq("user_id", userId).limit(1)

    if (cartError) {
      console.error(`Error fetching cart for user ${userId}:`, cartError)
      throw cartError
    }

    console.log(`getUserCart: Found ${carts.length} carts for user`)

    // If no cart exists, create one
    if (carts.length === 0) {
      console.log(`getUserCart: No cart found, creating new cart for user ${userId}`)

      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select()
        .single()

      if (createError) {
        console.error(`Error creating cart for user ${userId}:`, createError)
        throw createError
      }

      console.log(`getUserCart: New cart created with ID ${newCart.id}`)
      return { ...newCart, items: [] }
    }

    // Get cart items
    const cartId = carts[0].id
    console.log(`getUserCart: Fetching items for cart ${cartId}`)

    const { data: cartItems, error: itemsError } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("cart_id", cartId)

    if (itemsError) {
      console.error(`Error fetching cart items for cart ${cartId}:`, itemsError)
      throw itemsError
    }

    console.log(`getUserCart: Found ${cartItems?.length || 0} items in cart`)
    return { ...carts[0], items: cartItems || [] }
  } catch (error) {
    console.error("Error in getUserCart:", error)
    throw error
  }
}

export async function addToCart(userId: string, productId: string, quantity = 1) {
  console.log(`addToCart: Adding product ${productId} to cart for user ${userId}`)

  try {
    // First, verify the product exists
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .single()

    if (productError) {
      console.error(`Product ${productId} not found:`, productError)
      throw new Error(`Product not found: ${productError.message}`)
    }

    console.log(`addToCart: Product ${productId} verified`)

    // Get user's cart
    const cart = await getUserCart(userId)
    console.log(`addToCart: Got cart with ID ${cart.id}`)

    // Check if item already exists in cart
    const existingItem = cart.items.find((item: any) => item.product_id === productId)

    if (existingItem) {
      console.log(
        `addToCart: Item already exists in cart, updating quantity from ${existingItem.quantity} to ${existingItem.quantity + quantity}`,
      )

      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single()

      if (error) {
        console.error(`Error updating cart item ${existingItem.id}:`, error)
        throw error
      }

      console.log(`addToCart: Item updated successfully`)
      return data
    } else {
      console.log(`addToCart: Adding new item to cart ${cart.id}`)

      // Add new item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ cart_id: cart.id, product_id: productId, quantity })
        .select()
        .single()

      if (error) {
        console.error(`Error adding item to cart ${cart.id}:`, error)
        throw error
      }

      console.log(`addToCart: New item added successfully with ID ${data.id}`)
      return data
    }
  } catch (error) {
    console.error("Error in addToCart:", error)
    throw error
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const { data, error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId).select().single()

  if (error) {
    console.error(`Error updating cart item ${cartItemId}:`, error)
    throw error
  }

  return data
}

export async function removeFromCart(cartItemId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

  if (error) {
    console.error(`Error removing item ${cartItemId} from cart:`, error)
    throw error
  }

  return true
}

export async function clearCart(cartId: string) {
  const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId)

  if (error) {
    console.error(`Error clearing cart ${cartId}:`, error)
    throw error
  }

  return true
}

// Orders
export async function createOrder(order: Database["public"]["Tables"]["orders"]["Insert"]) {
  const { data, error } = await supabase.from("orders").insert(order).select().single()

  if (error) {
    console.error("Error creating order:", error)
    throw error
  }

  return data
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching orders for user ${userId}:`, error)
    return []
  }

  return data
}

export async function getOrder(orderId: string) {
  const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

  if (orderError) {
    console.error(`Error fetching order ${orderId}:`, orderError)
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*, products(*)")
    .eq("order_id", orderId)

  if (itemsError) {
    console.error(`Error fetching items for order ${orderId}:`, itemsError)
    return { ...order, items: [] }
  }

  return { ...order, items: items || [] }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    console.error(`Error updating order ${orderId}:`, error)
    throw error
  }

  return data
}

export async function addOrderItem(orderItem: Database["public"]["Tables"]["order_items"]["Insert"]) {
  const { data, error } = await supabase.from("order_items").insert(orderItem).select().single()

  if (error) {
    console.error("Error adding order item:", error)
    throw error
  }

  return data
}

// User Preferences
export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase.from("user_preferences").select("*, themes(*)").eq("user_id", userId)

  if (error) {
    console.error(`Error fetching preferences for user ${userId}:`, error)
    return []
  }

  return data
}

export async function setUserPreference(userId: string, themeId: string) {
  const { data, error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, theme_id: themeId })
    .select()
    .single()

  if (error) {
    console.error(`Error setting preference for user ${userId}:`, error)
    throw error
  }

  return data
}

export async function removeUserPreference(userId: string, themeId: string) {
  const { error } = await supabase.from("user_preferences").delete().eq("user_id", userId).eq("theme_id", themeId)

  if (error) {
    console.error(`Error removing preference for user ${userId}:`, error)
    throw error
  }

  return true
}

// Personalization Rules
export async function getPersonalizationRules() {
  const { data, error } = await supabase
    .from("personalization_rules")
    .select("*")
    .order("priority", { ascending: false })

  if (error) {
    console.error("Error fetching personalization rules:", error)
    return []
  }

  return data
}

export async function createPersonalizationRule(rule: Database["public"]["Tables"]["personalization_rules"]["Insert"]) {
  const { data, error } = await supabase.from("personalization_rules").insert(rule).select().single()

  if (error) {
    console.error("Error creating personalization rule:", error)
    throw error
  }

  return data
}

export async function updatePersonalizationRule(
  id: string,
  rule: Database["public"]["Tables"]["personalization_rules"]["Update"],
) {
  const { data, error } = await supabase.from("personalization_rules").update(rule).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating personalization rule ${id}:`, error)
    throw error
  }

  return data
}

export async function deletePersonalizationRule(id: string) {
  const { error } = await supabase.from("personalization_rules").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting personalization rule ${id}:`, error)
    throw error
  }

  return true
}
