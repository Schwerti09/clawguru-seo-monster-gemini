"use client"
// VISUAL UPGRADE 2026: RunbookCard with 3D tilt effect, pulsing severity badge,
// progress bar for fix readiness, and neon border + inner scan effect on hover.

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import type { SeverityLevel } from "@/lib/design-system"
import { severityConfig } from "@/lib/design-system"

type RunbookCardProps = {
  slug: string
  title: string
  summary: string
  tags: string[]
  severity?: SeverityLevel
  fixReadiness?: number // 0-100
}

export default function RunbookCard({
  slug,
  title,
  summary,
  tags,
  severity = "medium",
  fixReadiness = 70,
}: RunbookCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const sev = severityConfig[severity]

  // VISUAL UPGRADE 2026: 3D tilt effect on hover via mouse position
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -10, y: x * 10 })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.a
      href={`/runbook/${slug}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <div
        ref={cardRef}
        className="relative p-6 rounded-3xl overflow-hidden transition-all duration-300 group"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          background: "rgba(255, 255, 255, 0.03)",
          border: isHovered
            ? `1px solid rgba(0, 255, 157, 0.3)`
            : "1px solid rgba(255, 255, 255, 0.10)",
          boxShadow: isHovered
            ? "0 0 30px rgba(0, 255, 157, 0.1), inset 0 0 30px rgba(0, 255, 157, 0.02)"
            : "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* VISUAL UPGRADE 2026: Inner scan effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 animate-scan-line opacity-30"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(0, 255, 157, 0.08) 50%, transparent 100%)",
                height: "50%",
              }}
            />
          </div>
        )}

        {/* VISUAL UPGRADE 2026: Severity badge with pulsing effect */}
        <div className="flex items-center justify-between mb-3">
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${sev.pulse ? "animate-pulse-neon" : ""}`}
            style={{ background: sev.bg, color: sev.color }}
          >
            {sev.label}
          </div>
        </div>

        <div className="text-lg font-black font-heading">{title}</div>
        <div className="mt-2 text-sm text-gray-400 line-clamp-2">{summary}</div>

        {/* VISUAL UPGRADE 2026: Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-lg text-xs text-gray-300"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* VISUAL UPGRADE 2026: Progress bar for fix readiness */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Fix Readiness</span>
            <span style={{ color: "#00ff9d" }}>{fixReadiness}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${fixReadiness}%`,
                background: "linear-gradient(90deg, #00ff9d, #00b8ff)",
                boxShadow: "0 0 8px rgba(0, 255, 157, 0.4)",
              }}
            />
          </div>
        </div>

        <div className="mt-4 text-sm font-bold" style={{ color: "#00ff9d" }}>
          Runbook öffnen →
        </div>
      </div>
    </motion.a>
  )
}
