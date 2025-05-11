"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Eye, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock order data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-03-15",
    total: 29.98,
    status: "completed",
    items: [
      { id: "item1", name: "Inspiration Tea", quantity: 1, price: 14.99 },
      { id: "item2", name: "Serenity Tea", quantity: 1, price: 14.99 },
    ],
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-03-18",
    total: 44.97,
    status: "shipped",
    items: [
      { id: "item3", name: "Adventure Tea", quantity: 2, price: 14.99 },
      { id: "item4", name: "Joy Tea", quantity: 1, price: 14.99 },
    ],
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2023-03-20",
    total: 14.99,
    status: "processing",
    items: [{ id: "item5", name: "Mysticism Tea", quantity: 1, price: 14.99 }],
  },
  {
    id: "ORD-004",
    customer: "Alice Williams",
    email: "alice@example.com",
    date: "2023-03-21",
    total: 29.98,
    status: "pending",
    items: [{ id: "item6", name: "Well-being Tea", quantity: 2, price: 14.99 }],
  },
  {
    id: "ORD-005",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    date: "2023-03-22",
    total: 59.96,
    status: "cancelled",
    items: [{ id: "item7", name: "Introspection Tea", quantity: 4, price: 14.99 }],
  },
]

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState(mockOrders)
  const [activeTab, setActiveTab] = useState("all")

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

  // Filter orders based on active tab
  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "shipped":
        return (
          <Badge className="bg-blue-500">
            <Truck className="h-3 w-3 mr-1" /> Shipped
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-500">
            <Package className="h-3 w-3 mr-1" /> Processing
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-orange-500">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
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
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "all"
                  ? "All Orders"
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No orders found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
