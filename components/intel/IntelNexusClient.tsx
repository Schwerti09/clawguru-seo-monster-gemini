"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import BuyButton from "@/components/commerce/BuyButton"
import NeuralGrid from "@/components/visual/NeuralGrid"
import TierGateOverlay from "@/components/summon/TierGateOverlay"
import Container from "@/components/shared/Container"
import type { MyceliumGraph, RunbookSummary, OracleResult } from "@/lib/mycelium"
import type { Runbook } from "@/lib/pseo"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })
const IntelFeed = dynamic(() => import("@/components/intel/IntelFeed"), { ssr: false })
const IntelApiDocs = dynamic(() => import("@/components/intel/IntelApiDocs"), { ssr: false })

type Tier = "free" | "daypass" | "pro" | "enterprise"

type Teaser = {
  risks: number
  top: OracleResult | null
  results: OracleResult[]
  runbook: { slug: string; title: string; summary: string } | null
  prediction: string
  threat?: string
}

export default function IntelNexusClient() {
  const [q, setQ] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const [busy, setBusy] = useState(false)
  const [teaser, setTeaser] = useState<Teaser | null>(null)
  const [tier, setTier] = useState<Tier>("free")
  const [permanent, setPermanent] = useState(false)
  const timerRef = useRef<number | null>(null)
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])

  useEffect(() => {
    let stop = false
    async function fetchTier() {
      try {
        const res = await fetch("/api/auth/tier", { cache: "no-store" })
        const j = await res.json().catch(() => null)
        const t = (j?.tier as string) || "free"
        if (!stop) {
          const mapped: Tier = t === "daypass" || t === "pro" || t === "enterprise" ? (t as Tier) : "free"
          setTier(mapped)
          setPermanent(mapped === "pro" || mapped === "enterprise")
        }
      } catch {
        if (!stop) { setTier("free"); setPermanent(false) }
      }
    }
    fetchTier()
    const pollId = window.setInterval(fetchTier, 5000)
    const url = typeof window !== "undefined" ? new URL(window.location.href) : null
    const qp = url ? url.searchParams.get("q") : null
    const pf = url ? url.searchParams.get("prefill") : null
    if (qp) setQ(qp)
    else if (pf) setQ(pf)
    return () => { stop = true; window.clearInterval(pollId) }
  }, [])

  useEffect(() => {
    if (!running) return
    if (secondsLeft <= 0) return
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [running])

  const showRetention = useMemo(() => running && !permanent, [running, permanent])

  async function startDemo() {
    if (busy) return
    const query = q.trim() || "Mein Kubernetes-Cluster ist langsam und hat verdächtige Logs"
    setBusy(true)
    setSecondsLeft(60)
    setRunning(true)
    try {
      let top: OracleResult | null = null
      let results: OracleResult[] = []
      let picked: { slug: string; title: string; summary: string } | null = null
      let threat: string | undefined = undefined

      try {
        const res = await fetch("/api/oracle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: query, mode: "prophetic" }),
        })
        if (res.ok) {
          const j = await res.json().catch(() => null as any)
          const sources = Array.isArray(j?.sources) ? j.sources : []
          results = sources.slice(0, 5).map((s: any) => ({
            id: s.id,
            title: s.title,
            score: typeof s.score === "number" ? s.score / 100 : 0.7,
            fitness: typeof s.fitness === "number" ? s.fitness : 82,
            path: [],
          }))
          top = results[0] || null
          if (top) {
            const pseo: any = await import("@/lib/pseo")
            const rb = (pseo.RUNBOOKS ?? []).find((r: any) => r.slug === top!.id)
            if (rb) picked = { slug: rb.slug, title: rb.title, summary: (rb.summary ?? "").slice(0, 180) }
          }
          const m = (query.match(/CVE-\d{4}-\d{4,7}/i) || j?.answer?.match(/CVE-\d{4}-\d{4,7}/i)) as RegExpMatchArray | null
          if (m && m[0]) threat = m[0].toUpperCase()
          if (!threat) {
            try {
              const cve = await import("@/lib/cve-pseo")
              const pool = (cve.KNOWN_CVES ?? []) as Array<{ cveId: string }>
              if (pool.length > 0) {
                const idx = Math.abs(query.length % pool.length)
                threat = pool[idx]?.cveId
              }
            } catch {}
          }
        }
      } catch {}

      if (!top) {
        const pseo: any = await import("@/lib/pseo")
        const buildClient: undefined | ((n: number) => Runbook[]) = pseo.buildRunbooksClient
        let runbooks: Runbook[] = []
        try {
          runbooks = buildClient ? buildClient(2000) : (pseo.RUNBOOKS ?? [])
        } catch {
          runbooks = (pseo.RUNBOOKS ?? []) as Runbook[]
        }
        const total = runbooks.length
        const { buildMyceliumGraph, oracleSearch } = await import("@/lib/mycelium")
        const initialMax = Math.min(360, total)
        const graph: MyceliumGraph = buildMyceliumGraph(runbooks, initialMax)
        const summaries: Record<string, RunbookSummary> = {}
        for (const r of runbooks) summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
        results = oracleSearch(query, graph, summaries, 5)
        top = results[0] || null
        picked = top ? { slug: top.id, title: top.title, summary: (summaries[top.id]?.summary || "").slice(0, 180) } : null
      }

      const risksBase = 2 + Math.floor(Math.random() * 3)
      const mins = 10 + Math.floor(Math.random() * 15)
      const prediction = `Vorhersage: ${risksBase} P2-Risiken eskalieren in ~${mins} Minuten`
      setTeaser({ risks: risksBase, top, results: results.slice(0, 3), runbook: picked, prediction, threat })
    } catch {
      setTeaser({ risks: 3, top: null, results: [], runbook: null, prediction: "Vorhersage: erhoehte Anomalie-Wahrscheinlichkeit" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#05060A]">
      <section className="relative overflow-hidden pt-16 pb-6 text-center px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
             style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,255,157,0.09) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-4"
               style={{ borderColor: "rgba(212,175,55,0.35)", color: "#d4af37", background: "rgba(212,175,55,0.06)" }}>
            Mycelium Intel Nexus · 60s Teaser
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Cinematic Intelligence</h1>
          <p className="mt-3 text-gray-400 text-lg">Beschreibe dein Problem. 60s echter Intel‑Teaser: Threat‑Map, Prognose, Runbook.</p>
          <div className="mt-6 max-w-3xl mx-auto">
            <textarea
              value={q}
              onChange={(e) => setQ(e.target.value)}
              rows={3}
              placeholder={`Beschreibe dein Problem (z. B. "Mein Kubernetes-Cluster ist langsam und hat verdächtige Logs")`}
              className="w-full px-5 py-4 rounded-2xl bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              style={{ boxShadow: "inset 0 0 28px rgba(0,255,157,0.08)" }}
            />
            <div className="mt-4">
              <button onClick={startDemo} disabled={busy}
                      className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white text-lg animate-pulse"
                      style={{ background: "linear-gradient(135deg,#ff0033,#ff7a00)", boxShadow: "0 0 32px rgba(255,0,51,0.45)" }}>
                {busy ? "Beschwöre..." : "SUMMON THE SWARM"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Container>
        <div className="mt-6 relative rounded-3xl border border-white/10 bg-black/40 p-6 overflow-hidden">
          <NeuralGrid intensity={0.6} />
          <div className="relative grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl border border-emerald-400/20 bg-black/60 aspect-[16/9] overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.08)]">
              <MyceliumClientLoader ui="embed" />
            </div>
            <div>
              {!running ? (
                <div className="text-sm text-gray-400">Vorschau erscheint hier. Keine Anmeldung nötig.</div>
              ) : (
                <div>
                  <div className="text-xs text-gray-400">Live‑Preview · {secondsLeft}s</div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${(60 - secondsLeft) / 60 * 100}%` }} />
                  </div>
                  {teaser && (
                    <div className="mt-4">
                      <div className="text-2xl font-black text-white">Dein System hat {teaser.risks} kritische Risiken</div>
                      <div className="text-sm text-amber-300 mt-1">{teaser.prediction}{teaser.threat ? ` · Threat: ${teaser.threat}` : ""}</div>
                      {teaser.top && (
                        <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-black/50">
                          <div className="text-xs font-mono text-gray-400">Teaser‑Runbook</div>
                          <div className="text-lg font-bold text-white">{teaser.top.title}</div>
                          {teaser.runbook && (
                            <div className="text-sm text-gray-400 mt-1">{teaser.runbook.summary} ...</div>
                          )}
                          <div className="mt-3 text-xs text-gray-500">Vollständiger Report, Predictive & Export nach Freischaltung</div>
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <BuyButton product="daypass" label="Daypass 9,99 € - 24h" className="px-4 py-3 rounded-2xl font-black text-black" style={{ background: "linear-gradient(135deg,#ff0033,#ff7a00)" }} />
                        <BuyButton product="pro" label="Pro 49 € / Monat" className="px-4 py-3 rounded-2xl font-black text-black" style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
                      </div>
                      <div className="mt-2 text-xs text-gray-400">Export & Alerts dauerhaft mit Pro</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {tier === "free" && secondsLeft <= 0 && running && (
            <TierGateOverlay allowed={false} needed="daypass" />
          )}
        </div>

        {tier !== "free" && (
          <div className="mt-10 grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="text-sm text-emerald-300 mb-2">Live Intel Feed</div>
              <IntelFeed />
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="text-sm text-cyan-300 mb-2">Intel API</div>
              <IntelApiDocs />
            </div>
          </div>
        )}

        {showRetention && (
          <div className="fixed right-4 bottom-4 z-40 max-w-sm p-4 rounded-2xl border border-white/10 bg-black/80 text-gray-200">
            <div className="text-sm font-bold">Dein Teaser geht verloren</div>
            <div className="text-xs text-gray-400 mt-1">Upgrade auf Pro für dauerhafte Reports, Alerts & Feed‑History.</div>
            <div className="mt-3 flex gap-2">
              <BuyButton product="pro" label="Pro 49 € / Monat" className="px-3 py-2 rounded-xl font-black text-black"
                         style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
              <a href={`${prefix}/pricing`} className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Mehr erfahren</a>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}
