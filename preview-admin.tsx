import Image from "next/image"

export default function AdminPreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">Admin Dashboard</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Admin dashboard preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Tea theme management (add, edit, deactivate)</li>
          <li>User data analytics and management</li>
          <li>QR code generation for tea products</li>
          <li>Message template management</li>
          <li>Sales and order tracking</li>
        </ul>
      </div>
    </div>
  )
}
