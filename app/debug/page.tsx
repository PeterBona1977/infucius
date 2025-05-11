"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function DebugPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<"checking" | "connected" | "error">("checking")
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{ [key: string]: string | undefined }>({})

  useEffect(() => {
    // Check if we can connect to Supabase
    async function checkSupabase() {
      try {
        const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

        if (error) {
          setSupabaseStatus("error")
          setSupabaseError(error.message)
        } else {
          setSupabaseStatus("connected")
        }
      } catch (err: any) {
        setSupabaseStatus("error")
        setSupabaseError(err.message || "Unknown error")
      }
    }

    // Check environment variables (only public ones will be visible)
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "[REDACTED]" : undefined,
    })

    checkSupabase()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

      <div className="grid gap-6">
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-2">Environment</h2>
          <div className="space-y-2">
            <div>
              <strong>Node Environment:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>Public Environment Variables:</strong>
              <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-x-auto">{JSON.stringify(envVars, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-2">Supabase Connection</h2>
          <div className="space-y-2">
            <div>
              <strong>Status:</strong> {supabaseStatus === "checking" && "Checking..."}
              {supabaseStatus === "connected" && <span className="text-green-600">Connected</span>}
              {supabaseStatus === "error" && <span className="text-red-600">Error</span>}
            </div>
            {supabaseError && (
              <div>
                <strong>Error:</strong> <span className="text-red-600">{supabaseError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
