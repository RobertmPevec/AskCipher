"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { googleOAuthService } from "@/lib/google-oauth"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  )
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          setError(`OAuth error: ${error}`)
          setStatus("error")
          return
        }

        if (!code) {
          setError("No authorization code received")
          setStatus("error")
          return
        }

        // Exchange code for tokens
        const tokens = await googleOAuthService.exchangeCodeForToken(code)

        // Store tokens (both localStorage and database)
        // For now using mock user ID - in a real app, you'd get this from auth context
        const mockUserId = "00000000-0000-0000-0000-000000000000"
        await googleOAuthService.storeTokens(tokens, mockUserId)

        // Set flag for success toast
        localStorage.setItem("google_just_connected", "true")

        // Redirect immediately without showing success screen
        router.push("/en/00000000-0000-0000-0000-000000000002/chat")
      } catch (err) {
        console.error("OAuth callback error:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setStatus("error")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <div>
            <div className="mb-4 text-lg">Connecting to Google...</div>
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="mb-4 text-lg text-green-600">
              ✓ Successfully connected to Google!
            </div>
            <div className="text-sm text-gray-600">Redirecting you back...</div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mb-4 text-lg text-red-600">✗ Connection failed</div>
            <div className="mb-4 text-sm text-gray-600">{error}</div>
            <button
              onClick={() => router.push("/chat")}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Return to App
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
