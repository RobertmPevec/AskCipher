import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      )
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${request.nextUrl.origin}/auth/google/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Google OAuth configuration is missing" },
        { status: 500 }
      )
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Google token exchange failed:", errorText)
      return NextResponse.json(
        { error: "Failed to exchange authorization code for tokens" },
        { status: 400 }
      )
    }

    const tokens = await tokenResponse.json()
    return NextResponse.json(tokens)
  } catch (error) {
    console.error("Error in Google token exchange:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
