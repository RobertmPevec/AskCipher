import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import {
  IconInfoCircle,
  IconMessagePlus,
  IconEdit,
  IconPencil
} from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { WithTooltip } from "../ui/with-tooltip"
import { CreatePrompt } from "../sidebar/items/prompts/create-prompt"
import { EditPromptsModal } from "../sidebar/items/prompts/edit-prompts-modal"

interface ChatSecondaryButtonsProps {}

export const ChatSecondaryButtons: FC<ChatSecondaryButtonsProps> = ({}) => {
  const { selectedChat } = useContext(ChatbotUIContext)
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  const [isEditingPrompts, setIsEditingPrompts] = useState(false)

  const { handleNewChat } = useChatHandler()

  return (
    <>
      {selectedChat && (
        <>
          <WithTooltip
            delayDuration={200}
            display={
              <div>
                <div className="text-xl font-bold">Chat Info</div>

                <div className="mx-auto mt-2 max-w-xs space-y-2 sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <div>Model: {selectedChat.model}</div>
                  <div>Prompt: {selectedChat.prompt}</div>

                  <div>Temperature: {selectedChat.temperature}</div>
                  <div>Context Length: {selectedChat.context_length}</div>

                  <div>
                    Profile Context:{" "}
                    {selectedChat.include_profile_context
                      ? "Enabled"
                      : "Disabled"}
                  </div>
                  <div>
                    {" "}
                    Workspace Instructions:{" "}
                    {selectedChat.include_workspace_instructions
                      ? "Enabled"
                      : "Disabled"}
                  </div>

                  <div>
                    Embeddings Provider: {selectedChat.embeddings_provider}
                  </div>
                </div>
              </div>
            }
            trigger={
              <div className="mt-1">
                <IconInfoCircle
                  className="cursor-default hover:opacity-50"
                  size={24}
                />
              </div>
            }
          />

          <WithTooltip
            delayDuration={200}
            display={<div>Start a new chat</div>}
            trigger={
              <div className="mt-1">
                <IconMessagePlus
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={handleNewChat}
                />
              </div>
            }
          />

          <WithTooltip
            delayDuration={200}
            display={<div>Create a new prompt</div>}
            trigger={
              <div className="mt-1">
                <IconPencil
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={() => setIsCreatingPrompt(true)}
                />
              </div>
            }
          />

          <WithTooltip
            delayDuration={200}
            display={<div>Edit prompts</div>}
            trigger={
              <div className="mt-1">
                <IconEdit
                  className="cursor-pointer hover:opacity-50"
                  size={24}
                  onClick={() => setIsEditingPrompts(true)}
                />
              </div>
            }
          />
        </>
      )}

      {isCreatingPrompt && (
        <CreatePrompt
          isOpen={isCreatingPrompt}
          onOpenChange={setIsCreatingPrompt}
        />
      )}

      {isEditingPrompts && (
        <EditPromptsModal
          isOpen={isEditingPrompts}
          onOpenChange={setIsEditingPrompts}
        />
      )}
    </>
  )
}
