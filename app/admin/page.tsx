"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { getTeaThemes } from "@/lib/tea-themes"
import { useAuth } from "@/contexts/auth-context"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  ShoppingBag,
  Palette,
  Settings,
  Menu,
  Package,
  AlertCircle,
  BarChart,
  Globe,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock users for the admin interface
const mockUsers = [
  { id: "user1", name: "John Doe", email: "john@example.com", provider: "google", createdAt: "2023-01-15" },
  { id: "user2", name: "Jane Smith", email: "jane@example.com", provider: "credentials", createdAt: "2023-02-20" },
  { id: "user3", name: "Bob Johnson", email: "bob@example.com", provider: "facebook", createdAt: "2023-03-10" },
]

// Menu items with icons
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "content", label: "Content", icon: FileText },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "themes", label: "Themes", icon: Palette },
  { id: "products", label: "Products", icon: Package },
  { id: "translations", label: "Translations", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
]

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [themes, setThemes] = useState(getTeaThemes(false))
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role !== "admin") {
        router.push("/unauthorized")
      }
    }
  }, [loading, user, router])

  // Add this useEffect to handle URL parameters for tabs
  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get("tab")
    if (tabParam && menuItems.some((item) => item.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  // Function to toggle theme active status
  const toggleThemeStatus = (themeId: string) => {
    setThemes(themes.map((theme) => (theme.id === themeId ? { ...theme, active: !theme.active } : theme)))
  }

  // Function to handle tab change from the slide menu
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setIsMenuOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 h-12 w-12">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#191919] text-white border-r-white/20 pr-0 w-[280px]">
              <div className="px-7 flex justify-center">
                <Link href="/admin" className="flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative">
                    <img
                      src="/images/infucius-logo.png"
                      alt="INFUCIUS"
                      className="object-contain"
                      width={75}
                      height={75}
                    />
                  </div>
                </Link>
              </div>
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4 px-7 text-white/90">Admin Panel</h2>
                <nav className="flex flex-col gap-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={cn(
                          "flex items-center gap-2 px-7 py-2 text-lg font-medium transition-colors hover:text-primary",
                          activeTab === item.id ? "text-primary" : "text-white/70",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>
                <div className="h-px bg-white/20 mx-7 my-4"></div>
                <div className="px-7">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href="/">Back to Site</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/">Back to Site</Link>
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="mb-8 border rounded-lg shadow-sm overflow-hidden hidden md:block">
        <nav className="flex w-full">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-4 flex-1 font-medium transition-colors",
                  activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <Tabs value={activeTab} className="space-y-6">
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">127</p>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">QR Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">543</p>
                <p className="text-sm text-muted-foreground">+28% from last month</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/admin/analytics?tab=scans">View Scan Data</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$2,845</p>
                <p className="text-sm text-muted-foreground">+5% from last month</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <Link href="/admin/orders">View Orders</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin/themes/new">New Theme</Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin/content/pages/new">New Page</Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin/personalization">Personalization</Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin/analytics">Analytics</Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href="/admin/products">Manage Products</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm font-medium">New Order #ORD-005</p>
                  <p className="text-xs text-muted-foreground">Today at 10:23 AM</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="text-sm font-medium">User Registration: alice@example.com</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 3:45 PM</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-1">
                  <p className="text-sm font-medium">Content Updated: About Page</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 1:12 PM</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <p className="text-sm font-medium">New QR Scan: Serenity Theme</p>
                  <p className="text-xs text-muted-foreground">2 days ago at 5:30 PM</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/admin/analytics?tab=overview">View All Activity</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tea Themes</CardTitle>
              <CardDescription>Manage your tea themes and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {themes.slice(0, 4).map((theme) => (
                  <div key={theme.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{theme.name}</p>
                      <p className="text-sm text-muted-foreground">{theme.description.substring(0, 60)}...</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={theme.active ? "default" : "destructive"}
                        size="sm"
                        onClick={() => toggleThemeStatus(theme.id)}
                      >
                        {theme.active ? "Active" : "Inactive"}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/themes/${theme.id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin?tab=themes">View All Themes</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage website content and blog posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/admin/content">Manage Content</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/content/pages/new">Create New Page</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalization</CardTitle>
                <CardDescription>Customize message delivery rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/admin/personalization">Manage Personalization</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/personalization?tab=rules">Create New Rule</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and fulfill customer orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link href="/admin/orders?status=pending">Pending Orders</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/orders?status=processing">Processing Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>View sales data and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/admin/analytics?tab=sales">View Sales Analytics</Link>
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline">
                    <Link href="/admin/analytics?tab=sales&period=month">Monthly Report</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/analytics?tab=sales&period=year">Yearly Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure global application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="Infucius" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://infucius.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" defaultValue="admin@infucius.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="maintenanceMode" />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the site will display a maintenance message to visitors.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Themes Tab */}
        <TabsContent value="themes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tea Themes</CardTitle>
              <Button asChild>
                <Link href="/admin/themes/new">Create New Theme</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {theme.description.substring(0, 60)}...
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <Button
                        variant={theme.active ? "default" : "destructive"}
                        size="sm"
                        onClick={() => toggleThemeStatus(theme.id)}
                      >
                        {theme.active ? "Active" : "Inactive"}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/themes/${theme.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/themes/${theme.id}/qr`}>QR Codes</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/themes/${theme.id}/messages`}>Messages</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Button asChild>
                <Link href="/admin/products">
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Products Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your tea products, accessories, and inventory.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Active Products</p>
                          <p className="text-2xl font-bold">24</p>
                        </div>
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Low Stock</p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Translations Tab */}
        <TabsContent value="translations" className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Translation Management</h2>
              <Button asChild>
                <Link href="/admin/translations">
                  <Globe className="h-4 w-4 mr-2" />
                  Manage Translations
                </Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Language Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage translations for all languages in your application.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Supported Languages</p>
                          <p className="text-2xl font-bold">9</p>
                        </div>
                        <Globe className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Translation Keys</p>
                          <p className="text-2xl font-bold">124</p>
                        </div>
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Auto-Translation</p>
                          <p className="text-2xl font-bold text-green-500">Active</p>
                        </div>
                        <BarChart className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
