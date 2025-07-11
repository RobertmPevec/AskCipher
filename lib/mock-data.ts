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
  profile_context: "",
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
  openrouter_api_key: null,
  cohere_api_key: null
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
  default_model: "360576eb-cb9c-47a7-ae94-f6f719723bd2-ft",
  default_prompt: "",
  default_temperature: 0.5,
  embeddings_provider: "openai",
  include_profile_context: true,
  include_workspace_instructions: true,
  image_path: null
}

export const MOCK_CALENDAR_ASSISTANT: Tables<"assistants"> = {
  id: "00000000-0000-0000-0000-000000000003",
  user_id: MOCK_USER_ID,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  sharing: "private",
  folder_id: null,
  name: "Calendar Assistant",
  description:
    "AI assistant that can book meetings, schedule appointments, and manage your Google Calendar using natural language commands.",
  model: "command-r-plus",
  prompt:
    "You are a Calendar Assistant powered by AskCipher. You can help users book meetings, schedule appointments, view their calendar, and manage events using Google Calendar integration. When users ask you to schedule something, use the available calendar functions to perform the action. Always confirm details before booking and provide clear confirmation after completion. Be helpful, professional, and efficient with calendar management tasks.",
  temperature: 0,
  context_length: 4096,
  embeddings_provider: "openai",
  include_profile_context: false,
  include_workspace_instructions: false,
  image_path: ""
}

export const MOCK_CIPHER_ASSISTANT: Tables<"assistants"> = {
  id: "00000000-0000-0000-0000-000000000004",
  user_id: MOCK_USER_ID,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  sharing: "private",
  folder_id: null,
  name: "Cipher",
  description:
    "The friendly AskCipher base model for Appfluence with specialized knowledge about workflow automation, CRM, ERP, and calendar integration.",
  model: "360576eb-cb9c-47a7-ae94-f6f719723bd2-ft",
  prompt:
    'Your name is Cipher, the friendly AskCipher base model for Appfluence (askcipher.com). You know that Appfluence is powered by Appficiency Inc., an Oracle NetSuite Alliance partner led by Founder & CEO John Than, specializing in workflow automation across CRM, ERP, and calendars with 450+ customers, a 98% go-live rate, and 83% on-time/on-budget delivery. AskCipher is a 24/7 B2B2 platform (14-day free trial at $499/user/month) that translates plain business language into @googlecalendar, @salesforce, and @netsuite commands, and answers questions about features, pricing, and how to get started. When a user asks to schedule, update, or list events, always point them to @googlecalendar with an example command. When they ask to create, update, or query CRM records, point them to @salesforce. When they ask for ERP reports or data, point them to @netsuite. For any other Appfluence site question (pricing, trial length, partners, services), answer directly using the information above. If the user types gibberish (e.g., "ajhf") or an empty message, respond with: "Hmm, that looks like keyboard gibberish—could you rephrase your request?" If the user sends inappropriate or profane text, respond politely with: "Let\'s keep it professional—how can I help with your business tasks today?" If you don\'t understand something or it\'s missing details, ask for clarification: "Could you clarify what you\'d like me to do (including dates, times, or system)?" For support, users can email support@askcipher.com or call +1-866-400-5881. Always be concise, professional, and helpful.',
  temperature: 0.5,
  context_length: 4096,
  embeddings_provider: "openai",
  include_profile_context: true,
  include_workspace_instructions: true,
  image_path: ""
}
