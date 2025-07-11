-- Create a default user and workspace for no-auth setup
-- This creates a mock user that will be used for all sessions

-- Insert a default user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'default@askcipher.local',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create a profile for the default user
INSERT INTO profiles (
  id,
  user_id,
  username,
  display_name,
  bio,
  has_onboarded,
  image_url,
  image_path,
  profile_context,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'default_user',
  'Default User',
  'Default user for AskCipher',
  true,
  null,
  null,
  'You are a helpful AI assistant.',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create a default workspace
INSERT INTO workspaces (
  id,
  user_id,
  name,
  description,
  is_home,
  default_context_length,
  default_model,
  default_prompt,
  default_temperature,
  include_profile_context,
  include_workspace_instructions,
  instructions,
  sharing,
  created_at,
  updated_at,
  embeddings_provider
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'Default Workspace',
  'Default workspace for AskCipher',
  true,
  4096,
  'gpt-4',
  'You are a helpful AI assistant.',
  0.5,
  true,
  true,
  'Be helpful and concise.',
  'private',
  now(),
  now(),
  'openai'
) ON CONFLICT (id) DO NOTHING;