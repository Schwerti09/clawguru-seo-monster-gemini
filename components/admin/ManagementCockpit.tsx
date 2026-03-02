"use client"

// File: components/admin/ManagementCockpit.tsx
// Management Cockpit – 4-panel admin dashboard: Revenue, SEO Index, Affiliates, System Sentinel.

import { useEffect, useState, useCallback, useRef } from "react"
import { DollarSign, Activity, Globe, Zap, Shield, AlertTriangle, RefreshCw } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Transaction = {
  created: number
  amount: number
  currency: string
  country: string | null
  affiliateId: string | null
}

type Revenue = {
  currency: string
  salesToday: number
  salesThisMonth: number
  activeSubs: number
  lastTransactions: Transaction[]
}

type SeoIndex = {
  indexedPages: number
  targetPages: number
  progressPct: number
  lastDailyIndexRun: string | null
}

type AffiliatePartner = {
  id: string
  clicks: number
  sales: number
}

type Affiliates = {
  partners: AffiliatePartner[]
}

type System = {
  geminiStatus: "online" | "offline"
  maintenanceMode: boolean
  hasNetlifyToken: boolean
}

type CockpitData = {
  generatedAt: string
  revenue: Revenue | null
  seo: SeoIndex
  affiliates: Affiliates
  system: System
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function money(cents: number, currency = "eur") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

function formatTs(ts: number) {
  return new Date(ts * 1000).toLocaleString("de-DE")
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CardHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-brand-cyan">{icon}</span>
      <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">{label}</span>
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl border border-gray-800 bg-black/40">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Revenue panel
// ---------------------------------------------------------------------------
function RevenuePanel({ data }: { data: Revenue | null }) {
  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
      <CardHeader icon={<DollarSign size={18} />} label="Revenue Stats" />
      {!data ? (
        <p className="text-sm text-gray-500">Stripe nicht konfiguriert.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatPill label="Sales heute" value={money(data.salesToday, data.currency)} />
            <StatPill label="Sales diesen Monat" value={money(data.salesThisMonth, data.currency)} />
            <StatPill label="Aktive Abos" value={String(data.activeSubs)} />
          </div>

          <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Letzte 5 Transaktionen</div>
          {data.lastTransactions.length === 0 ? (
            <p className="text-sm text-gray-600">Keine Transaktionen gefunden.</p>
          ) : (
            <div className="space-y-2">
              {data.lastTransactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-gray-800 bg-black/40 text-sm"
                >
                  <div className="text-gray-400">{formatTs(tx.created)}</div>
                  <div className="flex items-center gap-3">
                    {tx.country && (
                      <span className="text-gray-500 text-xs">{tx.country}</span>
                    )}
                    {tx.affiliateId && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet text-xs font-bold">
                        {tx.affiliateId}
                      </span>
                    )}
                    <span className="font-black text-white">{money(tx.amount, tx.currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SEO Index Tracker panel
// ---------------------------------------------------------------------------
function SeoPanel({ data }: { data: SeoIndex }) {
  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
      <CardHeader icon={<Globe size={18} />} label="SEO-Index-Tracker" />

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-300 font-bold">
            Indexierungs-Status: {data.indexedPages.toLocaleString("de-DE")} von{" "}
            {data.targetPages.toLocaleString("de-DE")} Seiten
          </span>
          <span className="text-brand-cyan font-black">{data.progressPct}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet transition-all duration-700"
            style={{ width: `${data.progressPct}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-400">
        <span className="text-gray-500">Letzter daily-index Cron: </span>
        {data.lastDailyIndexRun ? (
          <span className="text-green-400 font-bold">
            {new Date(data.lastDailyIndexRun).toLocaleString("de-DE")}
          </span>
        ) : (
          <span className="text-orange-400 font-bold">Noch nicht gelaufen</span>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Affiliate Performance panel
// ---------------------------------------------------------------------------
function AffiliatePanel({ data }: { data: Affiliates }) {
  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
      <CardHeader icon={<Activity size={18} />} label="Affiliate-Performance" />

      <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Top 5 Partner</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs border-b border-gray-800">
            <th className="text-left pb-2">Partner</th>
            <th className="text-right pb-2">Klicks</th>
            <th className="text-right pb-2">Sales</th>
          </tr>
        </thead>
        <tbody>
          {data.partners.map((p) => (
            <tr key={p.id} className="border-b border-gray-900">
              <td className="py-2 font-bold text-gray-200 capitalize">{p.id}</td>
              <td className="py-2 text-right text-gray-400">{p.clicks}</td>
              <td className="py-2 text-right text-gray-400">{p.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-600">
        Klick-Tracking via <code>/go/[slug]</code> · Sales aus Stripe-Metadata.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// System Sentinel & Kill-Switch panel
// ---------------------------------------------------------------------------
function SystemPanel({ data }: { data: System }) {
  const [killing, setKilling] = useState(false)
  const [killResult, setKillResult] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  async function triggerKillSwitch() {
    if (!confirmed) {
      setConfirmed(true)
      setKillResult("Nochmal klicken zum Bestätigen!")
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      confirmTimer.current = setTimeout(() => {
        setConfirmed(false)
        setKillResult(null)
      }, 5_000)
      return
    }

    setKilling(true)
    setKillResult(null)
    try {
      const res = await fetch("/api/admin/kill-switch", { method: "POST" })
      if (res.ok) {
        setKillResult("✅ MAINTENANCE_MODE=true gesetzt. Seite im Wartungsmodus.")
      } else {
        const j = await res.json().catch(() => ({}))
        setKillResult(`❌ Fehler: ${(j as { error?: string }).error ?? res.status}`)
      }
    } catch {
      setKillResult("❌ Netzwerkfehler")
    } finally {
      setKilling(false)
      setConfirmed(false)
    }
  }

  const isOnline = data.geminiStatus === "online"

  return (
    <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
      <CardHeader icon={<Shield size={18} />} label="System-Sentinel" />

      {/* Gemini API Status */}
      <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl border border-gray-800 bg-black/40">
        <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-widest">Gemini API</div>
          <div className={`font-black ${isOnline ? "text-green-400" : "text-red-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {/* Kill-Switch */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <AlertTriangle size={14} className="text-orange-400" />
          <span>Setzt MAINTENANCE_MODE=true via Netlify API</span>
        </div>

        {data.maintenanceMode && (
          <div className="px-4 py-2 rounded-xl bg-orange-950/50 border border-orange-800 text-orange-300 text-sm font-bold">
            ⚠️ Wartungsmodus bereits aktiv!
          </div>
        )}

        <button
          onClick={triggerKillSwitch}
          disabled={killing || !data.hasNetlifyToken}
          className={`w-full py-3 px-4 rounded-2xl font-black text-sm transition-all
            ${confirmed
              ? "bg-gradient-to-r from-orange-600 to-red-700 animate-pulse border-2 border-red-500"
              : "bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800"
            }
            disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2`}
        >
          <Zap size={16} />
          {killing ? "Aktiviere…" : confirmed ? "⚠️ WIRKLICH AKTIVIEREN?" : "GLOBAL KILL-SWITCH"}
        </button>

        {!data.hasNetlifyToken && (
          <p className="text-xs text-gray-600">
            ENV fehlt: <code>NETLIFY_AUTH_TOKEN</code> + <code>NETLIFY_SITE_ID</code>
          </p>
        )}

        {killResult && (
          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
            killResult.startsWith("✅")
              ? "bg-green-950/50 border border-green-800 text-green-300"
              : killResult.startsWith("❌")
              ? "bg-red-950/50 border border-red-800 text-red-300"
              : "bg-orange-950/50 border border-orange-800 text-orange-300"
          }`}>
            {killResult}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ManagementCockpit() {
  const [data, setData] = useState<CockpitData | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)

  const load = useCallback(async () => {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/admin/cockpit", { cache: "no-store" })
      if (res.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!res.ok) {
        setErr("Fehler beim Laden des Cockpits")
        return
      }
      setData((await res.json()) as CockpitData)
    } catch {
      setErr("Netzwerkfehler")
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [load])

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-400">
          Management Cockpit · auto-refresh 60s
          {data && <span className="ml-2 text-gray-600">· {data.generatedAt.slice(0, 19).replace("T", " ")} UTC</span>}
        </div>
        <div className="flex gap-3">
          <a
            href="/api/admin/logout"
            className="px-4 py-2 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-sm"
          >
            Logout
          </a>
          <button
            onClick={load}
            disabled={busy}
            className="px-4 py-2 rounded-2xl font-black text-sm bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw size={14} className={busy ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {busy && !data && (
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 text-gray-400 animate-pulse">
          Lade Management Cockpit…
        </div>
      )}

      {err && (
        <div className="p-6 rounded-3xl border border-red-900/50 bg-red-950/30 text-red-300">
          {err}
          <button onClick={load} className="ml-4 underline text-red-400 hover:text-red-200">
            Retry
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Row 1: Revenue + SEO */}
          <div className="grid lg:grid-cols-2 gap-6">
            <RevenuePanel data={data.revenue} />
            <SeoPanel data={data.seo} />
          </div>

          {/* Row 2: Affiliates + System Sentinel */}
          <div className="grid lg:grid-cols-2 gap-6">
            <AffiliatePanel data={data.affiliates} />
            <SystemPanel data={data.system} />
          </div>
        </>
      )}
    </div>
  )
}
