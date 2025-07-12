interface GoogleOAuthConfig {
  clientId: string
  redirectUri: string
  scopes: string[]
}

interface GoogleTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope: string
}

interface GoogleUserInfo {
  email: string
  name: string
  picture: string
}

export class GoogleOAuthService {
  private config: GoogleOAuthConfig

  constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/google/callback`
          : "",
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ]
    }
  }

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(" "),
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      state: this.generateState()
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    )
  }

  async exchangeCodeForToken(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch("/api/auth/google/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      throw new Error("Failed to exchange code for token")
    }

    return response.json()
  }

  async storeTokens(
    tokens: GoogleTokenResponse,
    userId: string
  ): Promise<void> {
    // Store in localStorage for immediate use
    localStorage.setItem("google_access_token", tokens.access_token)
    if (tokens.refresh_token) {
      localStorage.setItem("google_refresh_token", tokens.refresh_token)
    }
    localStorage.setItem(
      "google_token_expires",
      (Date.now() + tokens.expires_in * 1000).toString()
    )

    // Get user info from Google
    const userInfo = await this.getUserInfo(tokens.access_token)

    // Store in database
    await fetch("/api/auth/google/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(
          Date.now() + tokens.expires_in * 1000
        ).toISOString(),
        email: userInfo.email,
        userId: userId
      })
    })
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (!response.ok) {
      throw new Error("Failed to get user info from Google")
    }

    return response.json()
  }

  getStoredTokens(): {
    accessToken: string | null
    refreshToken: string | null
    expiresAt: number | null
  } {
    return {
      accessToken: localStorage.getItem("google_access_token"),
      refreshToken: localStorage.getItem("google_refresh_token"),
      expiresAt: localStorage.getItem("google_token_expires")
        ? parseInt(localStorage.getItem("google_token_expires")!)
        : null
    }
  }

  isTokenValid(): boolean {
    const { accessToken, expiresAt } = this.getStoredTokens()
    if (!accessToken || !expiresAt) return false
    return Date.now() < expiresAt
  }

  clearTokens(): void {
    localStorage.removeItem("google_access_token")
    localStorage.removeItem("google_refresh_token")
    localStorage.removeItem("google_token_expires")
  }

  async initiateAuth(): Promise<void> {
    const authUrl = this.generateAuthUrl()
    window.location.href = authUrl
  }

  async disconnect(userId: string): Promise<void> {
    // Clear localStorage
    this.clearTokens()

    // Remove from database
    await fetch("/api/auth/google/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    })
  }
}

export const googleOAuthService = new GoogleOAuthService()
