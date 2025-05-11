"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Edit, Plus, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock products data
const mockProducts = [
  {
    id: "prod-001",
    name: "Inspiration Tea - 50g Tin",
    themeId: "inspiration",
    price: 14.99,
    stock: 42,
    sku: "INS-50G-TIN",
    status: "active",
  },
  {
    id: "prod-002",
    name: "Serenity Tea - 50g Tin",
    themeId: "serenity",
    price: 14.99,
    stock: 38,
    sku: "SER-50G-TIN",
    status: "active",
  },
  {
    id: "prod-003",
    name: "Adventure Tea - 50g Tin",
    themeId: "adventure",
    price: 14.99,
    stock: 27,
    sku: "ADV-50G-TIN",
    status: "active",
  },
  {
    id: "prod-004",
    name: "Joy Tea - 50g Tin",
    themeId: "joy",
    price: 14.99,
    stock: 0,
    sku: "JOY-50G-TIN",
    status: "out_of_stock",
  },
  {
    id: "prod-005",
    name: "Well-being Tea - 50g Tin",
    themeId: "well-being",
    price: 14.99,
    stock: 15,
    sku: "WLB-50G-TIN",
    status: "active",
  },
  {
    id: "prod-006",
    name: "Mysticism Tea - 50g Tin",
    themeId: "mysticism",
    price: 14.99,
    stock: 19,
    sku: "MYS-50G-TIN",
    status: "active",
  },
  {
    id: "prod-007",
    name: "Introspection Tea - 50g Tin",
    themeId: "introspection",
    price: 14.99,
    stock: 0,
    sku: "INT-50G-TIN",
    status: "inactive",
  },
  {
    id: "prod-008",
    name: "Tea Sampler Pack",
    themeId: "multiple",
    price: 29.99,
    stock: 25,
    sku: "SAMPLER-7",
    status: "active",
  },
  {
    id: "prod-009",
    name: "Ceramic Tea Infuser",
    themeId: "accessories",
    price: 12.99,
    stock: 30,
    sku: "ACC-INFUSER",
    status: "active",
  },
  {
    id: "prod-010",
    name: "Bamboo Tea Box",
    themeId: "accessories",
    price: 24.99,
    stock: 12,
    sku: "ACC-BOX",
    status: "active",
  },
]

export default function ProductsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState(mockProducts)
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

  // Filter products based on active tab
  const filteredProducts =
    activeTab === "all"
      ? products
      : products.filter((product) => {
          if (activeTab === "out_of_stock") return product.stock === 0
          return product.status === activeTab
        })

  // Function to toggle product status
  const toggleProductStatus = (productId: string) => {
    setProducts(
      products.map((product) => {
        if (product.id === productId) {
          const newStatus = product.status === "active" ? "inactive" : "active"
          return { ...product, status: newStatus }
        }
        return product
      }),
    )
  }

  // Get status badge
  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-orange-500">Out of Stock</Badge>
    }

    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-500">Inactive</Badge>
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
        <h1 className="text-2xl font-bold">Product Management</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant={activeTab === "all" ? "default" : "outline"} onClick={() => setActiveTab("all")}>
              All Products
            </Button>
            <Button variant={activeTab === "active" ? "default" : "outline"} onClick={() => setActiveTab("active")}>
              Active
            </Button>
            <Button variant={activeTab === "inactive" ? "default" : "outline"} onClick={() => setActiveTab("inactive")}>
              Inactive
            </Button>
            <Button
              variant={activeTab === "out_of_stock" ? "default" : "outline"}
              onClick={() => setActiveTab("out_of_stock")}
            >
              Out of Stock
            </Button>
          </div>

          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <div className="flex items-center">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </div>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleProductStatus(product.id)}>
                          {product.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/shop/${product.themeId}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No products found.</p>
            </div>
          )}
          <div className="mt-4 p-4 border rounded bg-muted">
            <h3 className="font-medium mb-2">Debug Links:</h3>
            <div className="flex flex-wrap gap-2">
              {mockProducts.slice(0, 3).map((product) => (
                <Button key={product.id} variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}/edit`}>Direct Edit: {product.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
