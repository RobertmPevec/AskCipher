import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { checkApiKey } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
      throw new Error(
        "OpenAI API key not configured. Please add your API key to .env.local"
      )
    }

    checkApiKey(apiKey, "OpenAI")

    const openai = new OpenAI({
      apiKey: apiKey
    })

    const response = await openai.chat.completions.create({
      model: chatSettings.model,
      messages: messages,
      temperature: chatSettings.temperature,
      max_tokens:
        CHAT_SETTING_LIMITS[chatSettings.model]?.MAX_TOKEN_OUTPUT_LENGTH ||
        4096,
      stream: true
    })

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
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
    console.error("OpenAI API Error:", error)
    return new NextResponse(
      JSON.stringify({
        message:
          error.message || "An error occurred while calling the OpenAI API"
      }),
      { status: 500 }
    )
  }
}
