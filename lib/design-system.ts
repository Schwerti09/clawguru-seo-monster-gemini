// VISUAL UPGRADE 2026: Central design system tokens for ClawGuru cyber-security dashboard aesthetic.
// All color, typography, glassmorphism, and animation tokens live here for consistency.

// VISUAL UPGRADE 2026: Core color palette
export const colors = {
  // Base
  deepSpace: "#0a0a0a",
  surface: "#111111",
  surfaceElevated: "#1a1a1a",

  // Primary accent – neon claw green
  clawGreen: "#00ff9d",
  clawGreenMuted: "rgba(0, 255, 157, 0.15)",
  clawGreenGlow: "0 0 40px rgba(0, 255, 157, 0.25)",

  // Secondary accent – cyber blue
  cyberBlue: "#00b8ff",
  cyberBlueMuted: "rgba(0, 184, 255, 0.15)",
  cyberBlueGlow: "0 0 40px rgba(0, 184, 255, 0.25)",

  // Severity colors
  critical: "#ff3b5c",
  high: "#ff8c42",
  medium: "#ffcc00",
  low: "#00ff9d",
  info: "#00b8ff",

  // Glass borders
  glassBorder: "rgba(255, 255, 255, 0.10)",
  glassBorderHover: "rgba(255, 255, 255, 0.20)",

  // Text
  textPrimary: "#f0f0f0",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
} as const

// VISUAL UPGRADE 2026: Typography configuration
export const typography = {
  heading: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const

// VISUAL UPGRADE 2026: Glassmorphism utility classes (used as Tailwind @apply references)
export const glass = {
  card: "backdrop-blur-xl bg-white/[0.03] border border-white/10",
  cardHover: "hover:bg-white/[0.06] hover:border-white/20",
  panel: "backdrop-blur-2xl bg-white/[0.05] border border-white/10",
} as const

// VISUAL UPGRADE 2026: Animation timing presets
export const motion = {
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  springBouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
  fadeUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
  stagger: { staggerChildren: 0.08 },
  scaleIn: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4 } },
} as const

// VISUAL UPGRADE 2026: Severity level configuration for RunbookCard
export const severityConfig = {
  critical: { label: "CRITICAL", color: "#ff3b5c", bg: "rgba(255, 59, 92, 0.15)", pulse: true },
  high: { label: "HIGH", color: "#ff8c42", bg: "rgba(255, 140, 66, 0.15)", pulse: true },
  medium: { label: "MEDIUM", color: "#ffcc00", bg: "rgba(255, 204, 0, 0.15)", pulse: false },
  low: { label: "LOW", color: "#00ff9d", bg: "rgba(0, 255, 157, 0.15)", pulse: false },
  info: { label: "INFO", color: "#00b8ff", bg: "rgba(0, 184, 255, 0.15)", pulse: false },
} as const

export type SeverityLevel = keyof typeof severityConfig
