"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Container from "@/components/shared/Container"
import dynamic from "next/dynamic"
import { useInView } from "framer-motion"
const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })

type AccessPlan = "free" | "daypass" | "pro" | "enterprise"

type TierInfo = {
  ok: boolean
  plan?: "daypass" | "pro" | "team"
  tier?: AccessPlan
  limits?: any
}

type Product = "daypass" | "pro" | "team" | "enterprise"

function useTier() {
  const [tier, setTier] = useState<AccessPlan>("free")
  const [plan, setPlan] = useState<AccessPlan>("free")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let stop = false
    async function fetchTier() {
      try {
        const res = await fetch("/api/auth/tier", { cache: "no-store" })
        if (!res.ok) throw new Error(String(res.status))
        const json: TierInfo = await res.json()
        const mapped: AccessPlan = json.tier === "daypass" || json.tier === "pro" || json.tier === "enterprise" ? json.tier : "free"
        const mappedPlan: AccessPlan = json.plan === "daypass" ? "daypass" : json.plan === "pro" ? "pro" : json.plan === "team" ? "enterprise" : "free"
        if (!stop) {
          setTier(mapped)
          setPlan(mappedPlan)
          setLoading(false)
        }
      } catch {
        if (!stop) {
          setTier("free")
          setPlan("free")
          setLoading(false)
        }
      }
    }
    fetchTier()
    const id = window.setInterval(fetchTier, 15000)
    return () => {
      stop = true
      window.clearInterval(id)
    }
  }, [])

  return { tier, plan, loading }
}

function UpgradeButton(props: { product: Product; label: string; className?: string }) {
  const { product, label, className } = props
  const [busy, setBusy] = useState(false)
  async function checkout() {
    try {
      setBusy(true)
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product })
      })
      const json = await res.json().catch(() => null)
      const url = json?.url as string | undefined
      if (url) {
        window.location.href = url
        return
      }
      window.location.href = "/pricing"
    } catch {
      window.location.href = "/pricing"
    } finally {
      setBusy(false)
    }
  }
  return (
    <button onClick={checkout} disabled={busy} className={className || "px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-500 font-bold text-white hover:opacity-90 disabled:opacity-60"}>
      {label}
    </button>
  )
}

function GatedTile(props: { title: string; minTier: AccessPlan; tier: AccessPlan; children: React.ReactNode; cta?: Product }) {
  const { title, minTier, tier, children, cta } = props
  const rank = { free: 0, daypass: 1, pro: 2, enterprise: 3 }
  const allowed = rank[tier] >= rank[minTier]
  const need: Product | null = cta || (minTier === "enterprise" ? "team" : minTier === "pro" ? "pro" : "daypass")
  const needLabel = need === "team" ? "Team 99 € / Monat freischalten" : need === "pro" ? "Pro 29 € / Monat freischalten" : "Daypass 9,99 € – 24h Zugriff"
  return (
    <div className="relative p-6 rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
      <div className="text-lg font-black mb-3">{title}</div>
      <div className={allowed ? "opacity-100" : "opacity-50 pointer-events-none select-none"}>{children}</div>
      {!allowed && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-gray-200">Upgrade erforderlich</div>
            <UpgradeButton product={need} label={needLabel} />
          </div>
        </div>
      )}
    </div>
  )
}

function MyceliumCommandCore(props: { tier: AccessPlan }) {
  const { tier } = props
  const ticker = useMemo(() => Math.floor(300 + Math.random() * 120), [])
  const mountRef = useRef<HTMLDivElement>(null)
  const inView = useInView(mountRef, { amount: 0.25, once: true })
  const [ready, setReady] = useState(false)
  useEffect(() => {
    try {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024
      const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      setReady(w >= 768 && !prefersReduced)
    } catch {
      setReady(false)
    }
  }, [])
  return (
    <GatedTile title="Mycelium Command Core" minTier="daypass" tier={tier}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-3">
          <div className="text-xs text-cyan-300 mb-2">Interaktiver 3D-Graph</div>
          <div ref={mountRef} className="aspect-[16/10] rounded-xl overflow-hidden bg-black/50">
            {inView && ready ? <MyceliumClientLoader ui="embed" /> : null}
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-black/40 p-4 flex flex-col justify-between">
          <div>
            <div className="text-sm text-gray-300">Live‑Ticker</div>
            <div className="text-3xl font-black mt-1"><span className="text-cyan-300">Mycelium</span> erkennt gerade {ticker} neue Bedrohungen</div>
            <div className="mt-2 text-sm text-gray-400">Hover über Knoten → sofortiges Runbook</div>
          </div>
          <div className="mt-4 flex gap-2">
            <UpgradeButton product="daypass" label="Daypass 9,99 € – 24h Live" />
            <UpgradeButton product="pro" label="Pro 29 €/Monat – Generator" />
          </div>
        </div>
      </div>
    </GatedTile>
  )
}

function SecurityScoreRing() {
  const [score, setScore] = useState(620)
  useEffect(() => {
    const id = window.setInterval(() => {
      setScore((s) => {
        const next = s + (Math.random() * 8 - 4)
        return Math.max(120, Math.min(980, Math.round(next)))
      })
    }, 1800)
    return () => window.clearInterval(id)
  }, [])
  const pct = Math.min(1000, Math.max(0, score)) / 10
  const bg = `conic-gradient(#06b6d4 ${pct}%, rgba(6,182,212,0.15) ${pct}% 100%)`
  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
      <div className="text-lg font-black mb-3">Mycelium Security Score</div>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 rounded-full grid place-items-center" style={{ background: bg }}>
          <div className="w-32 h-32 rounded-full bg-black/80 border border-cyan-400/20 grid place-items-center">
            <div className="text-3xl font-black">{score}</div>
          </div>
        </div>
        <div className="text-sm text-gray-300">Fasern leuchten je nach Score und Tier. Ziel: 900+</div>
      </div>
    </div>
  )
}

function AiRunbookGenerator(props: { tier: AccessPlan }) {
  const { tier } = props
  const [q, setQ] = useState("")
  const limited = tier === "daypass"
  return (
    <GatedTile title="AI Mycelium Runbook Generator" minTier="daypass" tier={tier}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl border border-gray-700 bg-black/40 text-gray-200">🎙️ Voice</button>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Beschreibe dein System + Problem…"
                 className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20" />
          <button className="px-4 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold">Generieren</button>
        </div>
        {limited && <div className="text-xs text-gray-400">Daypass: 1 Runbook/Tag</div>}
      </div>
    </GatedTile>
  )
}

function AutoPentest(props: { tier: AccessPlan }) {
  return (
    <GatedTile title="Auto‑Pentest Mycelium Engine" minTier="pro" tier={props.tier}>
      <div className="h-40 rounded-xl border border-pink-500/20 bg-pink-500/5 grid place-items-center text-pink-200">One‑Click Infiltration</div>
    </GatedTile>
  )
}

function BreachSimulator(props: { tier: AccessPlan }) {
  return (
    <GatedTile title="Predictive Mycelium Breach Simulator" minTier="pro" tier={props.tier}>
      <div className="h-40 rounded-xl border border-amber-500/20 bg-amber-500/5 grid place-items-center text-amber-200">3D Angriffssimulation</div>
    </GatedTile>
  )
}

function LiveThreatNetwork(props: { tier: AccessPlan }) {
  const [data, setData] = useState<any | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.2, once: true })
  useEffect(() => {
    if (!inView) return
    let stop = false
    ;(async () => {
      try {
        const res = await fetch("/api/live-wall", { cache: "default" })
        const j = await res.json()
        if (!stop) setData(j)
      } catch {}
    })()
    return () => { stop = true }
  }, [inView])
  const trending = (data?.trending || []).slice(0, 8)
  const cves = (data?.cves || []).slice(0, 6)
  return (
    <div ref={rootRef}>
    <GatedTile title="Live Mycelium Threat Network" minTier="daypass" tier={props.tier}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-bold mb-2">Trending Fixes</div>
          <div className="grid grid-cols-1 gap-2">
            {trending.map((t: any) => (
              <a key={t.slug} href={`/runbook/${t.slug}`} className="px-3 py-2 rounded-xl border border-gray-800 bg-black/30 hover:bg-black/40">
                <div className="font-bold text-gray-100">{t.title}</div>
                <div className="text-xs text-gray-400">{t.summary}</div>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold mb-2">Neueste Viren (CVE‑Pulse)</div>
          <div className="grid grid-cols-1 gap-2">
            {cves.map((x: any) => (
              <a key={x.cveId} href={`/solutions/fix-${x.cveId}`} className="px-3 py-2 rounded-xl border border-gray-800 bg-black/30 hover:bg-black/40 flex items-center justify-between">
                <span className="text-xs font-mono text-gray-300">{x.cveId}</span>
                <span className="text-sm font-bold text-gray-100">{x.name}</span>
                <span className="text-xs text-gray-400">{x.cvssScore}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </GatedTile>
    </div>
  )
}

function EnterpriseDeck(props: { tier: AccessPlan }) {
  return (
    <GatedTile title="Enterprise Mycelium Command Deck" minTier="enterprise" tier={props.tier} cta="team">
      <div className="h-40 rounded-xl border border-emerald-500/20 bg-emerald-500/5 grid place-items-center text-emerald-200">Team‑Collaboration & Compliance</div>
    </GatedTile>
  )
}

function AffiliateNetwork(props: { tier: AccessPlan }) {
  return (
    <GatedTile title="Mycelium Affiliate & Revenue Network" minTier="enterprise" tier={props.tier} cta="team">
      <div className="h-40 rounded-xl border border-indigo-500/20 bg-indigo-500/5 grid place-items-center text-indigo-200">Dein Mycelium: $12,847 heute</div>
    </GatedTile>
  )
}

function SwarmOracleSection(props: { tier: AccessPlan }) {
  const { tier } = props
  const prefill = encodeURIComponent("Mein Kubernetes-Cluster")
  return (
    <GatedTile title="Claw Swarm Oracle" minTier="free" tier={tier}>
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-500/10 to-red-900/10 p-5">
          <div className="text-sm text-red-300 mb-2">Summon your Army</div>
          <div className="text-2xl font-black">Neon-roter Summon-Button · 4 Swarm-Typen</div>
          <div className="mt-2 text-sm text-gray-400">Ergebnis in unter 8 Sekunden: Angriffspfade, Vorhersage, Runbook + One-Click-Fix</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/summon?prefill=${prefill}`} className="px-5 py-3 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg,#ff0066,#ff9900)", boxShadow: "0 0 24px rgba(255,0,102,0.25)" }}>Jetzt summonen</a>
            <UpgradeButton product="daypass" label="Daypass 9,99 € - 24h" />
            <UpgradeButton product="pro" label="Pro 49 € / Monat" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 aspect-[16/9] overflow-hidden">
          <MyceliumClientLoader ui="embed" />
        </div>
      </div>
    </GatedTile>
  )
}

function IntelNexusSection(props: { tier: AccessPlan }) {
  const { tier } = props
  return (
    <GatedTile title="Mycelium Intel Nexus" minTier="free" tier={tier}>
      <div className="grid md:grid-cols-2 gap-4 items-center">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-cyan-500/10 p-5">
          <div className="text-sm text-emerald-300 mb-2">Cinematic Intelligence</div>
          <div className="text-2xl font-black">3D Threat‑Map · Teaser‑Report · Predictive</div>
          <div className="mt-2 text-sm text-gray-400">Luxus‑Look mit Glassmorphism & Gold‑Akzenten. 60s Preview, dann starker Paywall‑Nudge.</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/intel`} className="px-5 py-3 rounded-2xl font-black text-white" style={{ background: "linear-gradient(135deg,#00ff9d,#00b8ff)", boxShadow: "0 0 24px rgba(0,255,157,0.25)" }}>Open Intel</a>
            <UpgradeButton product="daypass" label="Daypass 9,99 € - 24h" />
            <UpgradeButton product="pro" label="Pro 49 € / Monat" />
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 aspect-[16/9] overflow-hidden">
          <MyceliumClientLoader ui="embed" />
        </div>
      </div>
    </GatedTile>
  )
}

export default function DashboardClient() {
  const { tier, loading } = useTier()
  return (
    <div className="py-10">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs font-mono text-[#00ff9d] tracking-widest uppercase">DASHBOARD</div>
            <h1 className="text-3xl md:text-4xl font-black">Ultimatives Mycelium Dashboard</h1>
            <div className="text-sm text-gray-400">Blade Runner × Iron Man × Mycelium × Notion</div>
          </div>
          <div className="flex gap-2">
            <UpgradeButton product="daypass" label="Daypass" />
            <UpgradeButton product="pro" label="Pro" />
            <UpgradeButton product="team" label="Team" />
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Lade Zugang…</div>
        ) : (
          <div className="space-y-6">
            <SwarmOracleSection tier={tier} />
            <IntelNexusSection tier={tier} />
            <MyceliumCommandCore tier={tier} />
            <SecurityScoreRing />
            <div className="grid md:grid-cols-2 gap-4">
              <AiRunbookGenerator tier={tier} />
              <AutoPentest tier={tier} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <BreachSimulator tier={tier} />
              <LiveThreatNetwork tier={tier} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <EnterpriseDeck tier={tier} />
              <AffiliateNetwork tier={tier} />
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
