"use client"

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
    <button
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className} hover:scale-105 active:scale-[0.98]`}
      style={variant === "primary" ? { backgroundImage: "linear-gradient(90deg,#00f2ff 0%, #bf4eff 100%)" } : undefined}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 animate-glow-pulse" aria-hidden />
      )}
      <span className="relative z-10">{children}</span>
    </button>
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
