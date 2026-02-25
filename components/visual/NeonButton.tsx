// VISUAL BEAST 2026: NeonButton — Reusable CTA with scan animation + magnetic hover
"use client"

import { useRef, useState } from "react"

type Props = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: "green" | "blue" | "purple"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

const VARIANTS = {
  green: {
    bg: "from-[#00ff9d] to-[#00cc7e]",
    glow: "shadow-[0_0_30px_rgba(0,255,157,0.3)]",
    text: "text-black",
    scanColor: "rgba(0,255,157,0.3)",
  },
  blue: {
    bg: "from-[#00b8ff] to-[#0090cc]",
    glow: "shadow-[0_0_30px_rgba(0,184,255,0.3)]",
    text: "text-black",
    scanColor: "rgba(0,184,255,0.3)",
  },
  purple: {
    bg: "from-[#8b5cf6] to-[#6d28d9]",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.3)]",
    text: "text-white",
    scanColor: "rgba(139,92,246,0.3)",
  },
}

const SIZES = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-base rounded-2xl",
  lg: "px-8 py-4 text-lg rounded-2xl",
}

export default function NeonButton({
  children,
  href,
  onClick,
  variant = "green",
  size = "md",
  disabled,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const [hovering, setHovering] = useState(false)
  const v = VARIANTS[variant]

  const baseClass = `
    relative overflow-hidden inline-flex items-center justify-center gap-2
    font-black bg-gradient-to-r ${v.bg} ${v.text}
    ${hovering ? v.glow : ""}
    ${SIZES[size]}
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:scale-[1.02] active:scale-[0.98]
    ${className}
  `.trim()

  const inner = (
    <>
      {/* VISUAL BEAST 2026: scan animation on hover */}
      {hovering && (
        <span
          className="absolute inset-0 animate-scanline pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent, ${v.scanColor}, transparent)`,
            height: "200%",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClass}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {inner}
    </button>
  )
}
