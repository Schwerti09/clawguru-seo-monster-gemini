// TEMPORAL MYCELIUM v3.1 – UNIVERSE HUB – Overlord AI
// Standalone Temporal Mycelium hub: Zeitreise-Slider across the entire security knowledge graph.
// Epoch-traversal, mutation history, backward-propagation overview.

"use client"

import { useState, useEffect, useCallback } from "react"

/* ── Quantum Void colour tokens ── */
const QV = {
  void: "#050505",
  gold: "#c9a84c",
  goldGlow: "rgba(201,168,76,0.25)",
  violet: "#8b6cdf",
  violetGlow: "rgba(139,108,223,0.2)",
  coldWhite: "#d4dce8",
  green: "#00ff9d",
  blue: "#00b8ff",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const

/* ── Epoch definitions: 8 quarters of security intelligence ── */
const EPOCHS = [
  {
    quarter: "2024-Q3",
    label: "Pre-Singularity",
    events: 1_204,
    mutations: 47,
    dominant: "SSH Hardening",
    color: QV.blue,
  },
  {
    quarter: "2024-Q4",
    label: "Genesis Awakening",
    events: 3_891,
    mutations: 132,
    dominant: "Firewall Baseline",
    color: QV.violet,
  },
  {
    quarter: "2025-Q1",
    label: "Mycelium Seed",
    events: 12_447,
    mutations: 389,
    dominant: "Zero Trust Rollout",
    color: QV.gold,
  },
  {
    quarter: "2025-Q2",
    label: "Network Bloom",
    events: 48_220,
    mutations: 1_204,
    dominant: "Container Hardening",
    color: QV.green,
  },
  {
    quarter: "2025-Q3",
    label: "Intelligence Surge",
    events: 142_880,
    mutations: 4_712,
    dominant: "Supply Chain Shield",
    color: QV.blue,
  },
  {
    quarter: "2025-Q4",
    label: "Quantum Threshold",
    events: 389_002,
    mutations: 14_437,
    dominant: "AI-Assisted Remediation",
    color: QV.violet,
  },
  {
    quarter: "2026-Q1",
    label: "Singularity Onset",
    events: 812_334,
    mutations: 38_901,
    dominant: "Provenance Anchoring",
    color: QV.gold,
  },
  {
    quarter: "2026-Q2",
    label: "Universe Present",
    events: 1_042_731,
    mutations: 94_882,
    dominant: "Neuro-Mycelium Sync",
    color: QV.coldWhite,
  },
]

/* ── Simulated knowledge nodes for current epoch ── */
const NODE_CATEGORIES = [
  { label: "Critical Patches", color: "#ff4646" },
  { label: "Hardening Guides", color: QV.gold },
  { label: "Incident Playbooks", color: QV.violet },
  { label: "Zero-Day Responses", color: QV.green },
  { label: "Compliance Mappings", color: QV.blue },
]

function scaleValue(value: number, max: number): number {
  return Math.min(100, Math.round((value / max) * 100))
}

const MAX_EVENTS = EPOCHS[EPOCHS.length - 1].events
const MAX_MUTATIONS = EPOCHS[EPOCHS.length - 1].mutations

export default function TemporalPage() {
  const [epochIdx, setEpochIdx] = useState(EPOCHS.length - 1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [categoryIdx, setCategoryIdx] = useState(0)

  const epoch = EPOCHS[epochIdx]

  /* ── Auto-play through epochs ── */
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => {
      setEpochIdx((i) => {
        if (i >= EPOCHS.length - 1) {
          setIsPlaying(false)
          return EPOCHS.length - 1
        }
        return i + 1
      })
    }, 1200)
    return () => clearInterval(id)
  }, [isPlaying])

  /* ── Cycle category highlight ── */
  useEffect(() => {
    const id = setInterval(
      () => setCategoryIdx((i) => (i + 1) % NODE_CATEGORIES.length),
      2800,
    )
    return () => clearInterval(id)
  }, [])

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlaying(false)
    setEpochIdx(Number(e.target.value))
  }, [])

  const eventBar = scaleValue(epoch.events, MAX_EVENTS)
  const mutationBar = scaleValue(epoch.mutations, MAX_MUTATIONS)

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col"
        style={{ background: QV.void }}
      >
        {/* ── Header ── */}
        <div className="pt-16 pb-10 px-4 text-center">
          <a
            href="/universe"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-6 transition-opacity opacity-40 hover:opacity-80"
            style={{ color: QV.gold }}
          >
            ← Universe
          </a>
          <div
            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
            style={{ color: `${QV.gold}88` }}
          >
            Temporal Mycelium · Zeitreise-Engine · v3.1
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${QV.gold}, ${QV.coldWhite} 45%, ${QV.violet})`,
              }}
            >
              Temporal
            </span>
          </h1>
          <p
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Traverse security intelligence across all epochs. The Mycelium
            remembers every mutation, every patch, every lesson learned.
          </p>
        </div>

        {/* ── Epoch Display Card ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-8">
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: QV.glass,
              border: `1px solid ${epoch.color}22`,
              boxShadow: `0 0 60px ${epoch.color}0a`,
            }}
          >
            {/* Epoch header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <div
                  className="text-[10px] font-mono tracking-[0.25em] uppercase mb-1"
                  style={{ color: `${epoch.color}88` }}
                >
                  {epoch.quarter}
                </div>
                <h2
                  className="text-3xl md:text-4xl font-black leading-none"
                  style={{ color: epoch.color }}
                >
                  {epoch.label}
                </h2>
              </div>
              <div
                className="px-4 py-2 rounded-full font-mono text-xs tracking-widest uppercase border"
                style={{
                  border: `1px solid ${epoch.color}44`,
                  color: epoch.color,
                  background: `${epoch.color}0d`,
                }}
              >
                Dominant: {epoch.dominant}
              </div>
            </div>

            {/* Stats bars */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Security Events */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span
                    className="text-[10px] font-mono tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Security Events
                  </span>
                  <span
                    className="text-lg font-black tabular-nums"
                    style={{ color: epoch.color }}
                  >
                    {epoch.events.toLocaleString("de-DE")}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${eventBar}%`,
                      background: `linear-gradient(90deg, ${epoch.color}88, ${epoch.color})`,
                    }}
                  />
                </div>
              </div>

              {/* Mutations */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span
                    className="text-[10px] font-mono tracking-widest uppercase"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Mycelium Mutations
                  </span>
                  <span
                    className="text-lg font-black tabular-nums"
                    style={{ color: QV.violet }}
                  >
                    {epoch.mutations.toLocaleString("de-DE")}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${mutationBar}%`,
                      background: `linear-gradient(90deg, ${QV.violet}88, ${QV.violet})`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Knowledge Categories */}
            <div className="flex flex-wrap gap-2">
              {NODE_CATEGORIES.map((cat, i) => (
                <div
                  key={cat.label}
                  className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wide uppercase transition-all duration-500"
                  style={{
                    background:
                      i === categoryIdx ? `${cat.color}14` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === categoryIdx ? cat.color + "44" : QV.glassBorder}`,
                    color: i === categoryIdx ? cat.color : "rgba(255,255,255,0.2)",
                  }}
                >
                  {cat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Zeitreise-Slider ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-10">
          <div
            className="rounded-3xl p-6 border"
            style={{
              background: QV.glass,
              border: `1px solid ${QV.glassBorder}`,
            }}
          >
            <div
              className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
              style={{ color: `${QV.gold}88` }}
            >
              Zeitreise-Slider · Epoch Navigation
            </div>

            {/* Epoch markers */}
            <div className="flex justify-between mb-2 overflow-hidden">
              {EPOCHS.map((ep, i) => (
                <button
                  key={ep.quarter}
                  onClick={() => {
                    setIsPlaying(false)
                    setEpochIdx(i)
                  }}
                  className="text-[8px] font-mono tracking-wider uppercase transition-colors duration-300 text-center leading-tight"
                  style={{
                    color:
                      i === epochIdx
                        ? ep.color
                        : "rgba(255,255,255,0.18)",
                    flex: 1,
                  }}
                  title={ep.label}
                >
                  {ep.quarter.replace("20", "'")}
                </button>
              ))}
            </div>

            {/* Range slider */}
            <input
              type="range"
              min={0}
              max={EPOCHS.length - 1}
              value={epochIdx}
              onChange={handleSlider}
              className="w-full mb-4"
              style={{
                accentColor: epoch.color,
                height: "4px",
              }}
              aria-label="Temporal epoch slider"
            />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setEpochIdx(0)
                  }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${QV.glassBorder}`,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  ⏮ Origin
                </button>
                <button
                  onClick={() => {
                    if (epochIdx === EPOCHS.length - 1) setEpochIdx(0)
                    setIsPlaying((p) => !p)
                  }}
                  className="px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: isPlaying ? `${epoch.color}14` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isPlaying ? epoch.color + "55" : QV.glassBorder}`,
                    color: isPlaying ? epoch.color : "rgba(255,255,255,0.4)",
                  }}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setEpochIdx(EPOCHS.length - 1)
                  }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${QV.glassBorder}`,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Now ⏭
                </button>
              </div>
              <div
                className="text-[9px] font-mono tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {epochIdx + 1} / {EPOCHS.length} epochs
              </div>
            </div>
          </div>
        </div>

        {/* ── Epoch Timeline Track ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-16">
          <div
            className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Full Epoch Timeline
          </div>
          <div className="flex flex-col gap-2">
            {EPOCHS.map((ep, i) => (
              <button
                key={ep.quarter}
                onClick={() => {
                  setIsPlaying(false)
                  setEpochIdx(i)
                }}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl border text-left transition-all duration-300"
                style={{
                  background: i === epochIdx ? `${ep.color}08` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${i === epochIdx ? ep.color + "33" : QV.glassBorder}`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: i <= epochIdx ? ep.color : "rgba(255,255,255,0.1)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: i === epochIdx ? ep.color : "rgba(255,255,255,0.5)" }}
                    >
                      {ep.quarter}
                    </span>
                    <span
                      className="text-[9px] font-mono tracking-widest uppercase shrink-0"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {ep.events.toLocaleString("de-DE")} events
                    </span>
                  </div>
                  <div
                    className="text-[10px] font-mono mt-0.5 truncate"
                    style={{ color: i === epochIdx ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                  >
                    {ep.label} · {ep.dominant}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="pb-12 text-center px-4">
          <a
            href="/runbooks"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: `${QV.gold}10`,
              border: `1px solid ${QV.gold}44`,
              color: QV.gold,
            }}
          >
            Browse Runbook Library →
          </a>
        </div>

        {/* ── Bottom inscription ── */}
        <div className="pb-6 text-center">
          <div
            className="text-[9px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.07)" }}
          >
            The Mycelium remembers. · Temporal Engine v3.1 · ClawGuru.org
          </div>
        </div>
      </div>

      <style>{`
        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255,255,255,0.08);
          border-radius: 9999px;
          cursor: pointer;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  )
}
