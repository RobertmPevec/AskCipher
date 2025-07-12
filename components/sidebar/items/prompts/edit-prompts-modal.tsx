import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChatbotUIContext } from "@/context/context"
import { deletePrompt, updatePrompt } from "@/db/prompts"
import { Tables } from "@/supabase/types"
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconQuestionMark
} from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { toast } from "sonner"

interface EditPromptsModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const EditPromptsModal: FC<EditPromptsModalProps> = ({
  isOpen,
  onOpenChange
}) => {
  const { prompts, setPrompts } = useContext(ChatbotUIContext)
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleEditPrompt = (prompt: Tables<"prompts">) => {
    setEditingPrompt(prompt.id)
    setEditedName(prompt.name)
    setEditedContent(prompt.content)
  }

  const handleSaveEdit = async (promptId: string) => {
    try {
      const updatedPrompt = await updatePrompt(promptId, {
        name: editedName,
        content: editedContent
      })

      setPrompts(prompts.map(p => (p.id === promptId ? updatedPrompt : p)))

      setEditingPrompt(null)
      toast.success("Prompt updated successfully!")
    } catch (error) {
      toast.error("Error updating prompt: " + error)
    }
  }

  const handleCancelEdit = () => {
    setEditingPrompt(null)
    setEditedName("")
    setEditedContent("")
  }

  const handleDeletePrompt = async (promptId: string) => {
    try {
      await deletePrompt(promptId)
      setPrompts(prompts.filter(p => p.id !== promptId))
      setConfirmDeleteId(null)
      toast.success("Prompt deleted successfully!")
    } catch (error) {
      toast.error("Error deleting prompt: " + error)
    }
  }

  const handleDeleteClick = (promptId: string) => {
    if (confirmDeleteId === promptId) {
      // Second click - actually delete
      handleDeletePrompt(promptId)
    } else {
      // First click - show confirmation
      setConfirmDeleteId(promptId)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Edit Prompts</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="size-6 p-0"
          >
            <IconX size={16} />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {prompts.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center">
              No prompts found. Create a new prompt to get started.
            </div>
          ) : (
            prompts.map(prompt => (
              <div key={prompt.id} className="space-y-3 rounded-lg border p-4">
                {editingPrompt === prompt.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`name-${prompt.id}`}>Name</Label>
                      <Input
                        id={`name-${prompt.id}`}
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                        placeholder="Prompt name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`content-${prompt.id}`}>Content</Label>
                      <Textarea
                        id={`content-${prompt.id}`}
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        placeholder="Prompt content"
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <IconX className="mr-1" size={16} />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(prompt.id)}
                      >
                        <IconCheck className="mr-1" size={16} />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{prompt.name}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPrompt(prompt)}
                        >
                          <IconEdit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(prompt.id)}
                          onMouseLeave={() => {
                            if (confirmDeleteId === prompt.id) {
                              setConfirmDeleteId(null)
                            }
                          }}
                          className={
                            confirmDeleteId === prompt.id
                              ? "text-orange-600 hover:text-orange-700"
                              : "text-red-600 hover:text-red-700"
                          }
                          title={
                            confirmDeleteId === prompt.id
                              ? "Are you sure you want to delete?"
                              : "Delete"
                          }
                        >
                          {confirmDeleteId === prompt.id ? (
                            <IconQuestionMark size={16} />
                          ) : (
                            <IconTrash size={16} />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted rounded p-3">
                      <p className="whitespace-pre-wrap text-sm">
                        {prompt.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
