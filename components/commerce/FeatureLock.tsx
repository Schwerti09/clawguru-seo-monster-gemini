"use client"

/**
 * FeatureLock – wraps a gated feature with an upgrade prompt.
 *
 * Usage:
 *   <FeatureLock requiredTier="pro" currentTier="daypass" featureLabel="Private Nodes">
 *     <TheActualComponent />
 *   </FeatureLock>
 *
 * When the current tier is insufficient, a lock overlay is rendered instead
 * of the children.
 */

import type { TierName } from "@/lib/feature-gating"

const UPGRADE_LABELS: Record<TierName, string> = {
  free: "Upgrade to Day Pass",
  daypass: "Upgrade to Pro",
  pro: "Upgrade to Enterprise",
  enterprise: "",
}

const UPGRADE_HREF: Record<TierName, string> = {
  free: "/pricing",
  daypass: "/pricing#pro",
  pro: "/pricing#enterprise",
  enterprise: "",
}

const ACCENT: Record<TierName, { border: string; bg: string; text: string; btn: string }> = {
  free: {
    border: "rgba(0,184,255,0.3)",
    bg: "rgba(0,184,255,0.05)",
    text: "#00b8ff",
    btn: "linear-gradient(135deg,#00b8ff 0%,#0077ff 100%)",
  },
  daypass: {
    border: "rgba(139,92,246,0.4)",
    bg: "rgba(139,92,246,0.07)",
    text: "#a78bfa",
    btn: "linear-gradient(135deg,#a78bfa 0%,#00ff9d 100%)",
  },
  pro: {
    border: "rgba(255,165,0,0.35)",
    bg: "rgba(255,165,0,0.05)",
    text: "#ffaa00",
    btn: "linear-gradient(135deg,#ffaa00 0%,#ff5000 100%)",
  },
  enterprise: {
    border: "rgba(255,255,255,0.1)",
    bg: "rgba(255,255,255,0.02)",
    text: "#fff",
    btn: "#444",
  },
}

interface FeatureLockProps {
  requiredTier: TierName
  currentTier: TierName
  featureLabel: string
  children?: React.ReactNode
  /** If true, render a compact inline lock instead of a full overlay. */
  inline?: boolean
}

export default function FeatureLock({
  requiredTier,
  currentTier,
  featureLabel,
  children,
  inline = false,
}: FeatureLockProps) {
  // Tier rank map (mirrors lib/feature-gating)
  const rank: Record<TierName, number> = { free: 0, daypass: 1, pro: 2, enterprise: 3 }
  const isLocked = rank[currentTier] < rank[requiredTier]

  if (!isLocked) return <>{children}</>

  const accent = ACCENT[currentTier]
  const label = UPGRADE_LABELS[currentTier]
  const href = UPGRADE_HREF[currentTier]

  if (inline) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
          style={{ borderColor: accent.border, color: accent.text, background: accent.bg }}>
          🔒 {requiredTier === "enterprise" ? "Enterprise" : requiredTier === "pro" ? "Pro" : "Day Pass"}
        </span>
        <a href={href} className="text-xs font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: accent.text }}>
          {label} →
        </a>
      </span>
    )
  }

  return (
    <div className="relative rounded-2xl border overflow-hidden"
      style={{ borderColor: accent.border, background: accent.bg }}>
      {/* Blurred children preview */}
      {children && (
        <div className="pointer-events-none select-none opacity-20 blur-sm" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="text-3xl" aria-hidden="true">🔒</span>
        <div>
          <div className="text-sm font-black text-white">{featureLabel}</div>
          <div className="text-xs mt-1" style={{ color: accent.text }}>
            Verfügbar ab{" "}
            <span className="font-black capitalize">
              {requiredTier === "enterprise" ? "Enterprise" : requiredTier === "pro" ? "Pro" : "Day Pass"}
            </span>
          </div>
        </div>
        <a href={href}
          className="mt-1 px-5 py-2 rounded-xl font-black text-sm text-black transition-opacity hover:opacity-90"
          style={{ background: accent.btn }}>
          {label} →
        </a>
      </div>
    </div>
  )
}
