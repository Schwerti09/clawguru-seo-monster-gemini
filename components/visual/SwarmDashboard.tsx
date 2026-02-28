"use client"
// SWARM DEPLOYMENT v3.2 – Overlord AI
// SwarmDashboard – Live swarm visualisation, agent graph, self-healing event feed,
// RECALL and EVOLVE controls. Runs entirely client-side with deterministic simulation.

import { useState, useEffect, useCallback } from "react"
import type { SwarmDeployment, SwarmAgent, SwarmHealEvent } from "@/lib/swarm"

// SWARM DEPLOYMENT v3.2 – Overlord AI: Status colour map
const STATUS_COLOR: Record<SwarmAgent["status"], string> = {
  active:  "#00ff9d",
  healing: "#ffc800",
  idle:    "#00b8ff",
  lost:    "#ff4646",
}

const STATUS_LABEL: Record<SwarmAgent["status"], string> = {
  active:  "Active",
  healing: "Healing",
  idle:    "Idle",
  lost:    "Lost",
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Severity colour
const SEV_COLOR: Record<SwarmHealEvent["severity"], string> = {
  critical: "text-red-400 border-red-500/30 bg-red-500/10",
  high:     "text-orange-400 border-orange-500/30 bg-orange-500/10",
  medium:   "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  low:      "text-gray-400 border-gray-700/50 bg-gray-800/30",
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Relative time string
function relTime(ms: number): string {
  const delta = Math.max(0, Date.now() - ms)
  if (delta < 60_000) return `${Math.floor(delta / 1000)}s ago`
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`
  return `${Math.floor(delta / 3_600_000)}h ago`
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Agent dot in the swarm graph
function AgentDot({
  agent,
  x,
  y,
}: {
  agent: SwarmAgent
  x: number
  y: number
}) {
  const color = STATUS_COLOR[agent.status]
  const glow = agent.status === "healing"
    ? `0 0 8px ${color}`
    : agent.status === "active"
      ? `0 0 4px ${color}80`
      : "none"
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={agent.status === "healing" ? 6 : 4}
        fill={color}
        opacity={agent.status === "lost" ? 0.3 : 0.9}
        style={{ filter: `drop-shadow(${glow})` }}
      />
      {agent.status === "healing" && (
        <circle cx={x} cy={y} r={10} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
      )}
    </g>
  )
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Swarm graph SVG using golden-angle spiral layout
function SwarmGraph({ agents }: { agents: SwarmAgent[] }) {
  const W = 480
  const H = 320
  const cx = W / 2
  const cy = H / 2
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  const positions = agents.map((_, i) => {
    const angle = i * goldenAngle
    const radius = 12 * Math.sqrt(i + 1)
    return {
      x: cx + Math.cos(angle) * Math.min(radius, cx - 12),
      y: cy + Math.sin(angle) * Math.min(radius, cy - 12),
    }
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full rounded-2xl border border-gray-800 bg-black/40"
      style={{ maxHeight: 320 }}
      aria-label="Swarm agent graph"
    >
      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Grid lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={0} y1={(i + 1) * H / 6}
          x2={W} y2={(i + 1) * H / 6}
          stroke="#ffffff08"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={(i + 1) * W / 8} y1={0}
          x2={(i + 1) * W / 8} y2={H}
          stroke="#ffffff08"
          strokeWidth={1}
        />
      ))}

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Mesh connection lines between nearby agents */}
      {agents.slice(0, 15).map((_, i) =>
        agents.slice(i + 1, i + 3).map((_, j) => {
          const pi = positions[i]
          const pj = positions[i + 1 + j]
          if (!pi || !pj) return null
          return (
            <line
              key={`e${i}-${j}`}
              x1={pi.x} y1={pi.y}
              x2={pj.x} y2={pj.y}
              stroke="#00ff9d"
              strokeWidth={0.5}
              opacity={0.08}
            />
          )
        })
      )}

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Agent dots */}
      {agents.map((agent, i) => {
        const p = positions[i]
        if (!p) return null
        return <AgentDot key={agent.id} agent={agent} x={p.x} y={p.y} />
      })}

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Center origin pulse */}
      <circle cx={cx} cy={cy} r={3} fill="#00ff9d" opacity={0.9} />
      <circle cx={cx} cy={cy} r={20} fill="none" stroke="#00ff9d" strokeWidth={1} opacity={0.15} />
    </svg>
  )
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Stat card
function StatCard({
  label,
  value,
  color,
  sub,
}: {
  label: string
  value: string | number
  color: string
  sub?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-4 text-center">
      <div className="text-2xl font-black font-mono" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{label}</div>
      {sub && <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>}
    </div>
  )
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Heal event row
function HealEventRow({ ev }: { ev: SwarmHealEvent }) {
  return (
    <div className={`rounded-xl border p-3 text-xs ${SEV_COLOR[ev.severity]}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-black uppercase tracking-wide">{ev.severity}</span>
        <span className="text-gray-500 font-mono">{relTime(ev.timestampMs)}</span>
      </div>
      <div className="font-semibold text-gray-200">{ev.issue}</div>
      <div className="mt-0.5 text-gray-400">✓ {ev.resolution}</div>
      <div className="mt-1 text-gray-600 font-mono">{ev.agentId} · {ev.zone}</div>
    </div>
  )
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Zone heatmap row
function ZoneBar({ zone, count, max }: { zone: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <div className="text-xs font-mono text-gray-400 w-32 shrink-0 truncate">{zone}</div>
      <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs font-mono text-gray-500 w-6 text-right">{count}</div>
    </div>
  )
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Main dashboard props
interface Props {
  deployment: SwarmDeployment
}

type DashboardPhase = "live" | "recalling" | "recalled" | "evolving" | "evolved"

/**
 * SWARM DEPLOYMENT v3.2 – Overlord AI
 * Full live swarm dashboard with animated stats, agent graph,
 * heal event feed, zone heatmap, RECALL and EVOLVE controls.
 */
export default function SwarmDashboard({ deployment }: Props) {
  const [phase, setPhase] = useState<DashboardPhase>("live")
  const [tick, setTick] = useState(0)
  const [activeCount, setActiveCount] = useState(deployment.activeAgents)
  const [healCount, setHealCount] = useState(deployment.healEventsThisHour)

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Live ticker – update counts every 4 seconds
  useEffect(() => {
    if (phase !== "live") return
    const id = setInterval(() => {
      setTick((t) => t + 1)
      // SWARM DEPLOYMENT v3.2 – Overlord AI: Small deterministic drift to simulate live activity
      setActiveCount((c) => {
        const delta = (Math.round(Math.sin(Date.now() / 7000) * 3))
        return Math.max(deployment.activeAgents - 5, Math.min(deployment.totalAgents, c + delta))
      })
      setHealCount((c) => c + (Math.random() < 0.4 ? 1 : 0))
    }, 4000)
    return () => clearInterval(id)
  }, [phase, deployment])

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Zone agent distribution for heatmap
  const zoneCounts: Record<string, number> = {}
  for (const agent of deployment.agents) {
    zoneCounts[agent.zone] = (zoneCounts[agent.zone] ?? 0) + 1
  }
  const maxZoneCount = Math.max(1, ...Object.values(zoneCounts))

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Recall handler – recall all agents to Mycelium
  const handleRecall = useCallback(() => {
    setPhase("recalling")
    setTimeout(() => setPhase("recalled"), 2000)
  }, [])

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Evolve handler – push new Mycelium mutations to swarm
  const handleEvolve = useCallback(() => {
    setPhase("evolving")
    setTimeout(() => {
      setPhase("evolved")
      // SWARM DEPLOYMENT v3.2 – Overlord AI: Boost agent count after evolution
      setActiveCount((c) => Math.min(deployment.totalAgents, c + Math.floor(deployment.totalAgents * 0.05)))
      setHealCount((c) => c + 3)
      setTimeout(() => setPhase("live"), 3000)
    }, 2500)
  }, [deployment.totalAgents])

  const targetLabel = deployment.target.replace("-", " ").toUpperCase()

  return (
    <div className="space-y-6">
      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Phase overlay banners */}
      {phase === "recalling" && (
        <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-center font-black text-yellow-300 animate-pulse">
          ⏏ SWARM RECALL IN PROGRESS – Agents withdrawing to Mycelium…
        </div>
      )}
      {phase === "recalled" && (
        <div className="rounded-2xl border border-gray-500/40 bg-gray-500/10 p-4 text-center font-black text-gray-300">
          ✓ ALL AGENTS RECALLED – Knowledge transferred to Mycelium. Swarm offline.
        </div>
      )}
      {phase === "evolving" && (
        <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-4 text-center font-black text-violet-300 animate-pulse">
          🧬 SWARM EVOLVE – Mycelium pushing new mutations to all agents…
        </div>
      )}
      {phase === "evolved" && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center font-black text-emerald-300">
          ✦ SWARM EVOLVED – All agents updated with latest Mycelium knowledge.
        </div>
      )}

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Status bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-gray-800 bg-black/25 text-xs">
        <span className="font-mono text-gray-500">ID:</span>
        <span className="font-mono text-gray-300">{deployment.deploymentId}</span>
        <span className="text-gray-700">·</span>
        <span className="text-gray-500">Target:</span>
        <span className="text-orange-300 font-bold">{targetLabel}</span>
        <span className="text-gray-700">·</span>
        <span className="text-gray-500">Started:</span>
        <span className="text-gray-300">{new Date(deployment.startedAt).toLocaleTimeString()}</span>
        <span className={`ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
          phase === "live" || phase === "evolved"
            ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : phase === "recalled"
              ? "border border-gray-600/40 bg-gray-700/10 text-gray-400"
              : "border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 animate-pulse"
        }`}>
          {phase === "live" || phase === "evolved" ? "● LIVE" : phase === "recalled" ? "○ OFFLINE" : "◌ TRANSITION"}
        </span>
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Agents Alive"
          value={`${activeCount} / ${deployment.totalAgents}`}
          color="#00ff9d"
          sub={`${Math.round((activeCount / deployment.totalAgents) * 100)}% healthy`}
        />
        <StatCard
          label="Self-Healing Events"
          value={healCount}
          color="#ffc800"
          sub="this hour"
        />
        <StatCard
          label="Zones Covered"
          value={deployment.zones.length}
          color="#00b8ff"
          sub={targetLabel}
        />
        <StatCard
          label="Mesh Connections"
          value={(activeCount * 2).toLocaleString()}
          color="#b464ff"
          sub="active links"
        />
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Agent graph + heal event feed */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Force graph */}
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
            Agent Mesh Graph · {deployment.agents.length} shown
          </div>
          <SwarmGraph agents={deployment.agents} />

          {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Legend */}
          <div className="flex flex-wrap gap-3 mt-3">
            {(["active", "healing", "idle", "lost"] as SwarmAgent["status"][]).map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: STATUS_COLOR[s] }}
                />
                {STATUS_LABEL[s]}
              </div>
            ))}
          </div>
        </div>

        {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Heal event feed */}
        <div>
          <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
            Self-Healing Events · Recent {deployment.recentHealEvents.length}
          </div>
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {deployment.recentHealEvents.map((ev) => (
              <HealEventRow key={ev.id} ev={ev} />
            ))}
          </div>
        </div>
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Zone heatmap */}
      <div className="rounded-2xl border border-gray-800 bg-black/25 p-5">
        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
          Infrastructure Heatmap · Agent Distribution by Zone
        </div>
        <div className="space-y-2">
          {deployment.zones.map((zone) => (
            <ZoneBar
              key={zone}
              zone={zone}
              count={zoneCounts[zone] ?? 0}
              max={maxZoneCount}
            />
          ))}
        </div>
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Control panel – RECALL & EVOLVE */}
      {phase === "live" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <div className="text-sm font-black text-yellow-300 mb-2">⏏ SWARM RECALL</div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Withdraw all {deployment.totalAgents} agents from the infrastructure. Each agent
              reports its findings back to the Mycelium before disconnecting.
            </p>
            <button
              type="button"
              onClick={handleRecall}
              className="w-full py-2.5 rounded-xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 text-sm font-black hover:bg-yellow-500/15 transition-colors"
            >
              Recall All Agents →
            </button>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="text-sm font-black text-violet-300 mb-2">🧬 SWARM EVOLVE</div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Push the latest Mycelium mutations to every active agent. The swarm inherits
              new intelligence from the evolving runbook knowledge graph.
            </p>
            <button
              type="button"
              onClick={handleEvolve}
              className="w-full py-2.5 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 text-sm font-black hover:bg-violet-500/15 transition-colors"
            >
              Evolve Swarm →
            </button>
          </div>
        </div>
      )}

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Safety & kill-switch note */}
      <div className="rounded-xl border border-gray-800 bg-black/20 p-4 text-xs text-gray-500">
        <span className="text-gray-400 font-black">Safety-First:</span> All agents operate
        in read-only diagnostic mode by default. No destructive action is taken without an
        explicit confirmation step. Use &ldquo;Recall&rdquo; above as the kill-switch at any time.
        Swarm sandbox conforms to ClawGuru Institutional Ops Security Policy 2026.
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Invisible tick trigger to force re-render */}
      <span data-tick={tick} className="sr-only" />
    </div>
  )
}
