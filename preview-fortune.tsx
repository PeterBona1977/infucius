import Image from "next/image"

export default function FortunePreview() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <div className="bg-gray-100 p-2 text-center text-xs text-gray-500">Personalized Fortune</div>
      <Image
        src="/placeholder.svg?height=600&width=320"
        width={320}
        height={600}
        alt="Fortune message preview"
        className="w-full"
      />
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-sm">Key Features:</h3>
        <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
          <li>Personalized message based on tea theme</li>
          <li>Context-aware content (time, location, weather)</li>
          <li>Styled card with theme-specific colors</li>
          <li>Options to shop the tea or scan another code</li>
          <li>Link to view message history (for registered users)</li>
        </ul>
      </div>
    </div>
  )
}
