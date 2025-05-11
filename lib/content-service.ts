import { supabase } from "./supabase/client"

export interface ContentBlock {
  id: string
  page: string
  section: string
  key: string
  value: string
  type: string
  created_at?: string
  updated_at?: string
}

// Function to check if the content_blocks table exists
export async function checkContentTableExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("content_blocks").select("id").limit(1)
    return !error
  } catch (error) {
    console.error("Error checking content table:", error)
    return false
  }
}

// Function to get content by key
export async function getContentByKey(page: string, section: string, key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("page", page)
      .eq("section", section)
      .eq("key", key)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Content not found
        return null
      }
      console.error(`Error fetching content for ${page}/${section}/${key}:`, error)
      return null
    }

    return data.value
  } catch (error) {
    console.error(`Error fetching content for ${page}/${section}/${key}:`, error)
    return null
  }
}

// Function to get all content for a page
export async function getPageContent(page: string): Promise<ContentBlock[]> {
  try {
    const { data, error } = await supabase.from("content_blocks").select("*").eq("page", page)

    if (error) {
      console.error(`Error fetching content for page ${page}:`, error)
      return []
    }

    return data || []
  } catch (error) {
    console.error(`Error fetching content for page ${page}:`, error)
    return []
  }
}

// Function to get all content pages
export async function getContentPages(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("content_blocks").select("page")

    if (error) {
      console.error("Error fetching content pages:", error)
      return []
    }

    // Extract unique page values
    const uniquePages = [...new Set(data.map((item) => item.page))]
    return uniquePages
  } catch (error) {
    console.error("Error fetching content pages:", error)
    return []
  }
}

// Function to update content
export async function updateContent(page: string, section: string, key: string, value: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ page, section, key, value }, { onConflict: "page,section,key" })

    if (error) {
      console.error(`Error updating content for ${page}/${section}/${key}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error updating content for ${page}/${section}/${key}:`, error)
    return false
  }
}

// Function to create content block
export async function createContentBlock(
  contentBlock: Omit<ContentBlock, "id" | "created_at" | "updated_at">,
): Promise<any> {
  try {
    const { data, error } = await supabase.from("content_blocks").insert([contentBlock]).select().single()

    if (error) {
      console.error("Error creating content block:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error creating content block:", error)
    throw error
  }
}

// Function to update content block
export async function updateContentBlock(
  id: string,
  contentBlock: Omit<ContentBlock, "created_at" | "updated_at">,
): Promise<any> {
  try {
    const { data, error } = await supabase.from("content_blocks").update(contentBlock).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating content block with id ${id}:`, error)
      throw error
    }

    return data
  } catch (error) {
    console.error(`Error updating content block with id ${id}:`, error)
    throw error
  }
}

// Function to upsert content (create or update)
export async function upsertContent(page: string, section: string, key: string, value: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ page, section, key, value, type: "text" }, { onConflict: "page,section,key" })

    if (error) {
      console.error(`Error upserting content for ${page}/${section}/${key}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error upserting content for ${page}/${section}/${key}:`, error)
    return false
  }
}
