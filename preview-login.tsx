import Image from "next/image"

export default function LoginPreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">Login Page</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Login page preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Google and Facebook social login buttons</li>
          <li>Traditional email/password login option</li>
          <li>Forgot password link</li>
          <li>Link to registration page for new users</li>
          <li>Secure authentication with NextAuth.js</li>
        </ul>
      </div>
    </div>
  )
}
