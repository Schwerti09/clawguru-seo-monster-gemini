"use client"

import { useState, useEffect } from "react"
import { Flame, Trophy, TrendingUp, Users } from "lucide-react"

interface Notification {
  id: string
  type: "roast" | "fix" | "score_jump" | "hall_of_fame"
  user: string
  action: string
  value?: string
  time: string
}

const mockNotifications: Notification[] = [
  { id: "1", type: "roast", user: "StartupDev_42", action: "got roasted", value: "Score: 34 → 67", time: "just now" },
  { id: "2", type: "fix", user: "SecurityLead", action: "fixed critical vuln", value: "API Key rotated", time: "2m ago" },
  { id: "3", type: "score_jump", user: "DevOps_Team", action: "jumped +42 points", value: "Now: 89 (Elite!)", time: "5m ago" },
  { id: "4", type: "hall_of_fame", user: "CTO_StartupX", action: "entered Hall of Fame", value: "Score: 94", time: "8m ago" },
  { id: "5", type: "roast", user: "FullStack_Mike", action: "started roast", value: "Node.js stack", time: "12m ago" },
  { id: "6", type: "fix", user: "Backend_Sarah", action: "applied 5 fixes", value: "+31 points", time: "15m ago" },
]

export function SocialProofNotifications() {
  const [current, setCurrent] = useState<Notification>(mockNotifications[0])
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      setVisible(true)
    }, 3000)

    // Rotate every 8 seconds
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % mockNotifications.length)
        setCurrent(mockNotifications[(index + 1) % mockNotifications.length])
        setVisible(true)
      }, 500)
    }, 8000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [index])

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "roast": return <Flame className="w-4 h-4 text-red-400" />
      case "fix": return <TrendingUp className="w-4 h-4 text-green-400" />
      case "score_jump": return <Trophy className="w-4 h-4 text-amber-400" />
      case "hall_of_fame": return <Users className="w-4 h-4 text-cyan-400" />
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "roast": return "bg-red-900/40 border-red-700/50"
      case "fix": return "bg-green-900/40 border-green-700/50"
      case "score_jump": return "bg-amber-900/40 border-amber-700/50"
      case "hall_of_fame": return "bg-cyan-900/40 border-cyan-700/50"
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${getBgColor(current.type)}`}>
        {getIcon(current.type)}
        <div className="text-sm">
          <span className="font-semibold text-white">{current.user}</span>
          <span className="text-zinc-300"> {current.action}</span>
          {current.value && (
            <span className="text-cyan-400 ml-1">{current.value}</span>
          )}
          <span className="text-zinc-500 ml-2">• {current.time}</span>
        </div>
      </div>
    </div>
  )
}
