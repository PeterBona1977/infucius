"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, Scan, User, Home, ShoppingBag, History, X, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { LanguageWrapper } from "./language-wrapper"

export function Header() {
  return (
    <LanguageWrapper>
      <HeaderContent />
    </LanguageWrapper>
  )
}

function HeaderContent() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const { t } = useLanguage()
  const [logoUrl, setLogoUrl] = useState("/images/logo.png")

  // Force browser to reload the image by adding a cache-busting query parameter
  useEffect(() => {
    setLogoUrl(`/images/logo.png?v=${new Date().getTime()}`)
  }, [])

  const routes = [
    { href: "/", label: t("common.home") || "Home", icon: Home },
    { href: "/scan", label: t("common.scanQR") || "Scan QR", icon: Scan },
    { href: "/shop", label: t("common.shop") || "Shop", icon: ShoppingBag },
    ...(user ? [{ href: "/history", label: t("common.myMessages") || "My Messages", icon: History }] : []),
    ...(user && user.role === "admin"
      ? [{ href: "/admin", label: t("common.adminDashboard") || "Admin Dashboard", icon: Settings }]
      : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#191919] text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Left section: Mobile menu button and desktop navigation */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <div className="md:hidden mr-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-12 w-12">
                    <Menu className="h-7 w-7" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#191919] text-white border-r-white/20 pr-0">
                  <div className="px-7 flex justify-center">
                    <Link href="/" className="flex items-center justify-center" onClick={() => setIsOpen(false)}>
                      <div className="relative">
                        <img
                          src={logoUrl || "/placeholder.svg"}
                          alt="INFUCIUS"
                          className="object-contain w-[100px] h-[100px]"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.onerror = null
                            e.currentTarget.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </div>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-4 mt-8">
                    {routes.map((route) => {
                      const Icon = route.icon
                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-primary",
                            pathname === route.href ? "text-primary" : "text-white/70",
                          )}
                        >
                          <Icon className="h-6 w-6" />
                          {route.label}
                        </Link>
                      )
                    })}
                    {!user && !loading && (
                      <>
                        <div className="h-px bg-white/20 mx-7 my-2"></div>
                        <Link
                          href="/login"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-primary text-white/70"
                        >
                          <User className="h-5 w-5" />
                          {t("common.login") || "Login"}
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-primary text-white/70"
                        >
                          <User className="h-5 w-5" />
                          {t("common.register") || "Register"}
                        </Link>
                      </>
                    )}
                    {user && (
                      <>
                        <button
                          onClick={() => {
                            setIsOpen(false)
                            logout()
                          }}
                          className="flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-primary text-white/70"
                        >
                          <X className="h-5 w-5" />
                          {t("common.logout") || "Logout"}
                        </button>
                      </>
                    )}
                    <div className="h-px bg-white/20 mx-7 my-2"></div>
                    <div className="px-7 flex items-center">
                      <span className="text-white/70 mr-2">{t("common.language") || "Language"}:</span>
                      <LanguageSelector />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {routes.slice(0, 3).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.href ? "text-primary" : "text-white/80",
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center section: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center justify-center">
              <img
                src={logoUrl || "/placeholder.svg"}
                alt="INFUCIUS"
                className="object-contain h-[70px] w-auto"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.onerror = null
                  e.currentTarget.src = "/placeholder.svg?height=70&width=70"
                }}
              />
            </Link>
          </div>

          {/* Right section: Cart, Scan QR, User */}
          <div className="flex items-center gap-2">
            {/* Language Selector - Desktop */}
            <div className="hidden md:flex items-center mr-2">
              <LanguageSelector />
            </div>

            {/* Additional nav items for logged in users */}
            <nav className="hidden md:flex items-center space-x-4 mr-2">
              {routes.slice(3).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.href ? "text-primary" : "text-white/80",
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>

            <Link href={user ? "/cart" : "/login"}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 h-12 w-12"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />
              </Button>
            </Link>

            <Link href="/scan" className="hidden md:block">
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10 hover:text-white h-10"
                size="sm"
              >
                <Scan className="mr-2 h-5 w-5" />
                {t("common.scanQR") || "Scan QR"}
              </Button>
            </Link>

            {loading ? (
              <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-12 w-12">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.image || ""} alt={user.name || ""} />
                      <AvatarFallback className="bg-white/10 text-white">{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#191919] text-white border-white/20">
                  <DropdownMenuLabel>{t("common.myAccount") || "My Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                    <Link href="/profile">{t("common.profile") || "Profile"}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                    <Link href="/history">{t("common.messageHistory") || "Message History"}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                    <Link href="/orders">{t("common.orders") || "Orders"}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem onClick={logout} className="hover:bg-white/10 focus:bg-white/10">
                    {t("common.logout") || "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
                    <Link href="/login">{t("common.login") || "Login"}</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-white text-[#191919] hover:bg-white/90">
                    <Link href="/register">{t("common.register") || "Register"}</Link>
                  </Button>
                </div>
                <Link href="/login" className="md:hidden">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-12 w-12">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-white/10 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
