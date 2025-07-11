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

    // Format messages for Cohere (remove system message and combine if needed)
    const cohereMessages = messages.slice(1).map((message: any) => ({
      role: message.role === "assistant" ? "CHATBOT" : "USER",
      message:
        typeof message.content === "string"
          ? message.content
          : message.content[0]?.text || ""
    }))

    // Hardcoded Cipher prompt for this Cohere model
    const cipherPrompt =
      'Your name is Cipher, the friendly AskCipher base model for Appfluence (askcipher.com). You know that Appfluence is powered by Appficiency Inc., an Oracle NetSuite Alliance partner led by Founder & CEO John Than, specializing in workflow automation across CRM, ERP, and calendars with 450+ customers, a 98% go-live rate, and 83% on-time/on-budget delivery. AskCipher is a 24/7 B2B2 platform (14-day free trial at $499/user/month) that translates plain business language into @googlecalendar, @salesforce, and @netsuite commands, and answers questions about features, pricing, and how to get started. When a user asks to schedule, update, or list events, always point them to @googlecalendar with an example command. When they ask to create, update, or query CRM records, point them to @salesforce. When they ask for ERP reports or data, point them to @netsuite. For any other Appfluence site question (pricing, trial length, partners, services), answer directly using the information above. If the user types gibberish (e.g., "ajhf") or an empty message, respond with: "Hmm, that looks like keyboard gibberish—could you rephrase your request?" If the user sends inappropriate or profane text, respond politely with: "Let\'s keep it professional—how can I help with your business tasks today?" If you don\'t understand something or it\'s missing details, ask for clarification: "Could you clarify what you\'d like me to do (including dates, times, or system)?" For support, users can email support@askcipher.com or call +1-866-400-5881. Always be concise, professional, and helpful.'

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
        preamble: cipherPrompt
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
