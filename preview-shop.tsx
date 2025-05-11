import Image from "next/image"

export default function ShopPreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">Shop Page</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Shop page preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Grid display of all tea themes/products</li>
          <li>Visual cards with theme colors and images</li>
          <li>Quick access to product details</li>
          <li>Responsive layout for all device sizes</li>
          <li>Direct "Shop Now" buttons for each product</li>
        </ul>
      </div>
    </div>
  )
}
