"use client"

import { FC, useEffect, useState } from "react"
import Image from "next/image"

interface BrandProps {
  theme?: "dark" | "light"
}

const TYPING_STATEMENTS = [
  "generate a Q2 job cost report?",
  "integrate Salesforce with NetSuite?",
  "run a NetSuite health check?",
  "rescue my stalled implementation?",
  "deploy a SuiteScript customization?",
  "set up automated PO approvals?",
  "create a custom invoice template?",
  "book an appointment?",
  "schedule a meeting?",
  "create a new lead?",
  "cancel my event?",
  "show today's calendar?",
  "generate a sales report?"
]

export const Brand: FC<BrandProps> = ({ theme = "dark" }) => {
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentStatement = TYPING_STATEMENTS[currentStatementIndex]
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      // Typing animation
      if (displayText.length < currentStatement.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentStatement.slice(0, displayText.length + 1))
        }, 50) // Typing speed
      } else {
        // Pause before erasing
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, 2000) // Pause duration
      }
    } else {
      // Erasing animation
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30) // Erasing speed
      } else {
        // Move to next statement
        setCurrentStatementIndex(prev => (prev + 1) % TYPING_STATEMENTS.length)
        setIsTyping(true)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isTyping, currentStatementIndex])

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <Image
          src={
            theme === "dark" ? "/DARK_BRAND_LOGO.png" : "/LIGHT_BRAND_LOGO.png"
          }
          alt="AskCipher Logo"
          width={80}
          height={80}
          priority
        />
      </div>

      <div className="mb-2 text-2xl font-bold tracking-wide">
        Welcome back Robert!
      </div>

      <div className="text-muted-foreground text-lg">
        Would you like me to{" "}
        <span className="inline-block min-w-[300px] text-left">
          {displayText}
          <span className="animate-pulse">|</span>
        </span>
      </div>
    </div>
  )
}
