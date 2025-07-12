import { supabase } from "@/lib/supabase/browser-client"

export interface GoogleConnection {
  accessToken: string
  refreshToken?: string
  expiresAt: string
  email: string
}

export const saveGoogleConnection = async (
  userId: string,
  connection: GoogleConnection
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      google_access_token: connection.accessToken,
      google_refresh_token: connection.refreshToken,
      google_token_expires_at: connection.expiresAt,
      google_connected_at: new Date().toISOString(),
      google_email: connection.email,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save Google connection: ${error.message}`)
  }

  return data
}

export const getGoogleConnection = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      google_access_token,
      google_refresh_token,
      google_token_expires_at,
      google_connected_at,
      google_email
    `
    )
    .eq("user_id", userId)
    .single()

  if (error) {
    throw new Error(`Failed to get Google connection: ${error.message}`)
  }

  return data
}

export const removeGoogleConnection = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      google_access_token: null,
      google_refresh_token: null,
      google_token_expires_at: null,
      google_connected_at: null,
      google_email: null,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to remove Google connection: ${error.message}`)
  }

  return data
}

export const isGoogleConnected = async (userId: string): Promise<boolean> => {
  try {
    const connection = await getGoogleConnection(userId)

    if (
      !connection.google_access_token ||
      !connection.google_token_expires_at
    ) {
      return false
    }

    // Check if token is still valid
    const expiresAt = new Date(connection.google_token_expires_at)
    const now = new Date()

    return now < expiresAt
  } catch (error) {
    return false
  }
}
