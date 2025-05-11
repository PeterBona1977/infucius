import { NextResponse } from "next/server"
import { checkContentTableExists } from "@/lib/content-service"

export async function GET() {
  try {
    const exists = await checkContentTableExists()
    return NextResponse.json({ exists })
  } catch (error) {
    console.error("Error checking content table:", error)
    return NextResponse.json({ exists: false, error: "Failed to check content table" }, { status: 500 })
  }
}
