"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Check, Database, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function InitializeContentPage() {
  const [isChecking, setIsChecking] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null)

  async function checkTableExists() {
    try {
      setIsChecking(true)
      setStatus(null)

      // Use the API route to check if the table exists
      const response = await fetch("/api/admin/check-content-table", {
        method: "GET",
      })

      if (!response.ok) {
        const text = await response.text()
        try {
          // Try to parse as JSON
          const data = JSON.parse(text)
          setStatus({ success: false, message: data.error || "Failed to check table status" })
        } catch (e) {
          // If not JSON, use the text
          setStatus({ success: false, message: `Failed to check table status: ${text}` })
        }
        setTableExists(false)
        return
      }

      const data = await response.json()
      setTableExists(data.exists)
      setStatus({ success: true, message: data.message })
    } catch (error) {
      console.error("Error checking if table exists:", error)
      setStatus({ success: false, message: `Error checking table status: ${String(error)}` })
      setTableExists(false)
    } finally {
      setIsChecking(false)
    }
  }

  async function initializeContentTable() {
    try {
      setIsInitializing(true)
      setStatus(null)

      // Use the API route to initialize the content table
      const response = await fetch("/api/admin/initialize-content", {
        method: "POST",
      })

      // Always try to get the response as text first
      const text = await response.text()

      let data
      try {
        // Try to parse the text as JSON
        data = JSON.parse(text)
      } catch (e) {
        // If it's not valid JSON, create an error object
        console.error("Invalid JSON response:", text)
        setStatus({
          success: false,
          message: `Server returned invalid JSON: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
        })
        return
      }

      if (!response.ok) {
        setStatus({ success: false, message: data.error || "Failed to initialize content database" })
        return
      }

      setStatus({ success: true, message: data.message || "Content database initialized successfully" })

      // Refresh table exists status
      await checkTableExists()
    } catch (error) {
      console.error("Error initializing content database:", error)
      setStatus({ success: false, message: `Error initializing content database: ${String(error)}` })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/content">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Management
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Initialize Content Database</h1>
      </div>

      {status && (
        <Alert variant={status.success ? "default" : "destructive"} className="mb-6">
          {status.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{status.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Check Database Status</CardTitle>
          <CardDescription>Check if the content_blocks table already exists in the database.</CardDescription>
        </CardHeader>
        <CardContent>
          {tableExists === true && (
            <div className="text-green-600 font-medium">✓ The content_blocks table exists in the database.</div>
          )}
          {tableExists === false && (
            <div className="text-amber-600 font-medium">✗ The content_blocks table does not exist in the database.</div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={checkTableExists} disabled={isChecking}>
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Check Table Status
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initialize Content Database</CardTitle>
          <CardDescription>Create the content_blocks table and initialize it with default content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This will create the content_blocks table if it doesn't exist and populate it with default content for the
            homepage. If the table already exists, it will only add missing default content.
          </p>
          {tableExists === true && (
            <div className="text-amber-600 font-medium mb-4">
              Warning: The content_blocks table already exists. Initializing will only add missing default content.
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={initializeContentTable} disabled={isInitializing}>
            {isInitializing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Initialize Content Database
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
