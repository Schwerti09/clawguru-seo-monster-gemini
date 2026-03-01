"use client"

// components/admin/ProfitDashboard.tsx
// Executive Profit & API Analytics Dashboard – client component.
// Polls /api/admin/profit-analytics every 60 s and renders all panels.

import { useEffect, useState, useCallback } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StripeMetrics = {
  currency: string
  mrr: number
  netToday: number
  net7d: number
  net30d: number
  activeSubs: number
  trialingSubs: number
  daypassToday: number
  daypassWeek: number
  lastPayments: Array<{ created: number; amount: number; currency: string; description?: string | null }>
}

type ApiMargins = {
  checkCalls: number
  runbookCalls: number
  totalCostUsd: number
  costPerCheckIndicatorUsd: number
  costPerRunbookUsd: number
  revenuePerDaypassUsd: number
  revenuePerProMonthUsd: number
  marginPerCheckIndicatorUsd: number
  marginPerRunbookUsd: number
}

type IpEntry = { ip: string; count: number; blocked: boolean }

type DashData = {
  generatedAt: string
  stripe: StripeMetrics | null
  apiUsage: {
    endpointCounts: Record<string, number>
    margins: ApiMargins
  }
  wallOfShame: {
    topIps: IpEntry[]
    activeBlocks: Array<{ ip: string; unblockAt: number }>
  }
  funnel: {
    landingPageViews: number
    daypassClicks: number
    checkoutCompleted: number
    note: string
  }
  alert: {
    triggered: boolean
    costPct: number
    threshold: number
    message?: string
    costUsd?: number
    revenueTodayUsd?: number
  } | null
  thresholdPct: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function money(cents: number, currency = "eur") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(cents / 100)
}

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function pct(a: number, b: number) {
  if (!b) return "—"
  return `${Math.round((a / b) * 100)}%`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StatCard({
  label,
  value,
  sub,
  accent
}: {
  label: string
  value: string
  sub?: string
  accent?: "green" | "yellow" | "red" | "cyan"
}) {
  const colorMap = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    cyan: "text-cyan-300"
  }
  const color = accent ? colorMap[accent] : "text-white"
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  )
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xl">{icon}</span>
      <h2 className="text-lg font-black text-white">{title}</h2>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wall of Shame panel
// ---------------------------------------------------------------------------
function WallOfShame({ data, onBlock }: { data: DashData["wallOfShame"]; onBlock: (ip: string) => void }) {
  const [blocking, setBlocking] = useState<string | null>(null)

  async function handleBlock(ip: string) {
    setBlocking(ip)
    try {
      await onBlock(ip)
    } finally {
      setBlocking(null)
    }
  }

  if (!data.topIps.length) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-black/30 p-5 text-gray-500 text-sm">
        Keine IP-Daten verfügbar (Tracker läuft im Speicher – nach dem ersten API-Call erscheinen hier Einträge).
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 uppercase text-xs">
            <th className="text-left pb-3 pr-4">#</th>
            <th className="text-left pb-3 pr-4">IP-Adresse</th>
            <th className="text-right pb-3 pr-4">Requests</th>
            <th className="text-left pb-3 pr-4">Status</th>
            <th className="text-right pb-3">Aktion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.topIps.map((entry, i) => (
            <tr key={entry.ip} className="hover:bg-white/[0.02] transition-colors">
              <td className="py-2 pr-4 text-gray-600">{i + 1}</td>
              <td className="py-2 pr-4 font-mono text-gray-200">{entry.ip}</td>
              <td className="py-2 pr-4 text-right font-black text-white">{entry.count.toLocaleString()}</td>
              <td className="py-2 pr-4">
                {entry.blocked ? (
                  <span className="text-red-400 font-bold text-xs">🔒 Gesperrt</span>
                ) : (
                  <span className="text-green-400 text-xs">✓ Aktiv</span>
                )}
              </td>
              <td className="py-2 text-right">
                <button
                  onClick={() => handleBlock(entry.ip)}
                  disabled={entry.blocked || blocking === entry.ip}
                  className="px-3 py-1 rounded-xl text-xs font-bold border border-red-800 text-red-300 hover:bg-red-950/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {blocking === entry.ip ? "Sperren…" : entry.blocked ? "Gesperrt" : "24h Sperren"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Conversion funnel
// ---------------------------------------------------------------------------
function ConversionFunnel({ funnel }: { funnel: DashData["funnel"] }) {
  const { landingPageViews, daypassClicks, checkoutCompleted } = funnel

  const steps = [
    { label: "Landing Page Views", value: landingPageViews, icon: "👁️" },
    { label: "Day-Pass geklickt", value: daypassClicks, icon: "🖱️" },
    { label: "Checkout abgeschlossen", value: checkoutCompleted, icon: "💳" }
  ]

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5">
      <div className="flex gap-2 items-stretch justify-around flex-wrap">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="text-center min-w-[120px]">
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-2xl font-black text-white">
                {step.value > 0 ? step.value.toLocaleString() : "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">{step.label}</div>
              {i > 0 && (
                <div className="text-xs text-cyan-400 mt-1">
                  CR: {pct(step.value, steps[0].value)}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className="text-gray-700 text-xl self-center mx-1">→</div>
            )}
          </div>
        ))}
      </div>
      {funnel.note && (
        <div className="mt-4 text-xs text-gray-600 text-center">{funnel.note}</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bar chart (pure CSS, no extra lib needed)
// ---------------------------------------------------------------------------
function MiniBarChart({ data }: { data: Array<{ label: string; value: number; color?: string }> }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-3 h-24">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1">
          <div className="text-xs text-gray-400 font-bold">{d.value}</div>
          <div
            className={`w-full rounded-t-lg ${d.color ?? "bg-cyan-500"}`}
            style={{ height: `${Math.max(4, (d.value / max) * 72)}px` }}
          />
          <div className="text-xs text-gray-500 text-center leading-tight">{d.label}</div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------
export default function ProfitDashboard() {
  const [data, setData] = useState<DashData | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [blockMsg, setBlockMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/admin/profit-analytics", { cache: "no-store" })
      if (res.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!res.ok) {
        setErr("Fehler beim Laden des Dashboards")
        return
      }
      setData((await res.json()) as DashData)
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

  async function handleBlockIp(ip: string) {
    setBlockMsg(null)
    try {
      const res = await fetch("/api/admin/block-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      })
      if (res.ok) {
        setBlockMsg(`✅ IP ${ip} für 24h gesperrt.`)
        await load()
      } else {
        const j = await res.json().catch(() => ({}))
        setBlockMsg(`❌ Fehler: ${j?.error ?? "Unbekannt"}`)
      }
    } catch {
      setBlockMsg("❌ Netzwerkfehler beim Sperren")
    }
  }

  const stripe = data?.stripe
  const margins = data?.apiUsage?.margins

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          💰 Executive Profit Dashboard · auto-refresh 60s ·{" "}
          {data ? data.generatedAt.slice(0, 19).replace("T", " ") + " UTC" : "—"}
        </div>
        <div className="flex gap-3">
          <a
            href="/admin/center"
            className="px-4 py-2 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-300 text-sm"
          >
            ← Admin Center
          </a>
          <button
            onClick={load}
            className="px-4 py-2 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {data?.alert?.triggered && (
        <div className="p-4 rounded-2xl border border-yellow-700 bg-yellow-950/40 text-yellow-200 font-bold text-sm">
          {data.alert.message}
          {data.alert.costUsd !== undefined && (
            <span className="ml-2 text-yellow-400">
              (Kosten: {usd(data.alert.costUsd)} · Umsatz heute: {usd(data.alert.revenueTodayUsd ?? 0)})
            </span>
          )}
        </div>
      )}

      {blockMsg && (
        <div className={`p-3 rounded-2xl text-sm font-bold ${blockMsg.startsWith("✅") ? "border border-green-800 bg-green-950/30 text-green-300" : "border border-red-800 bg-red-950/30 text-red-300"}`}>
          {blockMsg}
        </div>
      )}

      {busy && !data && (
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 text-gray-400 animate-pulse">
          Lade Profit-Dashboard…
        </div>
      )}

      {err && (
        <div className="p-6 rounded-3xl border border-red-900/50 bg-red-950/30 text-red-200">
          {err}
          <button onClick={load} className="ml-4 underline text-red-300 font-bold">Retry</button>
        </div>
      )}

      {data && (
        <>
          {/* ── 1. Revenue Metrics ── */}
          <section>
            <SectionHeader title="Revenue Metrics (Live Stripe)" icon="💳" />
            {stripe ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="MRR (Monthly Recurring)"
                    value={money(stripe.mrr, stripe.currency)}
                    sub="Aktive Abos × Preis"
                    accent="cyan"
                  />
                  <StatCard
                    label="Net Revenue Today"
                    value={money(stripe.netToday, stripe.currency)}
                    sub="Letzte 24 h"
                    accent="green"
                  />
                  <StatCard
                    label="Net Revenue 7d"
                    value={money(stripe.net7d, stripe.currency)}
                    accent="green"
                  />
                  <StatCard
                    label="Active Subscriptions"
                    value={String(stripe.activeSubs)}
                    sub={`Trialing: ${stripe.trialingSubs}`}
                    accent="yellow"
                  />
                </div>

                {/* Day Pass chart */}
                <div className="mt-4 rounded-2xl border border-gray-800 bg-black/30 p-5">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                    Day-Pass Verkäufe: Heute vs. letzte Woche (Tage 2–7)
                  </div>
                  <MiniBarChart
                    data={[
                      { label: "Heute (24h)", value: stripe.daypassToday, color: "bg-cyan-500" },
                      { label: "Letzte Woche (7d)", value: stripe.daypassWeek, color: "bg-violet-500" }
                    ]}
                  />
                </div>

                {/* Last payments */}
                {stripe.lastPayments.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-gray-800 bg-black/30 p-5">
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                      Letzte Zahlungen (7d)
                    </div>
                    <div className="space-y-2">
                      {stripe.lastPayments.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-gray-400">
                            {new Date(p.created * 1000).toLocaleString("de-DE")}
                          </span>
                          <span className="text-gray-500 truncate max-w-[200px]">
                            {p.description ?? "—"}
                          </span>
                          <span className="font-black text-white whitespace-nowrap">
                            {money(p.amount, p.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-5 rounded-2xl border border-gray-800 bg-black/30 text-gray-500 text-sm">
                Stripe nicht konfiguriert (STRIPE_SECRET_KEY fehlt).
              </div>
            )}
          </section>

          {/* ── 2. API Performance vs. Costs ── */}
          <section>
            <SectionHeader title="API Performance & Marge" icon="⚙️" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="/v1/check-indicator Calls"
                value={(margins?.checkCalls ?? 0).toLocaleString()}
                sub={`Kosten/Call: ${usd(margins?.costPerCheckIndicatorUsd ?? 0)}`}
              />
              <StatCard
                label="/v1/runbooks Calls"
                value={(margins?.runbookCalls ?? 0).toLocaleString()}
                sub={`Kosten/Call: ${usd(margins?.costPerRunbookUsd ?? 0)}`}
              />
              <StatCard
                label="Gesamtkosten (Server)"
                value={usd(margins?.totalCostUsd ?? 0)}
                sub="Check-Indicator + Runbooks"
                accent={data.alert?.triggered ? "red" : undefined}
              />
              <StatCard
                label="Kostenprozent (heute)"
                value={data.alert ? `${data.alert.costPct}%` : "—"}
                sub={`Warnschwelle: ${data.thresholdPct}%`}
                accent={
                  data.alert?.triggered ? "red" : (data.alert?.costPct ?? 0) > 20 ? "yellow" : "green"
                }
              />
            </div>

            <div className="mt-4 rounded-2xl border border-gray-800 bg-black/30 p-5">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                Marge pro Request (Day-Pass Revenue − Server-Kosten)
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
                  <div className="text-gray-400 mb-1">Check-Indicator</div>
                  <div className="font-black text-white text-lg">
                    {usd(margins?.marginPerCheckIndicatorUsd ?? 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Revenue ({usd(margins?.revenuePerDaypassUsd ?? 0)}) − Kosten ({usd(margins?.costPerCheckIndicatorUsd ?? 0)})
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
                  <div className="text-gray-400 mb-1">Runbooks</div>
                  <div className="font-black text-white text-lg">
                    {usd(margins?.marginPerRunbookUsd ?? 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Revenue ({usd(margins?.revenuePerDaypassUsd ?? 0)}) − Kosten ({usd(margins?.costPerRunbookUsd ?? 0)})
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoint call chart */}
            {Object.keys(data.apiUsage.endpointCounts).length > 0 && (
              <div className="mt-4 rounded-2xl border border-gray-800 bg-black/30 p-5">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                  API Calls pro Endpunkt
                </div>
                <MiniBarChart
                  data={Object.entries(data.apiUsage.endpointCounts).map(([ep, cnt], i) => ({
                    label: ep.replace("/v1/", ""),
                    value: cnt,
                    color: i % 2 === 0 ? "bg-cyan-500" : "bg-violet-500"
                  }))}
                />
              </div>
            )}
          </section>

          {/* ── 3. Wall of Shame ── */}
          <section>
            <SectionHeader title="Wall of Shame – Top Abuser IPs" icon="🚨" />
            <WallOfShame data={data.wallOfShame} onBlock={handleBlockIp} />
            {data.wallOfShame.activeBlocks.length > 0 && (
              <div className="mt-3 text-xs text-gray-600">
                Aktive Sperren:{" "}
                {data.wallOfShame.activeBlocks
                  .map((b) => `${b.ip} (bis ${new Date(b.unblockAt).toLocaleString("de-DE")})`)
                  .join(" · ")}
              </div>
            )}
          </section>

          {/* ── 4. Conversion Funnel ── */}
          <section>
            <SectionHeader title="Conversion Funnel" icon="🔄" />
            <ConversionFunnel funnel={data.funnel} />
          </section>
        </>
      )}
    </div>
  )
}
