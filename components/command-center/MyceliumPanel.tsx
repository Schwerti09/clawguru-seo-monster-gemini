"use client"

import { useState, useMemo, useCallback } from "react"
import dynamic from "next/dynamic"
import type { MyceliumNode, NodeType } from "./MyceliumCanvas"
import { EDGE_DISTANCE_THRESHOLD } from "./MyceliumCanvas"

// ─── Lazy-load the R3F canvas (WebGL, no SSR) ────────────────────────────────
const MyceliumCanvas = dynamic(() => import("./MyceliumCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin" />
        <span className="text-xs text-gray-500 tracking-widest font-mono uppercase">Initialisiere Canvas…</span>
      </div>
    </div>
  ),
})

// ─── Demo / synthetic node data ──────────────────────────────────────────────
function buildNodes(): MyceliumNode[] {
  const specs: Array<{ type: NodeType; label: string; description: string; severity?: MyceliumNode["severity"] }> = [
    // threats
    { type: "threat", label: "CVE-2024-3094", description: "XZ Utils Backdoor", severity: "critical" },
    { type: "threat", label: "CVE-2024-6387", description: "OpenSSH RegreSSHion RCE", severity: "critical" },
    { type: "threat", label: "CVE-2025-0282", description: "Ivanti Stack Overflow", severity: "high" },
    { type: "threat", label: "Brute Force #77", description: "SSH – 143.198.x.x", severity: "high" },
    { type: "threat", label: "Log4Shell", description: "JNDI Exploit detected", severity: "critical" },
    // runbooks
    { type: "runbook", label: "SSH Hardening", description: "Disable root login, enforce keys" },
    { type: "runbook", label: "Nginx TLS 1.3", description: "HSTS + Perfect Forward Secrecy" },
    { type: "runbook", label: "Docker Bench", description: "CIS Docker Benchmark v1.6" },
    { type: "runbook", label: "Vault Seal", description: "Auto-unseal + audit device" },
    { type: "runbook", label: "K8s RBAC", description: "Least-privilege service accounts" },
    { type: "runbook", label: "WAF Rules", description: "OWASP Core Rule Set v4" },
    { type: "runbook", label: "Falco Alert", description: "Runtime threat detection rules" },
    // security
    { type: "security", label: "Header Scan", description: "CSP + HSTS evaluated" },
    { type: "security", label: "TLS Audit", description: "A+ SSL Labs grade" },
    { type: "security", label: "SBOM Check", description: "Trivy – 0 critical vulns" },
    { type: "security", label: "Secrets Scan", description: "Gitleaks – clean" },
    { type: "security", label: "Pen-Test Gate", description: "DAST baseline passed" },
    // infrastructure
    { type: "infrastructure", label: "nginx:alpine", description: "v1.27.0 – healthy" },
    { type: "infrastructure", label: "postgres:16", description: "RDS – us-east-1a" },
    { type: "infrastructure", label: "redis:7", description: "TLS + auth required" },
    { type: "infrastructure", label: "k8s-node-01", description: "Ready – 4 vCPU / 16 GB" },
    { type: "infrastructure", label: "k8s-node-02", description: "Ready – 4 vCPU / 16 GB" },
    { type: "infrastructure", label: "traefik", description: "Edge proxy – v2.11" },
    // compliance
    { type: "compliance", label: "NIS2 Art. 21", description: "Incident response SLA met" },
    { type: "compliance", label: "GDPR Art. 32", description: "Encryption-at-rest ✓" },
    { type: "compliance", label: "SOC 2 CC7", description: "Monitoring controls ✓" },
    { type: "compliance", label: "ISO 27001 A.12", description: "Ops security ✓" },
  ]

  const rng = (s: number) => {
    let x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  return specs.map((s, i) => ({
    id: `node-${i}`,
    ...s,
    position: [
      (rng(i * 3 + 1) - 0.5) * 7.5,
      (rng(i * 3 + 2) - 0.5) * 5.5,
      (rng(i * 3 + 3) - 0.5) * 4.5,
    ] as [number, number, number],
    speed: 0.25 + rng(i * 7) * 0.55,
    phase: rng(i * 13) * Math.PI * 2,
    size: s.type === "threat" ? (s.severity === "critical" ? 1.5 : 1.25) : 1,
  }))
}

const ALL_NODES = buildNodes()

// ─── Node type config ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<NodeType, { label: string; color: string; activeClasses: string; inactiveClasses: string }> = {
  threat:         { label: "Threats",        color: "#ff4444", activeClasses: "bg-red-900/60 border-red-500/60 text-red-300",        inactiveClasses: "bg-black/30 border-white/10 text-gray-500 hover:text-gray-300" },
  runbook:        { label: "Runbooks",       color: "#00b8ff", activeClasses: "bg-blue-900/50 border-blue-500/50 text-blue-300",       inactiveClasses: "bg-black/30 border-white/10 text-gray-500 hover:text-gray-300" },
  security:       { label: "Security",       color: "#00ff9d", activeClasses: "bg-emerald-900/50 border-emerald-500/50 text-emerald-300", inactiveClasses: "bg-black/30 border-white/10 text-gray-500 hover:text-gray-300" },
  infrastructure: { label: "Infra",          color: "#c9a84c", activeClasses: "bg-yellow-900/50 border-yellow-600/50 text-yellow-300",  inactiveClasses: "bg-black/30 border-white/10 text-gray-500 hover:text-gray-300" },
  compliance:     { label: "Compliance",     color: "#8b6cdf", activeClasses: "bg-violet-900/50 border-violet-500/50 text-violet-300",  inactiveClasses: "bg-black/30 border-white/10 text-gray-500 hover:text-gray-300" },
}

const ALL_TYPES = Object.keys(TYPE_CONFIG) as NodeType[]

// ─── Icon helpers ────────────────────────────────────────────────────────────
function Icon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    play: "▶",
    pause: "⏸",
    reset: "⟳",
    fullscreen: "⛶",
    exitFullscreen: "✕",
    nodes: "◉",
    edges: "⟋",
    alert: "⚠",
    book: "📋",
  }
  return <span>{icons[name] ?? name}</span>
}

// ─── StatBadge ───────────────────────────────────────────────────────────────
function StatBadge({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/8">
      <span style={{ color }} className="text-sm">{icon}</span>
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-bold text-gray-100 tabular-nums">{value}</span>
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────────
export default function MyceliumPanel() {
  const [visibleTypes, setVisibleTypes] = useState<Set<NodeType>>(new Set(ALL_TYPES))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rotating, setRotating] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  const toggleType = useCallback((t: NodeType) => {
    setVisibleTypes((prev) => {
      const isLastVisible = prev.size === 1 && prev.has(t)
      if (isLastVisible) return prev // keep at least one type visible
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
    setSelectedId(null)
  }, [])

  const resetView = useCallback(() => {
    setSelectedId(null)
    setVisibleTypes(new Set(ALL_TYPES))
  }, [])

  // Stats
  const stats = useMemo(() => {
    const visible = ALL_NODES.filter((n) => visibleTypes.has(n.type))
    const threatCount = ALL_NODES.filter((n) => n.type === "threat").length
    const criticalCount = ALL_NODES.filter((n) => n.type === "threat" && n.severity === "critical").length
    let edges = 0
    const threshold = EDGE_DISTANCE_THRESHOLD
    for (let i = 0; i < visible.length; i++) {
      for (let j = i + 1; j < visible.length; j++) {
        const [ax, ay, az] = visible[i].position
        const [bx, by, bz] = visible[j].position
        const dist = Math.sqrt((bx - ax) ** 2 + (by - ay) ** 2 + (bz - az) ** 2)
        if (dist < threshold) edges++
      }
    }
    return { nodes: visible.length, edges, threats: threatCount, critical: criticalCount }
  }, [visibleTypes])

  const selectedNode = useMemo(
    () => (selectedId ? ALL_NODES.find((n) => n.id === selectedId) ?? null : null),
    [selectedId]
  )

  const canvasHeight = fullscreen ? "h-[calc(100vh-180px)]" : "h-[440px]"

  return (
    <div className={`rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex flex-col gap-0 ${fullscreen ? "fixed inset-4 z-50" : ""}`}>
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#00ff9d]">Live Mycelium</span>
          <span className="text-xs text-gray-600 font-mono">— Threat &amp; Infrastructure Network</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRotating((r) => !r)}
            title={rotating ? "Rotation pausieren" : "Rotation starten"}
            className={`px-2 py-1 rounded-lg text-xs border transition-colors ${rotating ? "bg-cyan-900/40 border-cyan-600/40 text-cyan-300" : "bg-black/30 border-white/10 text-gray-400 hover:text-gray-200"}`}
          >
            <Icon name={rotating ? "pause" : "play"} /> {rotating ? "Pause" : "Play"}
          </button>
          <button
            onClick={resetView}
            title="View zurücksetzen"
            className="px-2 py-1 rounded-lg text-xs border border-white/10 bg-black/30 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Icon name="reset" /> Reset
          </button>
          <button
            onClick={() => setFullscreen((f) => !f)}
            title={fullscreen ? "Vollbild verlassen" : "Vollbild"}
            className="px-2 py-1 rounded-lg text-xs border border-white/10 bg-black/30 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <Icon name={fullscreen ? "exitFullscreen" : "fullscreen"} />
          </button>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex items-center gap-2 px-4 py-2 flex-wrap border-b border-white/6">
        <span className="text-[10px] font-mono uppercase text-gray-600 mr-1">Filter:</span>
        {ALL_TYPES.map((t) => {
          const cfg = TYPE_CONFIG[t]
          const active = visibleTypes.has(t)
          const count = ALL_NODES.filter((n) => n.type === t).length
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${active ? cfg.activeClasses : cfg.inactiveClasses}`}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: active ? cfg.color : "#4b5563" }} />
              {cfg.label}
              <span className={`ml-0.5 tabular-nums ${active ? "opacity-80" : "opacity-40"}`}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* ── Canvas ── */}
      <div className={`relative w-full ${canvasHeight} transition-all duration-300`}>
        <MyceliumCanvas
          nodes={ALL_NODES}
          selectedId={selectedId}
          visibleTypes={visibleTypes}
          rotating={rotating}
          onSelect={setSelectedId}
        />

        {/* Overlay hint */}
        <div className="absolute bottom-3 right-3 text-[10px] text-gray-600 font-mono pointer-events-none select-none">
          Klick = Node-Details · Scrollen = Zoom · Ziehen = Drehen
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center flex-wrap gap-2 px-4 py-2.5 border-t border-white/6">
        <StatBadge icon="◉" label="Nodes" value={stats.nodes} color="#00b8ff" />
        <StatBadge icon="⟋" label="Verbindungen" value={stats.edges} color="#8b6cdf" />
        <StatBadge icon="⚠" label="Threats" value={stats.threats} color="#ff4444" />
        <StatBadge icon="🔴" label="Critical" value={stats.critical} color="#ff6666" />
        <div className="ml-auto text-[10px] text-gray-600 font-mono">
          {stats.nodes} / {ALL_NODES.length} sichtbar
        </div>
      </div>

      {/* ── Selected node detail ── */}
      {selectedNode && (
        <div
          className="mx-4 mb-4 p-4 rounded-xl border flex items-start gap-4"
          style={{
            background: "rgba(5,5,5,0.7)",
            borderColor: TYPE_CONFIG[selectedNode.type].color + "44",
            boxShadow: `0 0 20px ${TYPE_CONFIG[selectedNode.type].color}22`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: TYPE_CONFIG[selectedNode.type].color, boxShadow: `0 0 8px ${TYPE_CONFIG[selectedNode.type].color}` }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-100 text-sm">{selectedNode.label}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase"
                style={{ background: TYPE_CONFIG[selectedNode.type].color + "22", color: TYPE_CONFIG[selectedNode.type].color }}
              >
                {TYPE_CONFIG[selectedNode.type].label}
              </span>
              {selectedNode.severity && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${selectedNode.severity === "critical" ? "bg-red-900/60 text-red-300" : selectedNode.severity === "high" ? "bg-orange-900/60 text-orange-300" : "bg-yellow-900/60 text-yellow-300"}`}>
                  {selectedNode.severity}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{selectedNode.description}</p>
          </div>
          <button
            onClick={() => setSelectedId(null)}
            className="text-gray-600 hover:text-gray-300 text-lg leading-none flex-shrink-0 transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

