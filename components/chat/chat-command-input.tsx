import { FC } from "react"
import { AssistantPicker } from "./assistant-picker"
import { PromptPicker } from "./prompt-picker"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  return (
    <>
      <PromptPicker />
      <AssistantPicker />
    </>
  )
}
