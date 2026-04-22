"use client"

import { useState, useEffect } from "react"

interface SocialProofCounterProps {
  variant?: string
}

export default function SocialProofCounter({ variant }: SocialProofCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Generate a unique number per user per day (range: 150-259)
    const today = new Date().toDateString()
    const storageKey = `cg_socialproof_count_${today}`

    let targetCount = 0
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      targetCount = parseInt(stored, 10)
    } else {
      // Generate random number between 150 and 259
      targetCount = Math.floor(Math.random() * (259 - 150 + 1)) + 150
      localStorage.setItem(storageKey, targetCount.toString())
    }

    const duration = 2000
    const steps = 60
    const increment = targetCount / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setCount(targetCount)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-cyan-600 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white"
            >
              {i}
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-100">
            <span className="text-cyan-400">{count.toLocaleString()}</span> Nutzer haben heute gekauft
          </div>
          <div className="text-xs text-gray-400">In den letzten 24 Stunden</div>
        </div>
      </div>
    </div>
  )
}
