"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login, loginWithCredentials, loading } = useAuth()

  // Check for error from NextAuth
  useEffect(() => {
    const errorMessage = searchParams?.get("error")
    if (errorMessage) {
      setError(
        errorMessage === "OAuthAccountNotLinked"
          ? "Email already used with different provider"
          : "Authentication error. Please try again.",
      )

      toast({
        title: "Authentication Error",
        description: "There was a problem signing you in. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await loginWithCredentials(email, password)

      // Check if the user is an admin and redirect accordingly
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        router.push("/")
      }
    } catch (err) {
      setError("Invalid email or password")
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await login(provider)

      // Check if the user is an admin and redirect accordingly
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        router.push("/")
      }
    } catch (err) {
      console.error("Social login error:", err)
      setError(`Error logging in with ${provider}`)
      toast({
        title: "Login Failed",
        description: `Error logging in with ${provider}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
            <br />
            <span className="text-xs text-muted-foreground mt-1">Admin access: admin@infucius.com / admin123</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">{error}</div>}

          <div className="space-y-2">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSocialLogin("google")}
              disabled={isLoading || loading}
            >
              {isLoading || loading ? "Loading..." : "Continue with Google"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleSocialLogin("facebook")}
              disabled={isLoading || loading}
            >
              {isLoading || loading ? "Loading..." : "Continue with Facebook"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || loading}>
              {isLoading || loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
