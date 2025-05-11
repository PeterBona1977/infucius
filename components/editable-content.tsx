"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface EditableContentProps {
  page: string
  section: string
  keyName: string
  defaultValue: string
  className?: string
}

export function EditableContent({ page, section, keyName, defaultValue, className = "" }: EditableContentProps) {
  const [content, setContent] = useState<string>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        // First check if the table exists
        const { error: tableError } = await supabase.from("content_blocks").select("id").limit(1)

        if (tableError && tableError.message.includes("does not exist")) {
          // Table doesn't exist, use default value
          setContent(defaultValue)
          setIsLoading(false)
          return
        }

        // Table exists, try to get the content
        const { data, error } = await supabase
          .from("content_blocks")
          .select("value")
          .eq("page", page)
          .eq("section", section)
          .eq("key", keyName)
          .single()

        if (error) {
          // Content not found, use default value
          setContent(defaultValue)
        } else {
          // Content found, use it
          setContent(data.value)
        }
      } catch (error) {
        console.error(`Error loading content for ${page}/${section}/${keyName}:`, error)
        setContent(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [page, section, keyName, defaultValue])

  if (isLoading) {
    return <span className={className}>{defaultValue}</span>
  }

  return <span className={className}>{content}</span>
}

export default EditableContent
