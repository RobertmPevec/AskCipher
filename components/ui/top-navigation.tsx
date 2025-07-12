"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  IconChevronDown,
  IconPlus,
  IconMessage,
  IconMoon,
  IconSun,
  IconCheck,
  IconX
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Image from "next/image"
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export const TopNavigation = () => {
  const [feedbackText, setFeedbackText] = useState("")
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const { setTheme, theme } = useTheme()

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true)

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Handle feedback submission here
    console.log("Feedback submitted:", feedbackText)
    setFeedbackText("")
    setIsSubmitting(false)
    setShowSuccessMessage(true)

    // Hide success message after 2 seconds and close modal
    setTimeout(() => {
      setShowSuccessMessage(false)
      setIsFeedbackOpen(false)
    }, 2000)
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
                    <span
                      className="rounded border px-1.5 py-0.5 text-xs font-medium"
                      style={{
                        color: "#eab305",
                        borderColor: "#eab305",
                        backgroundColor: "#713e11"
                      }}
                    >
                      Beta
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
              <IconChevronDown className="size-4" />
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
          <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
            <DialogHeader>
              <DialogTitle>Manage Connections</DialogTitle>
              <p className="text-muted-foreground text-sm">
                Keep track of your business applications connected to Cipher
              </p>
            </DialogHeader>

            <div className="flex-1 space-y-6 overflow-y-auto">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Add Connection</h3>

                <div className="space-y-4">
                  {/* NetSuite */}
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-white">
                      <Image
                        src="/netsuite.svg"
                        alt="NetSuite Logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">NetSuite</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        NetSuite Authentication
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Connect to your NetSuite instance to Cipher
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>

                  {/* Salesforce */}
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-white">
                      <Image
                        src="/salesforce.png"
                        alt="Salesforce Logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Salesforce</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        Salesforce Authentication
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Connect to your Salesforce instance to Cipher
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>

                  {/* Google Workspace */}
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex size-12 items-center justify-center rounded-lg border bg-white">
                      <Image
                        src="/google.png"
                        alt="Google Logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Google Workspace</h4>
                      <p className="text-muted-foreground mb-2 text-sm">
                        Google Workspace Authentication
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Connect to your Google Workspace to Cipher
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Button size="sm">Connect</Button>
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
              <div className="flex items-center justify-between">
                <DialogTitle>Your Opinion Matters!</DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="size-6">
                    <IconX className="size-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>

            {showSuccessMessage ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-2 text-green-600">
                  <svg
                    className="size-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold">
                  Thanks for your feedback!
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  We appreciate your input.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  We would love to hear your thoughts on how we can improve
                  AskCipher.
                </p>

                <div className="space-y-2">
                  <label htmlFor="feedback" className="text-sm font-medium">
                    What would you like us to know?
                  </label>
                  <div className="gradient-border-focus-textarea rounded-md">
                    <Textarea
                      id="feedback"
                      placeholder="Your feedback..."
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      className="min-h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackText.trim() || isSubmitting}
                    className={`${theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="-ml-1 mr-2 size-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          ></circle>
                          <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            className="opacity-75"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Response"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
