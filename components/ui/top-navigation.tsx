"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  IconChevronDown,
  IconPlus,
  IconMessage,
  IconMoon,
  IconSun,
  IconCheck
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export const TopNavigation = () => {
  const [feedbackText, setFeedbackText] = useState("")
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false)
  const { setTheme, theme } = useTheme()

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleFeedbackSubmit = () => {
    // Handle feedback submission here
    console.log("Feedback submitted:", feedbackText)
    setFeedbackText("")
    setIsFeedbackOpen(false)
  }

  return (
    <div className="flex h-12 items-center justify-between px-4">
      {/* Left side - Model dropdown and Add Connections */}
      <div className="flex items-center gap-2">
        {/* Model Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground order-1 hidden h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:order-1 md:flex md:h-[34px] md:px-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              AskCipher v0.3
              <IconChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span>AskCipher v0.3</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                      beta
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Feature rich, general purpose model
                  </div>
                </div>
                <IconCheck className="size-4" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Add Connections Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground order-1 hidden h-10 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:order-1 md:flex md:h-[34px] md:px-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              Add Connections
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem onClick={() => setIsConnectionsModalOpen(true)}>
              <div className="flex w-full items-center gap-3">
                <div className="border-input bg-background flex size-8 items-center justify-center rounded border">
                  <IconPlus className="size-4" />
                </div>
                <div>
                  <div>Add Connection</div>
                  <div className="text-muted-foreground text-xs">
                    Connect to a new business application
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manage Connections Modal */}
        <Dialog
          open={isConnectionsModalOpen}
          onOpenChange={setIsConnectionsModalOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manage Connections</DialogTitle>
              <p className="text-muted-foreground text-sm">
                Keep track of your business applications connected to Cipher
              </p>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Add Connection</h3>

                <div className="space-y-4">
                  {/* NetSuite */}
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-blue-50">
                      <span className="text-lg font-bold text-blue-600">N</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">NetSuite</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        NetSuite Authentication
                      </p>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Connect to your NetSuite instance to Cipher
                      </p>
                      <p className="rounded bg-orange-50 p-2 text-xs text-orange-600">
                        Your organization must enable this connection. Please
                        request your admin to enable it.
                      </p>
                    </div>
                  </div>

                  {/* Salesforce */}
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-blue-50">
                      <span className="text-lg font-bold text-blue-600">S</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Salesforce</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        Salesforce Authentication
                      </p>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Connect to your Salesforce instance to Cipher
                      </p>
                      <p className="rounded bg-orange-50 p-2 text-xs text-orange-600">
                        Your organization must enable this connection. Please
                        request your admin to enable it.
                      </p>
                    </div>
                  </div>

                  {/* Google Workspace */}
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-red-50">
                      <span className="text-lg font-bold text-red-600">G</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Google Workspace</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        Google Workspace Authentication
                      </p>
                      <p className="text-muted-foreground mb-3 text-sm">
                        Connect to your Google Workspace to Cipher
                      </p>
                      <p className="rounded bg-orange-50 p-2 text-xs text-orange-600">
                        Your organization must enable this connection. Please
                        request your admin to enable it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Right side - Theme toggle and Feedback */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleThemeChange}
          className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground order-10 inline-flex aspect-square h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border p-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:order-10 md:h-fit md:px-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {theme === "dark" ? (
            <IconMoon className="size-5" />
          ) : (
            <IconSun className="size-5" />
          )}
        </Button>

        {/* Feedback Button */}
        <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground order-10 inline-flex aspect-square h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border p-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:order-10 md:h-fit md:px-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              <IconMessage className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Opinion Matters!</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                We would love to hear your thoughts on how we can improve
                AskCipher.
              </p>

              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">
                  What would you like us to know?
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Your feedback..."
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                >
                  Send Response
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
