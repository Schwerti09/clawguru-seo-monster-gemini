"use client"
// VISUAL UPGRADE 2026: Animated Claw Security Score counter with neon glow effect.
// Counts up from 0 to target score with glowing neon text.

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function SecurityScoreCounter({
  targetScore = 94,
  label = "Claw Security Score",
}: {
  targetScore?: number
  label?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // VISUAL UPGRADE 2026: Animated count-up effect
    const duration = 1500
    const steps = 60
    const increment = targetScore / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= targetScore) {
        setCount(targetScore)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [targetScore])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative flex flex-col items-center justify-center"
    >
      {/* VISUAL UPGRADE 2026: Outer glow ring */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(circle, rgba(0, 255, 157, 0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center border-2"
          style={{
            borderColor: "rgba(0, 255, 157, 0.4)",
            background: "rgba(0, 255, 157, 0.05)",
            boxShadow: "0 0 30px rgba(0, 255, 157, 0.2), inset 0 0 30px rgba(0, 255, 157, 0.05)",
          }}
        >
          {/* VISUAL UPGRADE 2026: Score number with neon glow */}
          <span
            className="text-5xl sm:text-6xl font-black font-heading"
            style={{
              color: "#00ff9d",
              textShadow: "0 0 20px rgba(0, 255, 157, 0.6), 0 0 40px rgba(0, 255, 157, 0.3)",
            }}
          >
            {count}
          </span>
          <span className="text-xs text-gray-400 mt-1">/100</span>
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-400 font-medium">{label}</div>
    </motion.div>
  )
}
