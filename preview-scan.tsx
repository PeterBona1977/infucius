import Image from "next/image"

export default function ScanPreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">QR Scanner</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="QR scanner preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Camera access for QR code scanning</li>
          <li>Visual guide for positioning the QR code</li>
          <li>Automatic detection and processing</li>
          <li>Redirects to personalized fortune message</li>
        </ul>
      </div>
    </div>
  )
}
