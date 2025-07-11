import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { CohereClient } from "cohere-ai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    // Skip profile check for no-auth mode, use environment API key directly
    checkApiKey(process.env.COHERE_API_KEY, "Cohere")

    // Extract preamble from the first message (system message)
    const systemMessage = messages.find(msg => msg.role === "system")
    const preamble = systemMessage?.content || "You are a helpful assistant."

    console.log("Cohere Route - Model:", chatSettings.model)
    console.log(
      "Cohere Route - System Message Content:",
      preamble.substring(0, 100) + "..."
    )

    // Format messages for Cohere (exclude system message)
    const cohereMessages = messages
      .filter(msg => msg.role !== "system")
      .map((message: any) => ({
        role: message.role === "assistant" ? "CHATBOT" : "USER",
        message:
          typeof message.content === "string"
            ? message.content
            : message.content[0]?.text || ""
      }))

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY || ""
    })

    try {
      const response = await cohere.chatStream({
        model: chatSettings.model,
        chatHistory: cohereMessages.slice(0, -1), // All messages except the last one
        message: cohereMessages[cohereMessages.length - 1]?.message || "", // Last message
        temperature: chatSettings.temperature,
        maxTokens:
          CHAT_SETTING_LIMITS[chatSettings.model].MAX_TOKEN_OUTPUT_LENGTH,
        preamble: preamble
      })

      // Create a custom streaming response for Cohere
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chat of response) {
              if (chat.eventType === "text-generation") {
                const chunk = encoder.encode(chat.text)
                controller.enqueue(chunk)
              }
            }
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        }
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked"
        }
      })
    } catch (error: any) {
      console.error("Error calling Cohere API:", error)
      return new NextResponse(
        JSON.stringify({
          message: "An error occurred while calling the Cohere API"
        }),
        { status: 500 }
      )
    }
  } catch (error: any) {
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Cohere API Key not found. Please set it in your environment variables."
    } else if (errorCode === 401) {
      errorMessage =
        "Cohere API Key is incorrect. Please check your environment variables."
    }

    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
