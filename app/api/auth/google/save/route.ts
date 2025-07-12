import { NextRequest, NextResponse } from "next/server"
import { saveGoogleConnection } from "@/db/google-connections"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken, expiresAt, email, userId } =
      await request.json()

    if (!accessToken || !email || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    await saveGoogleConnection(userId, {
      accessToken,
      refreshToken,
      expiresAt,
      email
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving Google connection:", error)
    return NextResponse.json(
      { error: "Failed to save Google connection" },
      { status: 500 }
    )
  }
}
