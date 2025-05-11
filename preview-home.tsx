import Image from "next/image"

export default function HomePreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">Home Page</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Home page preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Hero section with "Discover Your Tea Fortune" headline</li>
          <li>Prominent "Scan QR" button</li>
          <li>Tea theme showcase with 7 different themes</li>
          <li>Login/Register call-to-action for new users</li>
          <li>Navigation to shop, scan, and user account</li>
        </ul>
      </div>
    </div>
  )
}
