import { LLM } from "@/types"

const COHERE_PLATFORM_LINK = "https://docs.cohere.com/docs/getting-started"

// Cohere Models -----------------------------

// Custom Fine-tuned Model
const COHERE_CUSTOM_FT: LLM = {
  modelId: "360576eb-cb9c-47a7-ae94-f6f719723bd2-ft",
  modelName: "Custom Fine-tuned Model",
  provider: "cohere",
  hostedId: "360576eb-cb9c-47a7-ae94-f6f719723bd2-ft",
  platformLink: COHERE_PLATFORM_LINK,
  imageInput: false
}

// Command R
const COMMAND_R: LLM = {
  modelId: "command-r",
  modelName: "Command R",
  provider: "cohere",
  hostedId: "command-r",
  platformLink: COHERE_PLATFORM_LINK,
  imageInput: false
}

// Command R Plus (supports function calling)
const COMMAND_R_PLUS: LLM = {
  modelId: "command-r-plus",
  modelName: "Command R Plus",
  provider: "cohere",
  hostedId: "command-r-plus",
  platformLink: COHERE_PLATFORM_LINK,
  imageInput: false
}

export const COHERE_LLM_LIST: LLM[] = [
  COHERE_CUSTOM_FT,
  COMMAND_R,
  COMMAND_R_PLUS
]
