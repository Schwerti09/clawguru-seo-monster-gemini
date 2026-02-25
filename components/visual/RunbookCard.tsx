// VISUAL BEAST 2026: RunbookCard — 3D tilt, severity glow badge, progress bar, scan hover effect
"use client"

import { useState } from "react"
import { SEVERITY } from "@/lib/design"

type Props = {
  title: string
  summary: string
  slug: string
  tags?: string[]
  severity?: keyof typeof SEVERITY
  readiness?: number // 0-100
}

export default function RunbookCard({
  title,
  summary,
  slug,
  tags = [],
  severity = "medium",
  readiness = 65,
}: Props) {
  const [hovering, setHovering] = useState(false)
  const sev = SEVERITY[severity]

  return (
    <a
      href={`/runbook/${slug}`}
      className={`
        relative block p-6 rounded-2xl tilt-card glass-card overflow-hidden
        transition-all duration-300
        ${hovering ? "border-[#00ff9d]/30" : "border-white/10"}
      `}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* VISUAL BEAST 2026: Inner scan effect on hover */}
      {hovering && (
        <div
          className="absolute inset-0 animate-scanline pointer-events-none z-0"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(0,255,157,0.06), transparent)",
            height: "200%",
          }}
        />
      )}

      <div className="relative z-10">
        {/* VISUAL BEAST 2026: Severity badge with pulsing glow */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-bold ${sev.glow}`}
            style={{
              backgroundColor: `${sev.color}20`,
              color: sev.color,
              border: `1px solid ${sev.color}40`,
            }}
          >
            {sev.label}
          </span>
        </div>

        <div className="text-lg font-black font-headline mb-2">{title}</div>
        <div className="text-sm text-gray-400 mb-4 line-clamp-2">{summary}</div>

        {/* VISUAL BEAST 2026: Claw Fix Readiness progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Claw Fix Readiness</span>
            <span className="text-[#00ff9d] font-bold">{readiness}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] progress-glow transition-all duration-1000"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm text-[#00ff9d] font-bold">
          Runbook öffnen →
        </div>
      </div>
    </a>
  )
}
