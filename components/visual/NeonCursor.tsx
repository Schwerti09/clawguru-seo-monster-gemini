"use client"
// VISUAL UPGRADE 2026: Custom neon cursor for desktop – follows mouse with claw-green glow.
// Only renders on devices with fine pointer (desktop). Fully non-intrusive.

import { useEffect, useRef } from "react"

export default function NeonCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // VISUAL UPGRADE 2026: Only enable on desktop with fine pointer
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    if (!mq.matches) return

    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    let mouseX = 0
    let mouseY = 0
    let trailX = 0
    let trailY = 0

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (cursor) {
        cursor.style.left = `${mouseX}px`
        cursor.style.top = `${mouseY}px`
      }
    }

    // VISUAL UPGRADE 2026: Smooth trailing cursor with requestAnimationFrame
    function animateTrail() {
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15
      if (trail) {
        trail.style.left = `${trailX}px`
        trail.style.top = `${trailY}px`
      }
      requestAnimationFrame(animateTrail)
    }

    window.addEventListener("mousemove", onMouseMove)
    const raf = requestAnimationFrame(animateTrail)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* VISUAL UPGRADE 2026: Neon cursor dot */}
      <div
        ref={cursorRef}
        className="hidden md:block fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
        style={{
          background: "#00ff9d",
          boxShadow: "0 0 10px rgba(0, 255, 157, 0.6), 0 0 30px rgba(0, 255, 157, 0.3)",
        }}
      />
      {/* VISUAL UPGRADE 2026: Neon cursor trailing glow */}
      <div
        ref={trailRef}
        className="hidden md:block fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
        style={{
          background: "rgba(0, 255, 157, 0.08)",
          border: "1px solid rgba(0, 255, 157, 0.15)",
          boxShadow: "0 0 20px rgba(0, 255, 157, 0.1)",
        }}
      />
    </>
  )
}
