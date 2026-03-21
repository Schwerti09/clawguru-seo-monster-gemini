"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

export function ClawguruAvatar({ className = "", interactive = true }: { className?: string; interactive?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [15, -15]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), { stiffness: 200, damping: 20 })

  function onMove(e: React.MouseEvent) {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseX.set(e.clientX - cx)
    mouseY.set(e.clientY - cy)
  }

  function onLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ rotateX: interactive ? rotateX : 0, rotateY: interactive ? rotateY : 0, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label="ClawGuru Avatar"
      role="img"
    >
      {/* Diamond shell */}
      <path d="M60 100 L100 40 L140 100 L100 160 Z" fill="url(#glassGradient)" stroke="url(#strokeGradient)" strokeWidth="1.5" />

      {/* Left claw */}
      <motion.path
        d="M30 80 L10 60 L30 40 L50 60 Z"
        fill="url(#clawGradient)"
        stroke="#00f2ff"
        strokeWidth="1.2"
        animate={{ rotate: [0, -5, 0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Right claw */}
      <motion.path
        d="M170 80 L190 60 L170 40 L150 60 Z"
        fill="url(#clawGradient)"
        stroke="#bf4eff"
        strokeWidth="1.2"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Visor / eye */}
      <circle cx="100" cy="85" r="8" fill="#00f2ff" filter="url(#glow)" />
      <circle cx="100" cy="85" r="3" fill="white" />

      {/* Particles */}
      <motion.circle cx="120" cy="110" r="3" fill="#bf4eff" animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="80" cy="110" r="2.5" fill="#00f2ff" animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }} />

      <defs>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2ff" />
          <stop offset="100%" stopColor="#bf4eff" />
        </linearGradient>
        <linearGradient id="clawGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#bf4eff" stopOpacity="0.85" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </motion.svg>
  )
}
