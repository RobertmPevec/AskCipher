import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { createFolder } from "@/db/folders"
import { ContentType } from "@/types"
import {
  IconFolderPlus,
  IconPlus,
  IconEdit,
  IconPencil
} from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { Button } from "../ui/button"
import { CreateAssistant } from "./items/assistants/create-assistant"
import { CreateCollection } from "./items/collections/create-collection"
import { CreateFile } from "./items/files/create-file"
import { CreateModel } from "./items/models/create-model"
import { CreatePreset } from "./items/presets/create-preset"
import { CreatePrompt } from "./items/prompts/create-prompt"
import { CreateTool } from "./items/tools/create-tool"
import { EditPromptsModal } from "./items/prompts/edit-prompts-modal"

interface SidebarCreateButtonsProps {
  contentType: ContentType
  hasData: boolean
}

export const SidebarCreateButtons: FC<SidebarCreateButtonsProps> = ({
  contentType,
  hasData
}) => {
  const { profile, selectedWorkspace, folders, setFolders } =
    useContext(ChatbotUIContext)
  const { handleNewChat } = useChatHandler()

  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  const [isCreatingPreset, setIsCreatingPreset] = useState(false)
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [isCreatingAssistant, setIsCreatingAssistant] = useState(false)
  const [isCreatingTool, setIsCreatingTool] = useState(false)
  const [isCreatingModel, setIsCreatingModel] = useState(false)
  const [isEditingPrompts, setIsEditingPrompts] = useState(false)

  const handleCreateFolder = async () => {
    if (!profile) return
    if (!selectedWorkspace) return

    const createdFolder = await createFolder({
      user_id: profile.user_id,
      workspace_id: selectedWorkspace.id,
      name: "New Folder",
      description: "",
      type: contentType
    })
    setFolders([...folders, createdFolder])
  }

  const getCreateFunction = () => {
    switch (contentType) {
      case "chats":
        return async () => {
          handleNewChat()
        }

      case "presets":
        return async () => {
          setIsCreatingPreset(true)
        }

      case "prompts":
        return async () => {
          setIsCreatingPrompt(true)
        }

      case "files":
        return async () => {
          setIsCreatingFile(true)
        }

      case "collections":
        return async () => {
          setIsCreatingCollection(true)
        }

      case "assistants":
        return async () => {
          setIsCreatingAssistant(true)
        }

      case "tools":
        return async () => {
          setIsCreatingTool(true)
        }

      case "models":
        return async () => {
          setIsCreatingModel(true)
        }

      default:
        break
    }
  }

  return (
    <div className="space-y-2">
      {/* Main create button and folder/edit button row */}
      <div className="flex w-full gap-2">
        <Button className="flex h-[36px] flex-1" onClick={getCreateFunction()}>
          <IconPlus className="mr-1" size={20} />
          New{" "}
          {contentType.charAt(0).toUpperCase() +
            contentType.slice(1, contentType.length - 1)}
        </Button>

        {hasData && (
          <Button
            className="size-[36px] shrink-0 p-1"
            onClick={
              contentType === "prompts"
                ? () => setIsEditingPrompts(true)
                : handleCreateFolder
            }
          >
            {contentType === "prompts" ? (
              <IconEdit size={20} />
            ) : (
              <IconFolderPlus size={20} />
            )}
          </Button>
        )}
      </div>

      {/* Prompt buttons - only show on chats page */}
      {contentType === "chats" && (
        <div className="flex w-full gap-2">
          <Button
            className="flex h-[36px] flex-1"
            onClick={() => setIsCreatingPrompt(true)}
            variant="outline"
          >
            <IconPencil className="mr-1" size={20} />
            New Prompt
          </Button>

          <Button
            className="size-[36px] shrink-0 p-1"
            onClick={() => setIsEditingPrompts(true)}
            variant="outline"
          >
            <IconEdit size={20} />
          </Button>
        </div>
      )}

      {/* All modals */}
      {isCreatingPrompt && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={setIsCreatingPrompt}
        />
      )}

      {isCreatingPreset && (
        <CreatePreset
          isOpen={isCreatingPreset}
          onOpenChange={setIsCreatingPreset}
        />
      )}

      {isCreatingFile && (
        <CreateFile isOpen={isCreatingFile} onOpenChange={setIsCreatingFile} />
      )}

      {isCreatingCollection && (
        <CreateCollection
          isOpen={isCreatingCollection}
          onOpenChange={setIsCreatingCollection}
        />
      )}

      {isCreatingAssistant && (
        <CreateAssistant
          isOpen={isCreatingAssistant}
          onOpenChange={setIsCreatingAssistant}
        />
      )}

      {isCreatingTool && (
        <CreateTool isOpen={isCreatingTool} onOpenChange={setIsCreatingTool} />
      )}

      {isCreatingModel && (
        <CreateModel
          isOpen={isCreatingModel}
          onOpenChange={setIsCreatingModel}
        />
      )}

      {isEditingPrompts && (
        <EditPromptsModal
          isOpen={isEditingPrompts}
          onOpenChange={setIsEditingPrompts}
        />
      )}
    </div>
  )
}
