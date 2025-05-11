"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, BarChart, LineChart, PieChart, Users, ShoppingBag, QrCode } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock analytics data
const mockUserStats = {
  total: 127,
  newThisMonth: 24,
  activeThisWeek: 68,
  byProvider: [
    { provider: "Google", count: 62, percentage: 49 },
    { provider: "Facebook", count: 43, percentage: 34 },
    { provider: "Email", count: 22, percentage: 17 },
  ],
  byCountry: [
    { country: "United States", count: 78, percentage: 61 },
    { country: "Canada", count: 15, percentage: 12 },
    { country: "United Kingdom", count: 12, percentage: 9 },
    { country: "Australia", count: 8, percentage: 6 },
    { country: "Other", count: 14, percentage: 12 },
  ],
  retention: {
    day1: 85,
    day7: 62,
    day30: 48,
  },
}

const mockScanStats = {
  total: 543,
  thisMonth: 187,
  byTheme: [
    { theme: "Inspiration", count: 112, percentage: 21 },
    { theme: "Serenity", count: 98, percentage: 18 },
    { theme: "Adventure", count: 87, percentage: 16 },
    { theme: "Joy", count: 76, percentage: 14 },
    { theme: "Well-being", count: 68, percentage: 13 },
    { theme: "Mysticism", count: 58, percentage: 11 },
    { theme: "Introspection", count: 44, percentage: 8 },
  ],
  byTime: [
    { hour: "Morning (6am-12pm)", count: 163, percentage: 30 },
    { hour: "Afternoon (12pm-6pm)", count: 185, percentage: 34 },
    { hour: "Evening (6pm-12am)", count: 152, percentage: 28 },
    { hour: "Night (12am-6am)", count: 43, percentage: 8 },
  ],
  conversionToSale: 12, // percentage
}

const mockSalesStats = {
  total: "$2,845.00",
  thisMonth: "$985.00",
  byTheme: [
    { theme: "Inspiration", amount: "$598.00", percentage: 21 },
    { theme: "Serenity", amount: "$512.00", percentage: 18 },
    { theme: "Adventure", amount: "$455.00", percentage: 16 },
    { theme: "Joy", amount: "$398.00", percentage: 14 },
    { theme: "Well-being", amount: "$370.00", percentage: 13 },
    { theme: "Mysticism", amount: "$313.00", percentage: 11 },
    { theme: "Introspection", amount: "$199.00", percentage: 7 },
  ],
  averageOrderValue: "$37.50",
  repeatPurchaseRate: 28, // percentage
}

// Mock monthly data for charts
const mockMonthlyData = [
  { month: "Jan", users: 85, scans: 320, sales: 1850 },
  { month: "Feb", users: 95, scans: 380, sales: 2100 },
  { month: "Mar", users: 127, scans: 543, sales: 2845 },
]

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="scans" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Scans
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Sales
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
                <CardDescription>All time registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockUserStats.total}</div>
                <p className="text-sm text-muted-foreground">+{mockUserStats.newThisMonth} new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total QR Scans</CardTitle>
                <CardDescription>All time scan count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockScanStats.total}</div>
                <p className="text-sm text-muted-foreground">{mockScanStats.thisMonth} scans this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
                <CardDescription>All time sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{mockSalesStats.total}</div>
                <p className="text-sm text-muted-foreground">{mockSalesStats.thisMonth} this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>User growth, scan activity, and sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                  <div className="text-center">
                    <LineChart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Chart visualization would appear here</p>
                    <p className="text-xs text-muted-foreground">
                      (In a real app, this would be an interactive chart showing the trends)
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Users</TableHead>
                        <TableHead className="text-right">QR Scans</TableHead>
                        <TableHead className="text-right">Sales ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMonthlyData.map((data) => (
                        <TableRow key={data.month}>
                          <TableCell>{data.month}</TableCell>
                          <TableCell className="text-right">{data.users}</TableCell>
                          <TableCell className="text-right">{data.scans}</TableCell>
                          <TableCell className="text-right">${data.sales}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>Key metrics about your user base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{mockUserStats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold">{mockUserStats.newThisMonth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active This Week</p>
                    <p className="text-2xl font-bold">{mockUserStats.activeThisWeek}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Retention Rate (30d)</p>
                    <p className="text-2xl font-bold">{mockUserStats.retention.day30}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>How many users return after signing up</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Retention chart would appear here)</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Day 1</p>
                    <p className="text-xl font-bold">{mockUserStats.retention.day1}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Day 7</p>
                    <p className="text-xl font-bold">{mockUserStats.retention.day7}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Day 30</p>
                    <p className="text-xl font-bold">{mockUserStats.retention.day30}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Users by Authentication Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      (Provider distribution chart would appear here)
                    </p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Users</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUserStats.byProvider.map((item) => (
                      <TableRow key={item.provider}>
                        <TableCell>{item.provider}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      (Geographic distribution chart would appear here)
                    </p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Users</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUserStats.byCountry.map((item) => (
                      <TableRow key={item.country}>
                        <TableCell>{item.country}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* QR Scans Tab */}
        <TabsContent value="scans">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scan Statistics</CardTitle>
                <CardDescription>Key metrics about QR code scans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Scans</p>
                    <p className="text-2xl font-bold">{mockScanStats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Scans This Month</p>
                    <p className="text-2xl font-bold">{mockScanStats.thisMonth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Conversion to Sale</p>
                    <p className="text-2xl font-bold">{mockScanStats.conversionToSale}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan Trends</CardTitle>
                <CardDescription>Scan activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Scan trend chart would appear here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scans by Tea Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Theme distribution chart would appear here)</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Theme</TableHead>
                      <TableHead className="text-right">Scans</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockScanStats.byTheme.map((item) => (
                      <TableRow key={item.theme}>
                        <TableCell>{item.theme}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scans by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Time distribution chart would appear here)</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time Period</TableHead>
                      <TableHead className="text-right">Scans</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockScanStats.byTime.map((item) => (
                      <TableRow key={item.hour}>
                        <TableCell>{item.hour}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Statistics</CardTitle>
                <CardDescription>Key metrics about your sales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{mockSalesStats.total}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Revenue This Month</p>
                    <p className="text-2xl font-bold">{mockSalesStats.thisMonth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Average Order Value</p>
                    <p className="text-2xl font-bold">{mockSalesStats.averageOrderValue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Repeat Purchase Rate</p>
                    <p className="text-2xl font-bold">{mockSalesStats.repeatPurchaseRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>Revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Sales trend chart would appear here)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Tea Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">(Sales distribution chart would appear here)</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Theme</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSalesStats.byTheme.map((item) => (
                      <TableRow key={item.theme}>
                        <TableCell>{item.theme}</TableCell>
                        <TableCell className="text-right">{item.amount}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
