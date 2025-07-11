import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"
import { MOCK_WORKSPACE, MOCK_WORKSPACE_ID } from "@/lib/mock-data"

export const getHomeWorkspaceByUserId = async (userId: string) => {
  // Return mock workspace ID
  return MOCK_WORKSPACE_ID
}

export const getWorkspaceById = async (workspaceId: string) => {
  // Return mock workspace
  return MOCK_WORKSPACE
}

export const getWorkspacesByUserId = async (userId: string) => {
  // Return array with mock workspace
  return [MOCK_WORKSPACE]
}

export const createWorkspace = async (
  workspace: TablesInsert<"workspaces">
) => {
  const { data: createdWorkspace, error } = await supabase
    .from("workspaces")
    .insert([workspace])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdWorkspace
}

export const updateWorkspace = async (
  workspaceId: string,
  workspace: TablesUpdate<"workspaces">
) => {
  const { data: updatedWorkspace, error } = await supabase
    .from("workspaces")
    .update(workspace)
    .eq("id", workspaceId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedWorkspace
}

export const deleteWorkspace = async (workspaceId: string) => {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
