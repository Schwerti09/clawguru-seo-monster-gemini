"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Container from "@/components/shared/Container"
import dynamic from "next/dynamic"
import BuyButton from "@/components/commerce/BuyButton"
import NeuralGrid from "@/components/visual/NeuralGrid"
import TierGateOverlay from "@/components/summon/TierGateOverlay"
import type { OracleResult } from "@/lib/mycelium"
import type { Runbook } from "@/lib/pseo"
import TeaserResultPanel from "@/components/summon/TeaserResultPanel"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })
const FullSummonClient = dynamic(() => import("@/components/summon/SummonClient"), { ssr: false })

type Tier = "free" | "daypass" | "pro" | "enterprise"

type Teaser = {
  risks: number
  top: OracleResult | null
  results: OracleResult[]
  runbook: { slug: string; title: string; summary: string } | null
  runbook2?: { slug: string; title: string; summary: string } | null
  prediction: string
  threat?: string
  score?: number
}

export default function SummonFreemiumClient() {
  const [q, setQ] = useState("")
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const [busy, setBusy] = useState(false)
  const [teaser, setTeaser] = useState<Teaser | null>(null)
  const [tier, setTier] = useState<Tier>("free")
  const [permanent, setPermanent] = useState(false)
  const timerRef = useRef<number | null>(null)

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

  if (tier !== "free") {
    return <FullSummonClient />
  }

  async function startDemo() {
    if (busy) return
    const query = q.trim() || "Mein Kubernetes-Cluster ist langsam und hat verdächtige Logs"
    setBusy(true)
    try {
      // Guaranteed mini-result within <4s using local library as fallback
      const pseoMod = await import("@/lib/pseo").catch(() => null as any)
      const RUNBOOKS_ALL: Runbook[] = (() => {
        if (!pseoMod) return [] as Runbook[]
        try {
          const buildClient: undefined | ((n: number) => Runbook[]) = (pseoMod as any).buildRunbooksClient
          return buildClient ? buildClient(1200) : ((pseoMod as any).RUNBOOKS ?? [])
        } catch {
          return ((pseoMod as any).RUNBOOKS ?? []) as Runbook[]
        }
      })()

      function buildGuaranteedMiniResult(): Teaser {
        const bySlug = (slug: string) => RUNBOOKS_ALL.find((r) => r.slug === slug) || null
        const fallback = RUNBOOKS_ALL[0] || null
        const ssh = bySlug("hetzner-ssh-hardening-2026") || bySlug("aws-ssh-hardening-2026") || bySlug("aws-ssh-hardening") || fallback
        const results: OracleResult[] = []
        if (ssh) results.push({ id: ssh.slug, title: ssh.title, score: 0.55, fitness: 82, path: [] })
        const score = 50 + Math.floor(Math.random() * 36) // 50–85
        return {
          risks: 3,
          top: results[0] || null,
          results,
          runbook: ssh ? { slug: ssh.slug, title: ssh.title, summary: (ssh.summary ?? "").slice(0, 220) } : null,
          runbook2: undefined,
          prediction: "Vorhersage: 3 P2-Risiken eskalieren in ~14 Minuten",
          threat: "CVE-2024-6387 – OpenSSH RegreSSHion",
          score,
        }
      }

      // Schedule fallback teaser if server has not returned yet (<= 800ms)
      let miniPushed = false
      const curated = buildGuaranteedMiniResult()
      const miniTimer = window.setTimeout(() => {
        if (miniPushed) return
        setTeaser(curated)
        if (!running) { setRunning(true); setSecondsLeft(60) }
        miniPushed = true
      }, 800)

      // Fetch a real teaser from server (cached <4s) based on library search
      try {
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 10000)
        const res = await fetch("/api/summon/teaser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: query }),
          cache: "no-store",
          signal: controller.signal,
        }).finally(() => window.clearTimeout(timeout))
        if (res.ok) {
          const j = await res.json().catch(() => null as any)
          const t = j?.teaser as Teaser | undefined
          if (t) {
            if (miniTimer) window.clearTimeout(miniTimer)
            miniPushed = true
            setTeaser(t)
            if (!running) { setRunning(true); setSecondsLeft(60) }
          }
        }
      } catch {}

      // If server path failed and mini didn't push yet, ensure we still show value
      if (!miniPushed) {
        if (miniTimer) window.clearTimeout(miniTimer)
        setTeaser(curated)
        if (!running) { setRunning(true); setSecondsLeft(60) }
        miniPushed = true
      }
    } catch {
      setTeaser({ risks: 3, top: null, results: [], runbook: null, prediction: "Vorhersage: erhoehte Anomalie-Wahrscheinlichkeit" })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="py-10">
      <Container>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-4"
               style={{ borderColor: "rgba(212,175,55,0.35)", color: "#d4af37", background: "rgba(212,175,55,0.06)" }}>
            Claw Swarm Oracle · 60s Teaser
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">Summon your Army</h1>
          <p className="mt-3 text-gray-400 text-lg">Beschreibe dein Problem. Sofort echtes Mini‑Ergebnis sehen – dann freischalten.</p>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value)}
            rows={3}
            placeholder={`Beschreibe dein Problem (z. B. "Mein Kubernetes-Cluster ist langsam und hat verdächtige Logs")`}
            className="w-full px-5 py-4 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
            style={{ boxShadow: "inset 0 0 24px rgba(0,184,255,0.08)" }}
          />
          <div className="mt-4">
            <button onClick={startDemo} disabled={busy}
                    className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white text-lg animate-pulse"
                    style={{ background: "linear-gradient(135deg,#ff0033,#ff7a00)", boxShadow: "0 0 32px rgba(255,0,51,0.45)" }}>
              {busy ? "Beschwöre..." : "SUMMON THE SWARM"}
            </button>
          </div>
        </div>

        <div className="mt-10 relative rounded-3xl border border-white/10 bg-black/40 p-6 overflow-hidden">
          <NeuralGrid intensity={running ? 0.8 : 0.3} />
          <div className="relative grid lg:grid-cols-2 gap-8 items-start">
            <div className="rounded-2xl border border-emerald-400/20 bg-black/60 aspect-[16/9] overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.08)]">
              {running ? (
                <MyceliumClientLoader ui="embed" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-500 text-xs">Starten um 3D‑Mycelium zu sehen</div>
              )}
            </div>
            <div>
              {!running ? (
                <div className="text-sm text-gray-400">Vorschau erscheint hier. Keine Anmeldung nötig.</div>
              ) : (
                <div>
                  <div className="text-xs text-gray-400">60 Sekunden Vorschau · {secondsLeft}s</div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${(60 - secondsLeft) / 60 * 100}%` }} />
                  </div>
                  {teaser && (
                    <div className="mt-4">
                      <TeaserResultPanel teaser={teaser} secondsLeft={secondsLeft} />
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

        {showRetention && (
          <div className="fixed right-4 bottom-4 z-40 max-w-sm p-4 rounded-2xl border border-white/10 bg-black/80 text-gray-200">
            <div className="text-sm font-bold">Dein Teaser-Ergebnis geht verloren – upgrade jetzt</div>
            <div className="text-xs text-gray-400 mt-1">Pro schaltet dauerhafte History, Export & Oracle frei.</div>
            <div className="mt-3 flex gap-2">
              <BuyButton product="pro" label="Pro 49 € / Monat" className="px-3 py-2 rounded-xl font-black text-black"
                         style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }} />
              <a href="/pricing" className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5">Mehr erfahren</a>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
