import Image from "next/image"

export default function ProfilePreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">User Profile</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Profile page preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>User information from social login (name, email, photo)</li>
          <li>Additional data collected (locale, preferences)</li>
          <li>Account management options</li>
          <li>Links to message history and orders</li>
          <li>Tea preferences management</li>
        </ul>
      </div>
    </div>
  )
}
