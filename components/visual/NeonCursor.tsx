// VISUAL BEAST 2026: Custom neon cursor dot for desktop
"use client"

import { useEffect, useState } from "react"

export default function NeonCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only on devices with fine pointer (desktop)
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] w-4 h-4 rounded-full"
      style={{
        left: pos.x - 8,
        top: pos.y - 8,
        background: "radial-gradient(circle, #00ff9d 0%, transparent 70%)",
        boxShadow: "0 0 12px rgba(0,255,157,0.6), 0 0 30px rgba(0,255,157,0.2)",
        transition: "left 0.05s linear, top 0.05s linear",
      }}
    />
  )
}
