-- Add Google OAuth fields to profiles table
ALTER TABLE profiles 
ADD COLUMN google_access_token TEXT CHECK (char_length(google_access_token) <= 2000),
ADD COLUMN google_refresh_token TEXT CHECK (char_length(google_refresh_token) <= 1000),
ADD COLUMN google_token_expires_at TIMESTAMPTZ,
ADD COLUMN google_connected_at TIMESTAMPTZ,
ADD COLUMN google_email TEXT CHECK (char_length(google_email) <= 255);

-- Create index for Google connections
CREATE INDEX idx_profiles_google_connected ON profiles (google_connected_at) WHERE google_connected_at IS NOT NULL;