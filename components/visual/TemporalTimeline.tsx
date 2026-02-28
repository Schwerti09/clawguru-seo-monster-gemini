"use client"
// TEMPORAL MYCELIUM v3.1 – Overlord AI
// Interactive Temporal Evolution Timeline + Time Travel Slider for runbook pages.
// Shows chronological version history with mutation badges and diff views.
// Slider enables live time-travel through all historical versions.

import { useState } from "react"
import type { TemporalHistory, TemporalVersion, TemporalDiff } from "@/lib/temporal-mycelium"

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Badge color per evolution stage
function badgeStyle(badge: TemporalVersion["badge"]) {
  if (badge === "original")
    return "border-gray-600/60 bg-gray-700/20 text-gray-400"
  if (badge === "current")
    return "border-cyan-500/60 bg-cyan-500/10 text-cyan-300"
  return "border-violet-500/50 bg-violet-500/10 text-violet-300"
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Diff line color
function diffColor(kind: TemporalDiff["kind"]) {
  if (kind === "added") return "text-emerald-400"
  if (kind === "removed") return "text-red-400"
  return "text-yellow-400"
}

function diffIcon(kind: TemporalDiff["kind"]) {
  if (kind === "added") return "+"
  if (kind === "removed") return "−"
  return "~"
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Score pill
function ScorePill({ score }: { score: number }) {
  const color =
    score >= 95
      ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
      : score >= 85
        ? "text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
        : "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${color}`}>
      ⚡ {score}
    </span>
  )
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Individual version card in timeline
function VersionCard({
  v,
  isSelected,
  onClick,
}: {
  v: TemporalVersion
  isSelected: boolean
  onClick: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`relative rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-cyan-500/60 bg-cyan-500/5 shadow-[0_0_20px_rgba(0,184,255,0.12)]"
          : "border-gray-800 bg-black/20 hover:border-gray-700"
      }`}
      onClick={onClick}
    >
      {/* Connector dot */}
      <div
        className={`absolute -left-[1.25rem] top-5 w-3 h-3 rounded-full border-2 transition-colors ${
          isSelected ? "border-cyan-400 bg-cyan-500" : "border-gray-600 bg-gray-800"
        }`}
      />

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-black ${badgeStyle(v.badge)}`}
        >
          {v.badge === "original" ? "⏱ Original" : v.badge === "current" ? "✦ Aktuell" : "⚗ Temporal Mutation"}
        </span>
        <span className="text-xs font-mono text-gray-500">{v.quarter}</span>
        <span className="text-xs text-gray-600">{v.timestamp}</span>
        <ScorePill score={v.score} />
        <span className="ml-auto text-xs font-mono text-gray-600">{v.version}</span>
      </div>

      <div className="text-sm font-bold text-gray-200">{v.label}</div>
      <div className="mt-1 text-xs text-gray-400">{v.mutationReason}</div>

      {v.diffs.length > 0 && (
        <button
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setOpen((o) => !o)
          }}
        >
          {open ? "▲ Diff ausblenden" : "▼ Diff anzeigen"}
        </button>
      )}

      {open && v.diffs.length > 0 && (
        <div className="mt-3 rounded-xl border border-gray-800 bg-black/40 p-3 font-mono text-xs space-y-1">
          {v.diffs.map((d, i) => (
            <div key={i} className={`flex gap-2 ${diffColor(d.kind)}`}>
              <span className="shrink-0 w-3 font-black">{diffIcon(d.kind)}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Time travel slider props
interface Props {
  history: TemporalHistory
  slug: string
  lang?: string
}

/**
 * TEMPORAL MYCELIUM v3.1 – Overlord AI
 * Main exported component: Temporal Evolution Timeline + Time Travel Slider.
 * Renders the "Mycelium Remembers" banner, chronological version list,
 * and an interactive slider for time-travel through the runbook's history.
 */
export default function TemporalTimeline({ history, slug, lang }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(history.versions.length - 1)
  const selected = history.versions[selectedIdx]
  const temporalHref = lang
    ? `/${lang}/runbook/${slug}/temporal`
    : `/runbook/${slug}/temporal`

  return (
    <section className="mt-12">
      {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Mycelium Remembers Banner */}
      <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl border border-violet-500/20 bg-violet-500/5">
        <span className="text-violet-400 text-lg shrink-0">🍄</span>
        <p className="text-xs text-violet-300/80">
          <span className="font-black text-violet-300">The Mycelium remembers every lesson.</span>{" "}
          This runbook has evolved{" "}
          <span className="font-bold text-white">{history.totalEvolutions}</span>{" "}
          {history.totalEvolutions === 1 ? "time" : "times"} since creation.
        </p>
        <a
          href={temporalHref}
          className="ml-auto shrink-0 text-xs text-violet-400 hover:text-violet-200 underline underline-offset-2 transition-colors"
        >
          Zeitachse öffnen →
        </a>
      </div>

      <h2 className="text-xl font-black mb-2 text-gray-100">
        Temporal Evolution Timeline
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Jede Version wurde durch CVEs, Patches oder Best-Practice-Updates ausgelöst.
        Nutze den Slider, um durch die Zeit zu reisen.
      </p>

      {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Time Travel Slider */}
      <div className="mb-8 p-5 rounded-2xl border border-gray-800 bg-black/25">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            ⏳ Reise durch die Zeit
          </span>
          <span className="text-xs font-mono text-cyan-400">
            {selected.quarter} · {selected.version}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={history.versions.length - 1}
          step={1}
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(Number(e.target.value))}
          className="w-full accent-cyan-400 cursor-pointer"
          aria-label="Temporal time travel slider"
        />

        <div className="flex justify-between mt-1">
          {history.versions.map((v, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`text-[10px] font-mono transition-colors ${
                i === selectedIdx ? "text-cyan-400 font-bold" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {v.quarter}
            </button>
          ))}
        </div>

        {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Live snapshot of selected version */}
        <div
          className="mt-4 rounded-xl border border-gray-800 bg-black/30 p-4 transition-all duration-300"
          key={selectedIdx}
        >
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-black ${badgeStyle(selected.badge)}`}>
              {selected.badge === "original" ? "⏱ Original" : selected.badge === "current" ? "✦ Aktuell" : "⚗ Temporal Mutation"}
            </span>
            <ScorePill score={selected.score} />
            <span className="text-xs text-gray-500">{selected.stepCount} Steps</span>
          </div>
          <div className="text-sm font-bold text-gray-100">{selected.label}</div>
          <div className="mt-1 text-xs text-gray-400">{selected.mutationReason}</div>
          {selected.diffs.length > 0 && (
            <div className="mt-3 font-mono text-xs space-y-1">
              {selected.diffs.map((d, i) => (
                <div key={i} className={`flex gap-2 ${diffColor(d.kind)}`}>
                  <span className="shrink-0 w-3 font-black">{diffIcon(d.kind)}</span>
                  <span>{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* TEMPORAL MYCELIUM v3.1 – Overlord AI: Chronological timeline list */}
      <div className="relative ml-5 space-y-4">
        {/* Vertical timeline rail */}
        <div className="absolute left-[-1rem] top-0 bottom-0 w-px bg-gray-800" />
        {history.versions.map((v, i) => (
          <VersionCard
            key={v.quarter + v.version}
            v={v}
            isSelected={i === selectedIdx}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </div>
    </section>
  )
}
