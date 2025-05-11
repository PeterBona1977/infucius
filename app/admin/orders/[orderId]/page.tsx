"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Printer, Mail, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock order data - same as in the orders page
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
    address: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "USA",
    },
    shipping: {
      method: "Standard Shipping",
      cost: 4.99,
      trackingNumber: "TRK12345678",
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      subtotal: 29.98,
      shipping: 4.99,
      tax: 2.75,
      total: 37.72,
    },
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
    address: {
      street: "456 Oak Ave",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
    },
    shipping: {
      method: "Express Shipping",
      cost: 9.99,
      trackingNumber: "TRK87654321",
    },
    payment: {
      method: "PayPal",
      last4: "",
      subtotal: 44.97,
      shipping: 9.99,
      tax: 4.4,
      total: 59.36,
    },
  },
  {
    id: "ORD-003",
    customer: "Bob Johnson",
    email: "bob@example.com",
    date: "2023-03-20",
    total: 14.99,
    status: "processing",
    items: [{ id: "item5", name: "Mysticism Tea", quantity: 1, price: 14.99 }],
    address: {
      street: "789 Pine St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    shipping: {
      method: "Standard Shipping",
      cost: 4.99,
      trackingNumber: "",
    },
    payment: {
      method: "Credit Card",
      last4: "1234",
      subtotal: 14.99,
      shipping: 4.99,
      tax: 1.5,
      total: 21.48,
    },
  },
  {
    id: "ORD-004",
    customer: "Alice Williams",
    email: "alice@example.com",
    date: "2023-03-21",
    total: 29.98,
    status: "pending",
    items: [{ id: "item6", name: "Well-being Tea", quantity: 2, price: 14.99 }],
    address: {
      street: "101 Maple Dr",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      country: "USA",
    },
    shipping: {
      method: "Standard Shipping",
      cost: 4.99,
      trackingNumber: "",
    },
    payment: {
      method: "Credit Card",
      last4: "5678",
      subtotal: 29.98,
      shipping: 4.99,
      tax: 2.8,
      total: 37.77,
    },
  },
  {
    id: "ORD-005",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    date: "2023-03-22",
    total: 59.96,
    status: "cancelled",
    items: [{ id: "item7", name: "Introspection Tea", quantity: 4, price: 14.99 }],
    address: {
      street: "202 Cedar Ln",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "USA",
    },
    shipping: {
      method: "Express Shipping",
      cost: 9.99,
      trackingNumber: "",
    },
    payment: {
      method: "Credit Card",
      last4: "9012",
      subtotal: 59.96,
      shipping: 9.99,
      tax: 5.75,
      total: 75.7,
    },
  },
]

interface OrderDetailPageProps {
  params: {
    orderId: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [status, setStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  // Load order data
  useEffect(() => {
    const foundOrder = mockOrders.find((o) => o.id === orderId)
    if (foundOrder) {
      setOrder(foundOrder)
      setStatus(foundOrder.status)
    }
  }, [orderId])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  if (!order) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested order could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/orders">Back to Orders</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

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

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus)
  }

  const handleUpdateOrder = () => {
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setOrder({
        ...order,
        status: status,
      })
      setIsUpdating(false)
    }, 1000)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order Details: {order.id}</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order Summary</CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(order.status)}
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p>{order.customer}</p>
                <p>{order.email}</p>
                <Button variant="ghost" size="sm" className="mt-2 h-8 px-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Customer
                </Button>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zip}
                </p>
                <p>{order.address.country}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Shipping Information</h3>
                <p>
                  <span className="text-muted-foreground">Method:</span> {order.shipping.method}
                </p>
                <p>
                  <span className="text-muted-foreground">Cost:</span> ${order.shipping.cost.toFixed(2)}
                </p>
                {order.shipping.trackingNumber && (
                  <p>
                    <span className="text-muted-foreground">Tracking:</span> {order.shipping.trackingNumber}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p>
                  <span className="text-muted-foreground">Method:</span> {order.payment.method}
                </p>
                {order.payment.last4 && (
                  <p>
                    <span className="text-muted-foreground">Card:</span> •••• {order.payment.last4}
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${order.payment.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${order.payment.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${order.payment.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${order.payment.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Status</label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {status === "shipped" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tracking Number</label>
                  <input
                    type="text"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter tracking number"
                    defaultValue={order.shipping.trackingNumber}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateOrder} disabled={isUpdating || status === order.status}>
              {isUpdating ? "Updating..." : "Update Order"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
