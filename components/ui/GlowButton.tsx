"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface GlowButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "outline"
  className?: string
  href?: string
}

export const GlowButton = ({ children, onClick, variant = "primary", className = "", href }: GlowButtonProps) => {
  const base = "relative px-8 py-3 rounded-full font-medium transition-all duration-300 overflow-hidden group"
  const variants = {
    primary: "text-white shadow-lg",
    outline: "border border-cyan-400/50 text-cyan-300 bg-transparent hover:bg-cyan-400/10",
  } as const

  const content = (
    <motion.button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={variant === "primary" ? { backgroundImage: "linear-gradient(90deg,#00f2ff 0%, #bf4eff 100%)" } : undefined}
    >
      {variant === "primary" && (
        <motion.div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(90deg,#00f2ff 0%, #bf4eff 100%)", opacity: 0 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0, 0.25, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    )
  }

  return content
}
