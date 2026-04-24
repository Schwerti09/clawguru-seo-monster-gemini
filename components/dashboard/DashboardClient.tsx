"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"
import { trackEvent } from "@/lib/analytics"
import { dismissRetentionNudge, getRetentionNudge, type RetentionNudge } from "@/lib/retention-client"
import {
  AUTOPILOT_THRESHOLDS,
  buildUpgradeSignalsFromUsage,
} from "@/lib/autopilot-thresholds"
import { suggestAutopilotPlan, type UpgradeSignals } from "@/lib/autopilot-offering"
import { useInView } from "framer-motion"
import { usePathname } from "next/navigation"
// Mycelium wird später als optimierte Lazy-Version wieder eingebaut

type AccessPlan = "free" | "daypass" | "pro" | "enterprise"

type TierInfo = {
  ok: boolean
  plan?: "daypass" | "pro" | "team"
  tier?: AccessPlan
  limits?: unknown
}

type Product = "daypass" | "pro" | "team" | "enterprise"

function mapAutopilotPlanToProduct(plan: ReturnType<typeof suggestAutopilotPlan>): "daypass" | "pro" | "team" {
  if (plan === "scale") return "team"
  if (plan === "pro") return "pro"
  return "daypass"
}

function LazySection(props: { children: React.ReactNode; minH?: string }) {
  const { children, minH } = props
  const holderRef = useRef<HTMLDivElement>(null)
  const visible = useInView(holderRef, { amount: 0.2, once: true })
  return (
    <div ref={holderRef} className={minH ? minH : undefined}>
      {visible ? children : <div aria-hidden className={`w-full ${minH || "min-h-[160px]"} rounded-2xl bg-black/20 border border-white/5`} />}
    </div>
  )
}

function useTier() {
  const [tier, setTier] = useState<AccessPlan>("free")
  const [plan, setPlan] = useState<AccessPlan>("free")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let stop = false
    ;(async () => {
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
    })()
    return () => { stop = true }
  }, [])

  return { tier, plan, loading }
}

function UpgradeButton(props: {
  product: Product
  label: string
  className?: string
  analyticsSource?: string
  upgradeSignals?: UpgradeSignals
}) {
  const { product, label, className, analyticsSource, upgradeSignals } = props
  const [busy, setBusy] = useState(false)
  async function checkout() {
    const recommendedPlan = upgradeSignals
      ? suggestAutopilotPlan(upgradeSignals)
      : undefined
    const resolvedProduct =
      recommendedPlan && product !== "enterprise"
        ? mapAutopilotPlanToProduct(recommendedPlan)
        : product
    const normalizedSignals = upgradeSignals
      ? {
          workspaces: Math.max(1, Math.min(999, Math.floor(upgradeSignals.workspaces))),
          needsApiExports: !!upgradeSignals.needsApiExports,
          needsPolicyControls: !!upgradeSignals.needsPolicyControls,
        }
      : undefined

    trackEvent("checkout_start", {
      source: analyticsSource ?? "dashboard_upgrade_button",
      product: resolvedProduct,
      recommended_plan: recommendedPlan ?? null,
      upgrade_signals: normalizedSignals ? JSON.stringify(normalizedSignals) : null,
    })
    try {
      setBusy(true)
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: resolvedProduct,
          recommended_plan: recommendedPlan ?? undefined,
          upgrade_signals: normalizedSignals,
        }),
      })
      const json = await res.json().catch(() => null)
      const url = json?.url as string | undefined
      if (url) {
        trackEvent("checkout_redirect", {
          source: analyticsSource ?? "dashboard_upgrade_button",
          product: resolvedProduct,
          recommended_plan: recommendedPlan ?? null,
        })
        window.location.href = url
        return
      }
      {
        const seg = (typeof window !== "undefined" ? window.location.pathname : "").split("/")[1] || ""
        const locPrefix = /^[a-z]{2}(-[A-Z]{2})?$/.test(seg) ? `/${seg}` : ""
        window.location.href = `${locPrefix}/pricing`
      }
    } catch {
      trackEvent("checkout_error", {
        source: analyticsSource ?? "dashboard_upgrade_button",
        product: resolvedProduct,
      })
      const seg = (typeof window !== "undefined" ? window.location.pathname : "").split("/")[1] || ""
      const locPrefix = /^[a-z]{2}(-[A-Z]{2})?$/.test(seg) ? `/${seg}` : ""
      window.location.href = `${locPrefix}/pricing`
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

function UpgradeSignalNudge(props: {
  title: string
  description: string
  product: "daypass" | "pro" | "team"
  label: string
  signals: { workspaces: number; needsApiExports: boolean; needsPolicyControls: boolean }
}) {
  const { title, description, product, label, signals } = props
  return (
    <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-4">
      <div className="text-xs font-mono tracking-wider text-cyan-300 uppercase">Upgrade Signal</div>
      <div className="mt-1 text-sm font-bold text-white">{title}</div>
      <p className="mt-1 text-xs text-gray-300">{description}</p>
      <div className="mt-3">
        <BuyButton
          product={product}
          label={label}
          autoRecommend
          upgradeSignals={signals}
          analyticsSource="dashboard_upgrade_signal"
          className="px-4 py-2 rounded-xl font-bold text-black"
          style={{ background: "linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%)" }}
        />
      </div>
    </div>
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
      <div className={allowed ? "opacity-100" : "opacity-100"}>{children}</div>
      {!allowed && (
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-gray-400">
          <span>Vorschau sichtbar · Vollzugriff per Upgrade</span>
          <UpgradeButton product={need} label={needLabel} />
        </div>
      )}
    </div>
  )
}

function MyceliumCommandCore(props: { tier: AccessPlan }) {
  const { tier } = props
  const ticker = useMemo(() => Math.floor(300 + Math.random() * 120), [])
  const mountRef = useRef<HTMLDivElement>(null)
  return (
    <GatedTile title="Mycelium Command Core" minTier="daypass" tier={tier}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-cyan-500/30 bg-black/40 p-3">
          <div className="text-xs text-cyan-300 mb-2">Interaktiver 3D-Graph</div>
          <div ref={mountRef} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/50 grid place-items-center text-gray-400">
            {/* Mycelium wird später als optimierte Lazy-Version wieder eingebaut */}
            <div className="text-xs opacity-70">Preview vorübergehend deaktiviert</div>
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
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.3 })
  useEffect(() => {
    let id: number | null = null
    try {
      const isMobile = window.innerWidth < 768
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!isMobile && !reduce && inView) {
        id = window.setInterval(() => {
          setScore((s) => {
            const next = s + (Math.random() * 6 - 3)
            return Math.max(120, Math.min(980, Math.round(next)))
          })
        }, 4000)
      }
    } catch {}
    return () => { if (id) window.clearInterval(id) }
  }, [inView])
  const pct = Math.min(1000, Math.max(0, score)) / 10
  const bg = `conic-gradient(#06b6d4 ${pct}%, rgba(6,182,212,0.15) ${pct}% 100%)`
  return (
    <div ref={rootRef} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
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
  const isFree = tier === "free"
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
        {(isFree || limited) && (
          <UpgradeSignalNudge
            title="Automation needs detected"
            description="If you run more than one workspace or need exports for CI/SIEM, move to Pro."
            product="pro"
            label="Autopilot Pro empfehlen"
            signals={buildUpgradeSignalsFromUsage({
              workspaces: AUTOPILOT_THRESHOLDS.pro.minWorkspaces,
              apiExportsRequested: AUTOPILOT_THRESHOLDS.pro.needsApiExports,
              policyControlsRequested: AUTOPILOT_THRESHOLDS.pro.needsPolicyControls,
            })}
          />
        )}
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

function EnterpriseDeck(props: { tier: AccessPlan }) {
  const locked = props.tier !== "enterprise"
  return (
    <GatedTile title="Enterprise Mycelium Command Deck" minTier="enterprise" tier={props.tier} cta="team">
      <div className="h-40 rounded-xl border border-emerald-500/20 bg-emerald-500/5 grid place-items-center text-emerald-200">Team‑Collaboration & Compliance</div>
      {locked && (
        <UpgradeSignalNudge
          title="Governance threshold reached"
          description="Policy controls and cross-workspace governance are best handled in Scale."
          product="team"
          label="Autopilot Scale aktivieren"
          signals={buildUpgradeSignalsFromUsage({
            workspaces: AUTOPILOT_THRESHOLDS.scale.minWorkspaces,
            apiExportsRequested: AUTOPILOT_THRESHOLDS.scale.needsApiExports,
            policyControlsRequested: AUTOPILOT_THRESHOLDS.scale.needsPolicyControls,
          })}
        />
      )}
    </GatedTile>
  )
}

function AffiliateNetwork(props: { tier: AccessPlan }) {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://clawguru.org/?ref=YOUR_ID"
  
  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <GatedTile title="Mycelium Affiliate & Revenue Network" minTier="enterprise" tier={props.tier} cta="team">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-xs text-indigo-300 mb-1">Heute</div>
            <div className="text-xl font-black text-white">$12,847</div>
          </div>
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-xs text-indigo-300 mb-1">Dieser Monat</div>
            <div className="text-xl font-black text-white">$48,239</div>
          </div>
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-xs text-indigo-300 mb-1">Klicks heute</div>
            <div className="text-xl font-black text-white">1,247</div>
          </div>
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <div className="text-xs text-indigo-300 mb-1">Konversionen</div>
            <div className="text-xl font-black text-white">89</div>
          </div>
        </div>
        
        <div className="p-3 rounded-xl border border-gray-700 bg-black/30">
          <div className="text-xs text-gray-400 mb-2">Dein Affiliate-Link</div>
          <div className="flex gap-2">
            <input 
              value={referralLink} 
              readOnly 
              className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-gray-700 text-xs text-gray-300 font-mono"
            />
            <button 
              onClick={copyLink}
              className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Provision: 30% auf alle Abos · Auszahlung monatlich (€50 Minimum)
        </div>
      </div>
    </GatedTile>
  )
}

export default function DashboardClient() {
  const { tier, loading } = useTier()
  const pathname = usePathname()
  const [retentionNudge, setRetentionNudge] = useState<RetentionNudge | null>(null)
  const localePrefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    return /^[a-z]{2}(-[A-Z]{2})?$/.test(first) ? `/${first}` : "/de"
  }, [pathname])

  useEffect(() => {
    const locale = localePrefix.replace("/", "").slice(0, 2) || "de"
    setRetentionNudge(getRetentionNudge(locale))
  }, [localePrefix])

  function handleDismissNudge() {
    dismissRetentionNudge()
    setRetentionNudge(null)
  }

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
            <UpgradeButton product="daypass" label="Daypass" analyticsSource="dashboard_header_cta" />
            <UpgradeButton
              product="pro"
              label="Pro"
              analyticsSource="dashboard_header_cta"
              upgradeSignals={buildUpgradeSignalsFromUsage({
                workspaces: AUTOPILOT_THRESHOLDS.pro.minWorkspaces,
                apiExportsRequested: AUTOPILOT_THRESHOLDS.pro.needsApiExports,
                policyControlsRequested: AUTOPILOT_THRESHOLDS.pro.needsPolicyControls,
              })}
            />
            <UpgradeButton
              product="team"
              label="Team"
              analyticsSource="dashboard_header_cta"
              upgradeSignals={buildUpgradeSignalsFromUsage({
                workspaces: AUTOPILOT_THRESHOLDS.scale.minWorkspaces,
                apiExportsRequested: AUTOPILOT_THRESHOLDS.scale.needsApiExports,
                policyControlsRequested: AUTOPILOT_THRESHOLDS.scale.needsPolicyControls,
              })}
            />
          </div>
        </div>

        {/* Mini tablet preview always visible at top */}
        {retentionNudge && (
          <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${
            retentionNudge.level === "critical"
              ? "border-red-700/60 bg-red-950/30 text-red-200"
              : "border-yellow-700/60 bg-yellow-950/30 text-yellow-200"
          }`}>
            <div className="font-bold mb-1">Retention Hint</div>
            <div>{retentionNudge.message}</div>
            <div className="mt-2 flex gap-2">
              <a
                href={`${localePrefix}${retentionNudge.ctaPath}`}
                className="px-3 py-1 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20"
              >
                {retentionNudge.ctaLabel}
              </a>
              <button
                onClick={handleDismissNudge}
                className="px-3 py-1 rounded-xl text-xs font-bold border border-white/20 hover:bg-white/10"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-xs text-gray-400 mb-2">Mycelium Vorschau</div>
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 grid place-items-center text-gray-400">
            {/* Mycelium wird später als optimierte Lazy-Version wieder eingebaut */}
            <div className="text-xs opacity-70">Preview vorübergehend deaktiviert</div>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400">Lade Zugang…</div>
        ) : (
          <div className="space-y-6">
            <LazySection minH="min-h-[280px]">
              <MyceliumCommandCore tier={tier} />
            </LazySection>
            <LazySection minH="min-h-[220px]">
              <SecurityScoreRing />
            </LazySection>
            <LazySection>
              <div className="grid md:grid-cols-2 gap-4">
                <AiRunbookGenerator tier={tier} />
                <AutoPentest tier={tier} />
              </div>
            </LazySection>
            <LazySection>
              <div className="grid md:grid-cols-2 gap-4">
                <BreachSimulator tier={tier} />
                {/* Mycelium wird später als optimierte Lazy-Version wieder eingebaut */}
                <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 grid place-items-center text-gray-400 text-sm">Live Threat Network vorübergehend deaktiviert</div>
              </div>
            </LazySection>
            <LazySection>
              <div className="grid md:grid-cols-2 gap-4">
                <EnterpriseDeck tier={tier} />
                <AffiliateNetwork tier={tier} />
              </div>
            </LazySection>
          </div>
        )}
      </Container>
    </div>
  )
}
