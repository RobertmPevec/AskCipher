import { NextRequest, NextResponse } from "next/server"
import { removeGoogleConnection } from "@/db/google-connections"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    await removeGoogleConnection(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error disconnecting Google:", error)
    return NextResponse.json(
      { error: "Failed to disconnect Google account" },
      { status: 500 }
    )
  }
}
