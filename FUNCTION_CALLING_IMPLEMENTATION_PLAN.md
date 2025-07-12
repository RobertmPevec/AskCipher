# Function Calling Implementation Plan for AskCipher

## Overview
This document outlines the implementation plan for adding Google Calendar and Gmail function calling capabilities to AskCipher using OpenAI's function calling feature.

## Current Status
✅ **Phase 1 Complete**: Assistant models updated
- Google Calendar assistant now uses `gpt-4-turbo-preview` (OpenAI)
- Gmail assistant created with `gpt-4-turbo-preview`
- Base AskCipher assistant remains on Cohere fine-tuned model

## Next Steps

### Phase 2: Environment Setup

1. **Add OpenAI API Key**
   - Update `.env.local` with your OpenAI API key
   - Replace `YOUR_OPENAI_API_KEY_HERE` with actual key

2. **Google Cloud Setup**
   ```bash
   # Required Google APIs to enable:
   - Google Calendar API
   - Gmail API
   - Google OAuth 2.0
   ```

3. **OAuth Credentials**
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3001/api/auth/google/callback
   ```

### Phase 3: Create Function Definitions

Create `/lib/functions/calendar-functions.ts`:
```typescript
export const calendarFunctions = [
  {
    name: "list_calendar_events",
    description: "List events from Google Calendar",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date in ISO format (YYYY-MM-DD)"
        },
        endDate: {
          type: "string", 
          description: "End date in ISO format (YYYY-MM-DD)"
        },
        maxResults: {
          type: "number",
          description: "Maximum number of events to return",
          default: 10
        }
      },
      required: ["startDate", "endDate"]
    }
  },
  {
    name: "create_calendar_event",
    description: "Create a new event in Google Calendar",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Event title"
        },
        startDateTime: {
          type: "string",
          description: "Start date and time in ISO format"
        },
        endDateTime: {
          type: "string",
          description: "End date and time in ISO format"
        },
        description: {
          type: "string",
          description: "Event description"
        },
        attendees: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Email addresses of attendees"
        }
      },
      required: ["title", "startDateTime", "endDateTime"]
    }
  }
]
```

Create `/lib/functions/gmail-functions.ts`:
```typescript
export const gmailFunctions = [
  {
    name: "send_email",
    description: "Send an email via Gmail",
    parameters: {
      type: "object",
      properties: {
        to: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Recipient email addresses"
        },
        subject: {
          type: "string",
          description: "Email subject"
        },
        body: {
          type: "string",
          description: "Email body content"
        },
        cc: {
          type: "array",
          items: {
            type: "string"
          },
          description: "CC email addresses"
        }
      },
      required: ["to", "subject", "body"]
    }
  },
  {
    name: "search_emails",
    description: "Search emails in Gmail",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Gmail search query"
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results",
          default: 10
        }
      },
      required: ["query"]
    }
  }
]
```

### Phase 4: Create OpenAI Chat Route

Create `/app/api/chat/openai/route.ts`:
```typescript
import { checkApiKey } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { OpenAI } from "openai"
import { NextRequest, NextResponse } from "next/server"
import { calendarFunctions } from "@/lib/functions/calendar-functions"
import { gmailFunctions } from "@/lib/functions/gmail-functions"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const { chatSettings, messages, selectedAssistant } = json as {
    chatSettings: ChatSettings
    messages: any[]
    selectedAssistant?: any
  }

  try {
    checkApiKey(process.env.OPENAI_API_KEY, "OpenAI")
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Determine which functions to include based on assistant
    let tools: any[] = []
    if (selectedAssistant?.name === "Google Calendar") {
      tools = calendarFunctions.map(f => ({ type: "function", function: f }))
    } else if (selectedAssistant?.name === "Gmail") {
      tools = gmailFunctions.map(f => ({ type: "function", function: f }))
    }

    const response = await openai.chat.completions.create({
      model: chatSettings.model,
      messages: messages,
      temperature: chatSettings.temperature,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? "auto" : undefined,
      stream: true
    })

    // Create streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || ""
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
          
          // Handle function calls
          const toolCalls = chunk.choices[0]?.delta?.tool_calls
          if (toolCalls) {
            // Stream function call information
            const functionData = JSON.stringify({ type: "function_call", data: toolCalls })
            controller.enqueue(encoder.encode(`\n[FUNCTION:${functionData}]\n`))
          }
        }
        controller.close()
      }
    })

    return new Response(stream)
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    )
  }
}
```

### Phase 5: Google OAuth Implementation

Create `/app/api/auth/google/route.ts`:
```typescript
export async function GET(request: Request) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send` +
    `&access_type=offline` +
    `&prompt=consent`
    
  return NextResponse.redirect(authUrl)
}
```

Create `/app/api/auth/google/callback/route.ts`:
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code!,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })
  
  const tokens = await tokenResponse.json()
  
  // Store tokens securely (implement your storage logic)
  // For now, redirect back to chat
  return NextResponse.redirect('/chat')
}
```

### Phase 6: Function Execution Handlers

Create `/app/api/functions/calendar/route.ts`:
```typescript
import { google } from 'googleapis'

export async function POST(request: Request) {
  const { functionName, parameters } = await request.json()
  
  // Get user's access token (implement your token retrieval)
  const accessToken = await getUserAccessToken()
  
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })
  
  const calendar = google.calendar({ version: 'v3', auth })
  
  switch (functionName) {
    case 'list_calendar_events':
      const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: parameters.startDate,
        timeMax: parameters.endDate,
        maxResults: parameters.maxResults || 10,
        singleEvents: true,
        orderBy: 'startTime',
      })
      return NextResponse.json(events.data)
      
    case 'create_calendar_event':
      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: parameters.title,
          description: parameters.description,
          start: {
            dateTime: parameters.startDateTime,
            timeZone: 'America/Los_Angeles',
          },
          end: {
            dateTime: parameters.endDateTime,
            timeZone: 'America/Los_Angeles',
          },
          attendees: parameters.attendees?.map(email => ({ email })),
        },
      })
      return NextResponse.json(event.data)
      
    default:
      return NextResponse.json({ error: 'Unknown function' }, { status: 400 })
  }
}
```

### Phase 7: Update Chat Handler

Modify `/components/chat/chat-helpers/index.ts` to handle function calls:

```typescript
// Add function to handle OpenAI streaming with function calls
export const handleOpenAIStream = async (
  response: Response,
  onText: (text: string) => void,
  onFunctionCall: (call: any) => void
) => {
  const reader = response.body?.getReader()
  if (!reader) return

  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    
    // Check for function call markers
    const functionMatch = buffer.match(/\[FUNCTION:(.*?)\]/)
    if (functionMatch) {
      const functionData = JSON.parse(functionMatch[1])
      onFunctionCall(functionData)
      buffer = buffer.replace(functionMatch[0], "")
    }
    
    // Process regular text
    onText(buffer)
    buffer = ""
  }
}
```

### Phase 8: UI Components

Create `/components/google-auth-button.tsx`:
```typescript
export function GoogleAuthButton() {
  const [isConnected, setIsConnected] = useState(false)
  
  return (
    <Button
      onClick={() => window.location.href = '/api/auth/google'}
      variant={isConnected ? "outline" : "default"}
    >
      {isConnected ? "Google Account Connected" : "Connect Google Account"}
    </Button>
  )
}
```

## Testing Plan

1. **Test OpenAI Integration**
   - Verify API key works
   - Test basic chat without functions
   - Test function calling with mock functions

2. **Test Google OAuth**
   - Complete OAuth flow
   - Store and retrieve tokens
   - Handle token refresh

3. **Test Calendar Functions**
   - List events
   - Create simple event
   - Create event with attendees

4. **Test Gmail Functions**
   - Search emails
   - Send test email
   - Handle errors gracefully

## Security Considerations

1. **API Keys**
   - Never expose API keys in client code
   - Use server-side routes only
   - Implement rate limiting

2. **OAuth Tokens**
   - Encrypt tokens before storage
   - Implement token refresh
   - Allow users to revoke access

3. **Function Validation**
   - Validate all function parameters
   - Sanitize user inputs
   - Implement permission checks

## Next Steps

1. Replace `YOUR_OPENAI_API_KEY_HERE` in `.env.local`
2. Set up Google Cloud project and OAuth
3. Install required dependencies:
   ```bash
   npm install openai googleapis
   ```
4. Implement the routes and handlers
5. Test with the Google Calendar assistant

## Notes

- The OpenAI models support function calling natively
- Cohere models don't support function calling
- Keep sensitive operations server-side
- Consider adding user confirmation for sensitive actions