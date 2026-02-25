"use client"
// Client component: handles search filtering of runbooks entirely client-side.
// This allows the parent page to be statically generated (no searchParams dependency).

import { useState, useMemo } from "react"
import RunbookCard from "@/components/shared/RunbookCard"
import type { SeverityLevel } from "@/lib/design-system"

export type RunbookSummary = {
  slug: string
  title: string
  summary: string
  tags: string[]
  severity: SeverityLevel
  fixReadiness: number
}

type Props = {
  items: RunbookSummary[]
}

export default function RunbooksSearch({ items }: Props) {
  const [q, setQ] = useState("")
  const trimmed = q.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!trimmed) return items
    return items.filter((r) => {
      const hay = `${r.title} ${r.summary} ${r.tags.join(" ")}`.toLowerCase()
      return hay.includes(trimmed)
    })
  }, [items, trimmed])

  return (
    <>
      {/* Glassmorphism search */}
      <div className="mt-8 p-4 rounded-3xl glass-card">
        <div className="text-sm font-bold mb-2">Schnellsuche</div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="z.B. 502, webhook, nginx, docker secrets, env leak…"
            aria-label="Runbooks durchsuchen"
            className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-claw-green focus:ring-2 focus:ring-claw-green/20 transition-all"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="px-4 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-white/10 font-bold transition-colors"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
        {trimmed ? (
          <div className="mt-3 text-xs text-gray-500" aria-live="polite">
            Treffer für <span className="font-mono text-gray-200">{trimmed}</span>:{" "}
            <span className="font-bold">{filtered.length}</span>
          </div>
        ) : (
          <div className="mt-3 text-xs text-gray-500" aria-live="polite">Tipp: Fehlercode + Provider kombiniert gewinnt.</div>
        )}
      </div>

      {/* RunbookCard grid */}
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <RunbookCard
            key={r.slug}
            slug={r.slug}
            title={r.title}
            summary={r.summary}
            tags={r.tags}
            severity={r.severity}
            fixReadiness={r.fixReadiness}
          />
        ))}
      </div>
    </>
  )
}
