import { Tables } from "@/supabase/types"

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000"
export const MOCK_PROFILE_ID = "00000000-0000-0000-0000-000000000001"
export const MOCK_WORKSPACE_ID = "00000000-0000-0000-0000-000000000002"

export const MOCK_PROFILE: Tables<"profiles"> = {
  id: MOCK_PROFILE_ID,
  user_id: MOCK_USER_ID,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  bio: "Default user for AskCipher",
  has_onboarded: true,
  image_url: "",
  image_path: "",
  profile_context: "You are a helpful AI assistant.",
  display_name: "Default User",
  use_azure_openai: false,
  username: "default_user",
  anthropic_api_key: null,
  azure_openai_35_turbo_id: null,
  azure_openai_45_turbo_id: null,
  azure_openai_45_vision_id: null,
  azure_openai_api_key: null,
  azure_openai_endpoint: null,
  google_gemini_api_key: null,
  groq_api_key: null,
  mistral_api_key: null,
  openai_api_key: null,
  openai_organization_id: null,
  perplexity_api_key: null,
  azure_openai_embeddings_id: null,
  openrouter_api_key: null
}

export const MOCK_WORKSPACE: Tables<"workspaces"> = {
  id: MOCK_WORKSPACE_ID,
  user_id: MOCK_USER_ID,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  sharing: "private",
  name: "Default Workspace",
  description: "Default workspace for AskCipher",
  instructions: "Be helpful and concise.",
  is_home: true,
  default_context_length: 4096,
  default_model: "gpt-3.5-turbo",
  default_prompt: "You are a helpful AI assistant.",
  default_temperature: 0.5,
  embeddings_provider: "openai",
  include_profile_context: true,
  include_workspace_instructions: true,
  image_path: null
}
