"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export function HomeClientWrapper() {
  const { user, loading } = useAuth()

  if (loading || user) {
    return null
  }

  return (
    <section className="mb-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Join Our Tea Journey</CardTitle>
          <CardDescription>Register to unlock your message history and shop our exclusive teas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            As a registered user, you'll have access to your personal message history, exclusive discounts, and the
            ability to purchase our teas directly through the app.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  )
}
