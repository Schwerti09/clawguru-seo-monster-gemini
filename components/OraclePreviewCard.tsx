"use client"

import React, { useEffect, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import Skeleton from "./ui/Skeleton"
import { useI18n } from "@/components/i18n/I18nProvider"

type Risk = {
  cve_id: string
  title: string
  severity: "Critical" | "High" | "Medium"
  probability: number
  description: string
  recommended_runbook?: { slug: string; title: string; clawScore: number } | null
}

type Props = { prefix?: string }

const DEMO_THREATS: Risk[] = [
  {
    cve_id: "CVE-2026-1337",
    title: "OpenSSH pre‑auth RCE",
    severity: "Critical",
    probability: 91,
    description: "Pre‑auth code execution in OpenSSH daemon under specific KEX paths.",
    recommended_runbook: { slug: "openssh-rce-hardening-2026", title: "OpenSSH Emergency Patch", clawScore: 98 },
  },
  {
    cve_id: "CVE-2026-2048",
    title: "XZ Utils supply‑chain backdoor",
    severity: "High",
    probability: 78,
    description: "Backdoored liblzma pipeline enabling remote code exec in SSH auth path.",
    recommended_runbook: { slug: "xz-supply-chain-mitigation-2026", title: "XZ Backdoor Mitigation", clawScore: 96 },
  },
  {
    cve_id: "CVE-2025-9876",
    title: "Nginx HTTP/2 rapid reset DoS",
    severity: "High",
    probability: 64,
    description: "Resource exhaustion via HTTP/2 stream abuse on unpatched reverse proxies.",
    recommended_runbook: { slug: "nginx-http2-dos-hardening-2026", title: "Nginx HTTP/2 DoS Hardening", clawScore: 94 },
  },
  {
    cve_id: "CVE-2026-2718",
    title: "Kubernetes RBAC privilege escalation",
    severity: "Medium",
    probability: 42,
    description: "Misconfigured ClusterRoles allow unauthorized workload mutations.",
    recommended_runbook: { slug: "k8s-rbac-audit-2026", title: "K8s RBAC Audit & Lockdown", clawScore: 92 },
  },
]

const RADAR_POINTS: Array<{ x: number; y: number; lvl: 1 | 2 | 3 }> = [
  { x: 18, y: 32, lvl: 3 },
  { x: 62, y: 24, lvl: 2 },
  { x: 72, y: 62, lvl: 1 },
  { x: 28, y: 68, lvl: 2 },
  { x: 45, y: 48, lvl: 3 },
  { x: 84, y: 38, lvl: 2 },
  { x: 12, y: 58, lvl: 1 },
  { x: 52, y: 20, lvl: 2 },
]

export default function OraclePreviewCard({ prefix = "" }: Props) {
  const { dict } = useI18n()
  const p = (dict as any)?.previews ?? {}
  const t = {
    desc: p.oracleDesc || "What threats are coming your way? Oracle warns in time – with clear next steps.",
    init: p.oracleInit || "Initializing Oracle…",
    active: p.oracleActive || "Active",
    next: p.oracleNext || "Next",
    safety: p.oracleSafety || "Security",
    inputLabel: p.oracleInputLabel || "Enter your domain/IP",
    placeholder: p.oraclePlaceholder || "e.g. example.com",
    analyze: p.oracleAnalyze || "Analyze",
    patchNow: p.oraclePatchNow || "Patch now",
    runbook: p.oracleRunbook || "Start runbook",
    notify: p.oracleNotify || "Notify team",
    details: p.oracleDetails || "View details",
    warning: p.oracleWarning || "Warning for {target}: {title} ({cve}) – Risk {prob}%",
  }

  const [ready, setReady] = useState(false)
  const [feedIdx, setFeedIdx] = useState(0)
  const [input, setInput] = useState("")
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    // Mount-only: enable animations and start feed rotator
    setReady(true)
    const id = setInterval(() => setFeedIdx((v) => (v + 1) % DEMO_THREATS.length), 3500)
    return () => clearInterval(id)
  }, [])

  const active = DEMO_THREATS[feedIdx]

  function simulateCheck() {
    if (!input.trim()) return
    const msg = t.warning
      .replace("{target}", input.trim())
      .replace("{title}", active.title)
      .replace("{cve}", active.cve_id)
      .replace("{prob}", String(active.probability))
    setWarning(msg)
  }

  return (
    <div>
      <FeaturePreviewCard
        title="Oracle"
        description={t.desc}
        link={`${prefix}/oracle`}
      >
        {!ready ? (
          <div className="h-96 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs text-gray-500 mb-3">{t.init}</div>
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-64 col-span-2" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {/* Left: Futuristic radar */}
            <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-black/60 to-black/20 p-4 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "auto 3px" }} />
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                {/* concentric circles */}
                {[1,2,3,4].map((i) => (
                  <div key={i} className="absolute inset-0 rounded-full" style={{
                    border: "1px solid rgba(56,189,248,0.25)",
                    transform: `scale(${1 - i*0.12})`,
                    transformOrigin: "center",
                  }} />
                ))}
                {/* scanning arc */}
                <div className="absolute inset-0 rounded-full animate-[spin_7s_linear_infinite]" style={{
                  background: "conic-gradient(from 0deg, rgba(56,189,248,0.0) 0deg, rgba(56,189,248,0.35) 60deg, rgba(56,189,248,0.0) 85deg)",
                  WebkitMaskImage: "radial-gradient(circle at center, transparent 28%, black 29%)",
                  maskImage: "radial-gradient(circle at center, transparent 28%, black 29%)",
                }} />
                {/* radar points */}
                {RADAR_POINTS.map((rp, i) => (
                  <div key={i} className="absolute" style={{ left: `${rp.x}%`, top: `${rp.y}%` }}>
                    <span className={`block rounded-full ${rp.lvl===3?"h-2.5 w-2.5 bg-cyan-300":"h-2 w-2 bg-cyan-400"}`} />
                    <span className={`absolute inset-0 rounded-full ${rp.lvl===3?"animate-ping" : "animate-pulse"} ${rp.lvl===3?"bg-cyan-300/40":"bg-cyan-400/30"}`} />
                  </div>
                ))}
              </div>
              {/* Stats overlay */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-2">
                  <div className="text-xs text-cyan-300">{t.active}</div>
                  <div className="text-base font-black text-white">1.247</div>
                </div>
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-2">
                  <div className="text-xs text-violet-300">{t.next}</div>
                  <div className="text-base font-black text-white">47h</div>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2">
                  <div className="text-xs text-emerald-300">{t.safety}</div>
                  <div className="text-base font-black text-white">98,4%</div>
                </div>
              </div>
            </div>

            {/* Right: Threat feed + actions */}
            <div className="flex flex-col gap-3">
              {/* Live-like feed */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">Live Threat Feed</div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, k) => {
                    const r = DEMO_THREATS[(feedIdx + k) % DEMO_THREATS.length]
                    const bar = r.probability
                    const sevColor = r.severity === "Critical" ? "text-red-400" : r.severity === "High" ? "text-yellow-300" : "text-emerald-300"
                    const barColor = r.severity === "Critical" ? "bg-red-500" : r.severity === "High" ? "bg-yellow-400" : "bg-emerald-400"
                    return (
                      <a key={r.cve_id} href={`https://nvd.nist.gov/vuln/detail/${encodeURIComponent(r.cve_id)}`} target="_blank" rel="noreferrer" className="group block p-3 rounded-xl border border-white/10 bg-black/30 hover:border-cyan-400/30 transition-colors relative">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-mono text-gray-400">{r.cve_id}</div>
                          <div className={`ml-auto text-[11px] ${sevColor}`}>{r.severity}</div>
                          <div className="text-[11px] text-gray-400">{r.probability}%</div>
                        </div>
                        <div className="text-sm text-gray-200 mt-0.5 line-clamp-1">{r.title}</div>
                        <div className="w-full h-1 bg-gray-800 rounded-full mt-2">
                          <div className={`h-1 rounded-full ${barColor}`} style={{ width: `${bar}%` }} />
                        </div>
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute left-3 right-3 top-full mt-1 hidden group-hover:block">
                          <div className="rounded-xl border border-cyan-500/20 bg-black/80 backdrop-blur p-2">
                            <div className="text-[11px] text-gray-300">{r.description}</div>
                            {r.recommended_runbook && (
                              <div className="mt-1 text-[10px] text-cyan-300">
                                ClawScore {r.recommended_runbook.clawScore} · {r.recommended_runbook.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Mini input */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <div className="text-xs text-gray-400 mb-2">{t.inputLabel}</div>
                <div className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.placeholder} className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
                  <button onClick={simulateCheck} className="px-3 py-2 rounded-xl font-bold text-sm text-black" style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)" }}>{t.analyze}</button>
                </div>
                {warning && (
                  <div className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs p-2">{warning}</div>
                )}
              </div>

              {/* Next steps */}
              <div className="grid grid-cols-2 gap-2">
                <a href={active.recommended_runbook ? `${prefix}/runbook/${active.recommended_runbook.slug}` : `${prefix}/oracle`} className="px-3 py-2 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-rose-500/70 to-red-600/70 hover:from-rose-500 hover:to-red-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.25)]">{t.patchNow}</a>
                <a href={active.recommended_runbook ? `${prefix}/runbook/${active.recommended_runbook.slug}` : `${prefix}/oracle`} className="px-3 py-2 rounded-xl text-center text-sm font-bold text-white bg-gradient-to-r from-cyan-500/70 to-violet-600/70 hover:from-cyan-500 hover:to-violet-600 transition-all active:scale-95 shadow-[0_0_20px_rgba(56,189,248,0.25)]">{t.runbook}</a>
                <a href={`${prefix}/command-center`} className="px-3 py-2 rounded-xl text-center text-sm font-bold text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-500/10 transition-all active:scale-95">{t.notify}</a>
                <a href={`${prefix}/oracle`} className="px-3 py-2 rounded-xl text-center text-sm font-bold text-gray-200 border border-white/15 hover:border-white/30 bg-white/5 transition-all active:scale-95">{t.details}</a>
              </div>
            </div>
          </div>
        )}
      </FeaturePreviewCard>
    </div>
  )
}
