import { redirect } from "next/navigation"
import { MOCK_WORKSPACE_ID } from "@/lib/mock-data"

export default function HomePage() {
  // Bypass home page and redirect directly to chat
  return redirect(`/${MOCK_WORKSPACE_ID}/chat`)
}
