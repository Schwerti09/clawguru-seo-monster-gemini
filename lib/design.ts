// VISUAL BEAST 2026: Global Design System Tokens
// Deep Space Black + Neon-Claw Accent palette for premium cyber-security UI

export const COLORS = {
  // Base
  deepSpace: "#0a0a0a",
  ink950: "#05060a",

  // Neon-Claw accents
  neonGreen: "#00ff9d",
  cyberBlue: "#00b8ff",
  subtlePurple: "#8b5cf6",

  // Functional
  critical: "#ef4444",
  warning: "#fb923c",
  success: "#22c55e",
  info: "#00b8ff",
} as const

export const SEVERITY = {
  critical: { color: "#ef4444", glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]", label: "CRITICAL" },
  high: { color: "#fb923c", glow: "shadow-[0_0_20px_rgba(251,146,60,0.4)]", label: "HIGH" },
  medium: { color: "#00b8ff", glow: "shadow-[0_0_20px_rgba(0,184,255,0.4)]", label: "MEDIUM" },
  low: { color: "#00ff9d", glow: "shadow-[0_0_20px_rgba(0,255,157,0.4)]", label: "LOW" },
} as const

export const GLASS = "backdrop-blur-xl bg-white/[0.03] border border-white/10" as const

export const GLOW = {
  neonGreen: "shadow-[0_0_30px_rgba(0,255,157,0.25)]",
  cyberBlue: "shadow-[0_0_30px_rgba(0,184,255,0.25)]",
  purple: "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
} as const
