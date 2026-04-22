"use client"

import { useEffect, useMemo, useState } from "react"
import type { Actor, Diagram, DiagramEdge, DiagramNode, EdgeKind, Fork, Scenario } from "@/lib/breaches/types"

interface Props {
  scenario: Scenario
}

const ACTOR_COLOR: Record<Actor, { stroke: string; fill: string; text: string; glow: string }> = {
  attacker:  { stroke: "#f87171", fill: "rgba(239,68,68,0.08)",  text: "#fecaca", glow: "0 0 12px rgba(239,68,68,0.4)" },
  victim:    { stroke: "#fbbf24", fill: "rgba(251,191,36,0.08)", text: "#fde68a", glow: "0 0 12px rgba(251,191,36,0.35)" },
  defender:  { stroke: "#34d399", fill: "rgba(16,185,129,0.08)", text: "#a7f3d0", glow: "0 0 12px rgba(16,185,129,0.4)" },
  server:    { stroke: "#60a5fa", fill: "rgba(59,130,246,0.08)", text: "#bfdbfe", glow: "0 0 10px rgba(59,130,246,0.3)" },
  external:  { stroke: "#c084fc", fill: "rgba(139,92,246,0.08)", text: "#ddd6fe", glow: "0 0 10px rgba(139,92,246,0.3)" },
  vendor:    { stroke: "#22d3ee", fill: "rgba(6,182,212,0.08)",  text: "#a5f3fc", glow: "0 0 10px rgba(6,182,212,0.3)" },
  public:    { stroke: "#9ca3af", fill: "rgba(156,163,175,0.08)",text: "#e5e7eb", glow: "0 0 8px rgba(156,163,175,0.25)" },
}

const EDGE_COLOR: Record<EdgeKind, string> = {
  attack:   "#f87171",
  normal:   "#9ca3af",
  blocked:  "#34d399",
  recovery: "#22d3ee",
}

export function AttackTimeline({ scenario }: Props) {
  const [idx, setIdx] = useState(0)
  const [showFork, setShowFork] = useState(false)
  const [autoplay, setAutoplay] = useState(false)

  const steps = scenario.steps
  const step = steps[Math.min(idx, steps.length - 1)]
  const diagram = showFork && step.fork ? step.fork.diagram : step.diagram
  const pct = Math.round(((idx + 1) / steps.length) * 100)
  const atEnd = idx >= steps.length - 1

  useEffect(() => setShowFork(false), [idx])

  useEffect(() => {
    if (!autoplay || atEnd) return
    const timer = setTimeout(() => setIdx((i) => Math.min(i + 1, steps.length - 1)), 7000)
    return () => clearTimeout(timer)
  }, [autoplay, idx, atEnd, steps.length])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-gray-400 tabular-nums">
          {idx + 1} / {steps.length}
        </span>
      </div>

      {/* Step body */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Left: narrative */}
        <div className="order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono tracking-[0.3em] text-red-400">{step.time}</span>
            <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
              {step.actor.toUpperCase()}
            </span>
            {showFork && step.fork && (
              <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                FORK
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-gray-100 mb-4 leading-tight">
            {showFork && step.fork ? step.fork.label.replace(/^What if /, "What if ") : step.title}
          </h2>

          <p className="text-base text-gray-300 leading-relaxed mb-5">
            {showFork && step.fork ? step.fork.outcome : step.narrative}
          </p>

          {showFork && step.fork?.takeaway && (
            <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-sm text-emerald-100/90 mb-5">
              <div className="text-[10px] font-mono tracking-widest text-emerald-300 mb-1">TAKEAWAY</div>
              {step.fork.takeaway}
            </div>
          )}

          {step.fork && (
            <button
              onClick={() => setShowFork((v) => !v)}
              className={`text-xs font-mono px-3 py-2 rounded-lg border transition-colors ${
                showFork
                  ? "border-white/20 text-gray-300 hover:border-white/40"
                  : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
              }`}
            >
              {showFork ? "← Back to actual timeline" : "What if the defender had acted differently?"}
            </button>
          )}
        </div>

        {/* Right: diagram */}
        <div className="order-1 lg:order-2">
          <DiagramCanvas diagram={diagram} keyHint={`${step.id}-${showFork ? "fork" : "main"}`} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIdx((i) => Math.max(i - 1, 0))}
            disabled={idx === 0}
            className="px-4 py-2 text-sm font-mono rounded-lg border border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => setIdx((i) => Math.min(i + 1, steps.length - 1))}
            disabled={atEnd}
            className="px-4 py-2 text-sm font-bold rounded-lg bg-red-500 text-black hover:bg-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
          <button
            onClick={() => setAutoplay((v) => !v)}
            className={`px-3 py-2 text-xs font-mono rounded-lg border transition-colors ${
              autoplay ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" : "border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            {autoplay ? "⏸ pause" : "▶ autoplay"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIdx(i)}
              className={`w-6 h-1.5 rounded-full transition-colors ${
                i === idx ? "bg-red-400" : i < idx ? "bg-emerald-400/60" : "bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Jump to step ${i + 1}`}
              title={`${s.time} — ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Takeaways (always visible at end) */}
      {atEnd && (
        <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6">
          <div className="text-[10px] font-mono tracking-[0.3em] text-emerald-300 mb-3">TAKEAWAYS</div>
          <ul className="space-y-2">
            {scenario.takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-200">
                <span className="text-emerald-400 font-mono shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>

          {scenario.references.length > 0 && (
            <>
              <div className="text-[10px] font-mono tracking-[0.3em] text-emerald-300 mt-6 mb-2">REFERENCES</div>
              <ul className="space-y-1 text-xs">
                {scenario.references.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline break-all"
                    >
                      {r.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// DiagramCanvas — inline SVG renderer, percent coords (0..100).
// Animates edges with dash-offset on mount of each step.
// ───────────────────────────────────────────────────────────

function DiagramCanvas({ diagram, keyHint }: { diagram: Diagram; keyHint: string }) {
  const nodes = diagram.nodes
  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, DiagramNode>, [nodes])

  const VIEW_W = 100
  const VIEW_H = 60
  const NODE_W = 22
  const NODE_H = 10

  return (
    <div key={keyHint} className="rounded-2xl border border-white/10 bg-[#07090c] overflow-hidden">
      <div className="aspect-[5/3] relative">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {(["attack", "normal", "blocked", "recovery"] as EdgeKind[]).map((k) => (
              <marker key={k} id={`arrow-${k}-${keyHint}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={EDGE_COLOR[k]} />
              </marker>
            ))}
          </defs>

          {/* Edges */}
          {diagram.edges.map((e, i) => (
            <EdgeLine
              key={i}
              edge={e}
              nodeMap={nodeMap}
              nodeW={NODE_W}
              nodeH={NODE_H}
              markerId={`arrow-${e.kind}-${keyHint}`}
              index={i}
            />
          ))}

          {/* Nodes */}
          {nodes.map((n) => {
            const color = ACTOR_COLOR[n.kind]
            return (
              <g key={n.id} transform={`translate(${n.x - NODE_W / 2}, ${n.y - NODE_H / 2})`} style={{ filter: `drop-shadow(${color.glow})` }}>
                <rect width={NODE_W} height={NODE_H} rx="1.5" ry="1.5" fill={color.fill} stroke={color.stroke} strokeWidth="0.3" />
                <text x={NODE_W / 2} y={NODE_H / 2 - (n.sub ? 0.4 : -1.3)} fill={color.text} fontSize="2" fontFamily="ui-monospace,monospace" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                  {n.label.length > 28 ? n.label.slice(0, 28) + "…" : n.label}
                </text>
                {n.sub && (
                  <text x={NODE_W / 2} y={NODE_H / 2 + 2.2} fill="#9ca3af" fontSize="1.4" fontFamily="ui-monospace,monospace" textAnchor="middle" dominantBaseline="middle">
                    {n.sub.length > 34 ? n.sub.slice(0, 34) + "…" : n.sub}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {diagram.caption && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 text-[11px] font-mono text-gray-500 bg-gradient-to-t from-black/80 to-transparent">
            {diagram.caption}
          </div>
        )}
      </div>
    </div>
  )
}

function EdgeLine({
  edge, nodeMap, nodeW, nodeH, markerId, index,
}: {
  edge: DiagramEdge
  nodeMap: Record<string, DiagramNode>
  nodeW: number
  nodeH: number
  markerId: string
  index: number
}) {
  const from = nodeMap[edge.from]
  const to = nodeMap[edge.to]
  if (!from || !to) return null

  // Approach each node's edge, not its center.
  const { x: x1, y: y1 } = nodeEdgePoint(from, to, nodeW, nodeH)
  const { x: x2, y: y2 } = nodeEdgePoint(to, from, nodeW, nodeH)

  const color = EDGE_COLOR[edge.kind]
  const dashed = edge.kind === "blocked"
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2 - 1.5

  // Pre-compute a path length estimate for the dash-dance animation.
  const len = Math.hypot(x2 - x1, y2 - y1)

  return (
    <g>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={edge.kind === "attack" ? 0.5 : 0.4}
        strokeDasharray={dashed ? "1.5 1" : `${len} ${len}`}
        strokeDashoffset={dashed ? 0 : len}
        markerEnd={`url(#${markerId})`}
        style={{
          animation: dashed
            ? `cg-edge-pulse 1.8s linear infinite`
            : `cg-edge-draw 0.9s ease-out ${0.2 + index * 0.15}s forwards`,
        }}
        opacity={dashed ? 0.85 : 1}
      />
      {edge.label && (
        <text
          x={midX}
          y={midY}
          fill={color}
          fontSize="1.5"
          fontFamily="ui-monospace,monospace"
          textAnchor="middle"
          opacity="0"
          style={{ animation: `cg-edge-label 0.5s ease-out ${0.5 + index * 0.15}s forwards` }}
        >
          {edge.label}
        </text>
      )}
      <style jsx>{`
        @keyframes cg-edge-draw { to { stroke-dashoffset: 0; } }
        @keyframes cg-edge-label { to { opacity: 0.95; } }
        @keyframes cg-edge-pulse { to { stroke-dashoffset: -10; } }
      `}</style>
    </g>
  )
}

function nodeEdgePoint(from: DiagramNode, to: DiagramNode, w: number, h: number) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  // Determine which side of the from-node the line exits on.
  const slope = absDy === 0 ? Infinity : absDx / absDy
  if (slope > w / h) {
    // exits left/right
    const sign = dx >= 0 ? 1 : -1
    const ratio = dy / dx
    return { x: from.x + (sign * w) / 2, y: from.y + (sign * w / 2) * ratio }
  } else {
    // exits top/bottom
    const sign = dy >= 0 ? 1 : -1
    const ratio = dx / dy
    return { x: from.x + (sign * h / 2) * ratio, y: from.y + (sign * h) / 2 }
  }
}
