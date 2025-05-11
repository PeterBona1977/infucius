"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

interface SocialLoginButtonProps {
  provider: "google" | "facebook"
  onClick: () => void
  isLoading?: boolean
}

export function SocialLoginButton({ provider, onClick, isLoading }: SocialLoginButtonProps) {
  return (
    <Button variant="outline" className="w-full flex items-center gap-2" onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : provider === "google" ? (
        <FcGoogle className="h-4 w-4" />
      ) : (
        <Facebook className="h-4 w-4 text-blue-600" />
      )}
      {isLoading ? "Loading..." : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </Button>
  )
}
