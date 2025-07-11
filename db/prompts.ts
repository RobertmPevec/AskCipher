import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import { MOCK_USER_ID, MOCK_WORKSPACE_ID } from "@/lib/mock-data"

export const getPromptById = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }

  return prompt
}

export const getPromptWorkspacesByWorkspaceId = async (workspaceId: string) => {
  // Get all prompts from the database for this workspace
  try {
    // First get the prompt IDs for this workspace
    const { data: promptWorkspaces, error: workspaceError } = await supabase
      .from("prompt_workspaces")
      .select("prompt_id")
      .eq("workspace_id", workspaceId)

    if (workspaceError) {
      console.warn("Error fetching prompt workspaces:", workspaceError)
      return {
        id: workspaceId,
        name: "Mock Workspace",
        prompts: []
      }
    }

    if (!promptWorkspaces || promptWorkspaces.length === 0) {
      return {
        id: workspaceId,
        name: "Mock Workspace",
        prompts: []
      }
    }

    // Then get the actual prompts
    const promptIds = promptWorkspaces.map(pw => pw.prompt_id)
    const { data: prompts, error: promptsError } = await supabase
      .from("prompts")
      .select("*")
      .in("id", promptIds)

    if (promptsError) {
      console.warn("Error fetching prompts:", promptsError)
      return {
        id: workspaceId,
        name: "Mock Workspace",
        prompts: []
      }
    }

    return {
      id: workspaceId,
      name: "Mock Workspace",
      prompts: prompts || []
    }
  } catch (error) {
    console.warn("Error in getPromptWorkspacesByWorkspaceId:", error)
    return {
      id: workspaceId,
      name: "Mock Workspace",
      prompts: []
    }
  }
}

export const getPromptWorkspacesByPromptId = async (promptId: string) => {
  const { data: prompt, error } = await supabase
    .from("prompts")
    .select(
      `
      id, 
      name, 
      workspaces (*)
    `
    )
    .eq("id", promptId)
    .single()

  if (!prompt) {
    throw new Error(error.message)
  }

  return prompt
}

export const createPrompt = async (
  prompt: TablesInsert<"prompts">,
  workspace_id: string
) => {
  // Ensure we use the mock user ID for authentication bypass
  const promptWithMockUser = {
    ...prompt,
    user_id: MOCK_USER_ID
  }

  const { data: createdPrompt, error } = await supabase
    .from("prompts")
    .insert([promptWithMockUser])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspace({
    user_id: MOCK_USER_ID,
    prompt_id: createdPrompt.id,
    workspace_id: MOCK_WORKSPACE_ID
  })

  return createdPrompt
}

export const createPrompts = async (
  prompts: TablesInsert<"prompts">[],
  workspace_id: string
) => {
  // Ensure we use the mock user ID for all prompts
  const promptsWithMockUser = prompts.map(prompt => ({
    ...prompt,
    user_id: MOCK_USER_ID
  }))

  const { data: createdPrompts, error } = await supabase
    .from("prompts")
    .insert(promptsWithMockUser)
    .select("*")

  if (error) {
    throw new Error(error.message)
  }

  await createPromptWorkspaces(
    createdPrompts.map(prompt => ({
      user_id: MOCK_USER_ID,
      prompt_id: prompt.id,
      workspace_id: MOCK_WORKSPACE_ID
    }))
  )

  return createdPrompts
}

export const createPromptWorkspace = async (item: {
  user_id: string
  prompt_id: string
  workspace_id: string
}) => {
  const { data: createdPromptWorkspace, error } = await supabase
    .from("prompt_workspaces")
    .insert([item])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdPromptWorkspace
}

export const createPromptWorkspaces = async (
  items: { user_id: string; prompt_id: string; workspace_id: string }[]
) => {
  const { data: createdPromptWorkspaces, error } = await supabase
    .from("prompt_workspaces")
    .insert(items)
    .select("*")

  if (error) throw new Error(error.message)

  return createdPromptWorkspaces
}

export const updatePrompt = async (
  promptId: string,
  prompt: TablesUpdate<"prompts">
) => {
  const { data: updatedPrompt, error } = await supabase
    .from("prompts")
    .update(prompt)
    .eq("id", promptId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedPrompt
}

export const deletePrompt = async (promptId: string) => {
  const { error } = await supabase.from("prompts").delete().eq("id", promptId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const deletePromptWorkspace = async (
  promptId: string,
  workspaceId: string
) => {
  const { error } = await supabase
    .from("prompt_workspaces")
    .delete()
    .eq("prompt_id", promptId)
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)

  return true
}
