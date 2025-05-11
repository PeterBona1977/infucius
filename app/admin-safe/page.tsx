"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminSafeRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin-basic")
  }, [router])

  return (
    <div className="p-8 text-center">
      <p>Redirecting to safe admin page...</p>
    </div>
  )
}
