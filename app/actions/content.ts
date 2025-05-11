"use server"

import { createClient } from "@/lib/supabase/server"
import type { ContentBlock } from "@/lib/content-service"

export async function getContentByKey(page: string, section: string, key: string): Promise<string | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("content_blocks")
      .select("value")
      .eq("page", page)
      .eq("section", section)
      .eq("key", key)
      .single()

    if (error) {
      return null
    }

    return data?.value || null
  } catch (error) {
    console.error(`Error fetching content for ${page}/${section}/${key}:`, error)
    return null
  }
}

export async function getPageContent(page: string): Promise<ContentBlock[]> {
  const supabase = createClient()

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

export async function getContentPages(): Promise<string[]> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("content_blocks").select("page")

    if (error) {
      console.error("Error fetching content pages:", error)
      return []
    }

    // Use Set to get unique pages
    const uniquePages = [...new Set(data.map((item) => item.page))]
    return uniquePages
  } catch (error) {
    console.error("Error fetching content pages:", error)
    return []
  }
}

export async function upsertContent(page: string, section: string, key: string, value: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("content_blocks").upsert({ page, section, key, value })

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
