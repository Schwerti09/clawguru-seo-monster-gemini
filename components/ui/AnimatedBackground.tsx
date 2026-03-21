"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export const AnimatedBackground = () => {
  const vw = useRef(1)
  const vh = useRef(1)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springX = useSpring(rawX, { stiffness: 50, damping: 20 })
  const springY = useSpring(rawY, { stiffness: 50, damping: 20 })

  // Map normalized [0..1] range to pixel offsets; avoids window access during SSR
  const translateX = useTransform(springX, [0, 1], [-20, 20])
  const translateY = useTransform(springY, [0, 1], [-20, 20])

  const blob2X = useTransform(springX, [0, 1], [30, -30])
  const blob2Y = useTransform(springY, [0, 1], [30, -30])

  useEffect(() => {
    const handleResize = () => {
      vw.current = Math.max(1, window.innerWidth)
      vh.current = Math.max(1, window.innerHeight)
    }
    handleResize()
    window.addEventListener("resize", handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(Math.min(1, Math.max(0, e.clientX / vw.current)))
      rawY.set(Math.min(1, Math.max(0, e.clientY / vh.current)))
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [rawX, rawY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,242,255,0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(0,242,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Mesh Gradient */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          x: translateX,
          y: translateY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(closest-side, rgba(34,211,238,0.20), rgba(217,70,239,0.10), rgba(0,0,0,0))",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          x: blob2X,
          y: blob2Y,
          background:
            "radial-gradient(closest-side, rgba(217,70,239,0.20), rgba(34,211,238,0.10), rgba(0,0,0,0))",
        }}
      />
    </div>
  )
}
