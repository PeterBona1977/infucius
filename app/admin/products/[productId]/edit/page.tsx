"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react"
import { getTeaThemes } from "@/lib/tea-themes"
import { toast } from "@/hooks/use-toast"

// Mock products data (same as in the products page)
const mockProducts = [
  {
    id: "prod-001",
    name: "Inspiration Tea - 50g Tin",
    themeId: "inspiration",
    price: 14.99,
    salePrice: null,
    sku: "INS-50G-TIN",
    stock: 42,
    weight: "50",
    dimensions: "8 x 8 x 10",
    description:
      "Our Inspiration tea is carefully crafted to ignite your creative spark. This blend combines premium black tea with subtle notes of citrus and spice, designed to awaken your senses and fuel your imagination.",
    shortDescription: "A blend designed to ignite your creative spark and fuel your imagination.",
    status: "active",
    active: true,
    featured: true,
    images: [],
  },
  {
    id: "prod-002",
    name: "Serenity Tea - 50g Tin",
    themeId: "serenity",
    price: 14.99,
    salePrice: null,
    sku: "SER-50G-TIN",
    stock: 38,
    weight: "50",
    dimensions: "8 x 8 x 10",
    description:
      "Find your center with our Serenity blend. This calming herbal infusion combines chamomile, lavender, and lemon balm to promote peace and tranquility, perfect for unwinding after a long day.",
    shortDescription: "Find your center with this calming blend that promotes peace and tranquility.",
    status: "active",
    active: true,
    featured: false,
    images: [],
  },
]

interface ProductEditPageProps {
  params: {
    productId: string
  }
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
  const { productId } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [productImages, setProductImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const themes = getTeaThemes(false)

  // Add "Accessories" to the themes list
  const productCategories = [
    ...themes,
    { id: "accessories", name: "Accessories", description: "Tea accessories and tools" },
    { id: "multiple", name: "Multiple Themes", description: "Products that include multiple tea themes" },
  ]

  const [formData, setFormData] = useState({
    name: "",
    themeId: "",
    price: "",
    salePrice: "",
    sku: "",
    stock: "0",
    weight: "",
    dimensions: "",
    description: "",
    shortDescription: "",
    active: true,
    featured: false,
  })

  // Check if user is authenticated and redirect if not
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (!loading && user?.role !== "admin") {
      router.push("/unauthorized")
    }
  }, [loading, user, router])

  // Load product data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundProduct = mockProducts.find((p) => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        name: foundProduct.name,
        themeId: foundProduct.themeId,
        price: foundProduct.price.toString(),
        salePrice: foundProduct.salePrice ? foundProduct.salePrice.toString() : "",
        sku: foundProduct.sku,
        stock: foundProduct.stock.toString(),
        weight: foundProduct.weight,
        dimensions: foundProduct.dimensions,
        description: foundProduct.description,
        shortDescription: foundProduct.shortDescription,
        active: foundProduct.active,
        featured: foundProduct.featured,
      })

      // If the product has images, load them
      if (foundProduct.images && foundProduct.images.length > 0) {
        setProductImages(foundProduct.images)
      }
    }
  }, [productId])

  // Add this after the useEffect for loading product data
  useEffect(() => {
    console.log("Product ID:", productId)
    console.log("Available products:", mockProducts)
    console.log(
      "Found product:",
      mockProducts.find((p) => p.id === productId),
    )
  }, [productId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files
    if (!files || files.length === 0) return

    // In a real app, you would upload these files to a server
    // Here we'll just create object URLs for preview
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))

    setProductImages((prev) => [...prev, ...newImages])

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Show a toast notification
    toast({
      title: "Images added",
      description: `${files.length} image${files.length > 1 ? "s" : ""} added to product. Don't forget to save changes.`,
    })
  }

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => {
      const newImages = [...prev]
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImages[index])
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would update the database
      const updatedProduct = {
        id: productId,
        ...formData,
        price: Number.parseFloat(formData.price),
        salePrice: formData.salePrice ? Number.parseFloat(formData.salePrice) : null,
        stock: Number.parseInt(formData.stock),
        images: productImages,
      }

      console.log("Updated product:", updatedProduct)

      // Update the mock product in our array (in a real app, this would be a database update)
      const productIndex = mockProducts.findIndex((p) => p.id === productId)
      if (productIndex !== -1) {
        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          ...updatedProduct,
        }
      }

      setIsSaving(false)

      // Show success toast
      toast({
        title: "Product updated",
        description: `${formData.name} has been updated successfully with ${productImages.length} images.`,
      })

      router.push("/admin/products")
    }, 1000)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setIsDeleting(true)

      // Simulate API call
      setTimeout(() => {
        // In a real app, this would delete from the database
        console.log("Deleted product:", productId)
        setIsDeleting(false)
        router.push("/admin/products")
      }, 1000)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null // Will redirect in the useEffect
  }

  if (!product) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested product could not be found.</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Product: {product.name}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="themeId">Category/Theme</Label>
                <Select value={formData.themeId} onValueChange={(value) => handleSelectChange("themeId", value)}>
                  <SelectTrigger id="themeId">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price ($)</Label>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">Leave empty if not on sale</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input id="weight" name="weight" value={formData.weight} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (cm)</Label>
                <Input id="dimensions" name="dimensions" value={formData.dimensions} onChange={handleChange} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                />
                <Label htmlFor="active">Active</Label>
                <p className="text-sm text-muted-foreground ml-2">Product will be visible and available for purchase</p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
                <p className="text-sm text-muted-foreground ml-2">
                  Product will be highlighted on the homepage and category pages
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Images ({productImages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {productImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {productImages.map((image, index) => (
                  <div key={index} className="border rounded-lg p-2 relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-auto aspect-square object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemoveImage(index)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mx-auto flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Drag and drop images here, or click to browse</p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="product-image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={(e) => {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }}
                >
                  Upload Images
                </Button>
              </div>
            </div>

            {productImages.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md">
                <p className="text-sm">
                  <strong>Note:</strong> {productImages.length} image{productImages.length !== 1 ? "s" : ""} will be
                  saved with this product when you click "Save Changes".
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Product"}
          </Button>

          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes {productImages.length > 0 && `(with ${productImages.length} images)`}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
