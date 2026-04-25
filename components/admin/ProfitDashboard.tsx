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

type GeoMatrixItem = {
  city_slug: string
  city_name: string
  quality_score: number
}

type GeoMatrixData = {
  items: GeoMatrixItem[]
  stats24h: {
    variants_24h: string
    avg_quality_24h: string
    distinct_cities_24h: string
    distinct_bases_24h: string
  }
  trend7d: Array<{
    day: string
    variants: string
    avg_quality: string
  }>
  cityQuality7d: Array<{
    city_slug: string
    city_name: string
    variants_7d: string
    avg_quality_7d: string
  }>
}

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
    pricingClicks: number
    checkoutStarted: number
    checkoutRedirected: number
    checkoutErrors: number
    bookingClicks: number
    consultingBookingClicks: number
    bookingSources24h: Array<{ source: string; count: number }>
    consultSourceCounts: {
      consulting_pricing_starter: number
      consulting_pricing_pro: number
      consulting_pricing_scale: number
      consulting_bottom_cta: number
      enterprise_api_cta: number
    }
    consultSourceGroups: {
      pricingSlots: { count: number; sharePct: number }
      bottomCta: { count: number; sharePct: number }
      enterpriseCta: { count: number; sharePct: number }
      other: { count: number; sharePct: number }
    }
    consultDominantSourceGroup: "pricingSlots" | "bottomCta" | "enterpriseCta" | "other"
    consultInsights: {
      topSource: string
      topSourceCount: number
      topSourceSharePct: number
      sourceConcentrationLevel: "balanced" | "watch" | "critical"
    }
    consultHealth: {
      score: number
      level: "healthy" | "watch" | "critical"
      alertFlags: Array<"low_conversion" | "low_consult_mix" | "source_concentration" | "checkout_error_pressure">
      routing: {
        severity: "info" | "warn" | "page"
        action: "none" | "slack" | "pagerduty"
        reason: string
      }
      reasons: string[]
    }
    checkoutCompleted: number
    rates: {
      clickToCheckoutStartPct: number
      pricingToBookingPct: number
      consultingBookingSharePct: number
      starterSlotBookingPct: number
      proSlotBookingPct: number
      scaleSlotBookingPct: number
      bottomCtaBookingPct: number
      enterpriseCtaBookingPct: number
      checkoutStartToRedirectPct: number
      checkoutStartToCompletePct: number
      redirectToCompletePct: number
      retentionNudgeCtrPct: number
    }
    retentionNudges: {
      impressions24h: number
      clicks24h: number
      dismisses24h: number
    }
    note: string
  }
  retention: {
    overallLevel: "healthy" | "watch" | "critical"
    signals: Array<{
      key: "checkout_errors" | "click_to_start_dropoff" | "start_to_redirect_dropoff" | "consult_booking_share"
      level: "healthy" | "watch" | "critical"
      score: number
      message: string
    }>
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
  const {
    landingPageViews,
    pricingClicks,
    checkoutStarted,
    checkoutRedirected,
    checkoutErrors,
    bookingClicks,
    consultingBookingClicks,
    bookingSources24h,
    consultSourceCounts,
    consultSourceGroups,
    consultDominantSourceGroup,
    consultInsights,
    consultHealth,
    checkoutCompleted,
  } = funnel

  const steps = [
    { label: "Check-Page Views (24h)", value: landingPageViews, icon: "👁️" },
    { label: "Pricing-Intents (24h)", value: pricingClicks, icon: "🖱️" },
    { label: "Checkout Starts (24h)", value: checkoutStarted, icon: "🧾" },
    { label: "Checkout Redirects (24h)", value: checkoutRedirected, icon: "↗️" },
    { label: "Day-Pass Checkouts (24h)", value: checkoutCompleted, icon: "💳" },
  ]
  const concentrationClass =
    consultInsights.sourceConcentrationLevel === "critical"
      ? "text-red-300"
      : consultInsights.sourceConcentrationLevel === "watch"
        ? "text-yellow-300"
        : "text-green-300"

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
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Click → Checkout Start: <span className="text-cyan-300 font-bold">{funnel.rates.clickToCheckoutStartPct}%</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Pricing → Booking: <span className="text-cyan-300 font-bold">{funnel.rates.pricingToBookingPct}%</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Start → Redirect: <span className="text-cyan-300 font-bold">{funnel.rates.checkoutStartToRedirectPct}%</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Start → Complete: <span className="text-cyan-300 font-bold">{funnel.rates.checkoutStartToCompletePct}%</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Redirect → Complete: <span className="text-cyan-300 font-bold">{funnel.rates.redirectToCompletePct}%</span>
        </div>
      </div>
      <div className="mt-3 grid sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Booking Clicks (24h): <span className="text-cyan-300 font-bold">{bookingClicks.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Consulting Booking Share: <span className="text-cyan-300 font-bold">{funnel.rates.consultingBookingSharePct}%</span> · Consult Clicks: <span className="text-cyan-300 font-bold">{consultingBookingClicks.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-gray-800 bg-black/20 px-3 py-3">
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Top Booking Sources (24h)</div>
        <div className="mb-2 text-xs text-gray-400">
          Top Source: <span className="text-cyan-300 font-bold">{consultInsights.topSource}</span> ·
          Count: <span className="text-cyan-300 font-bold"> {consultInsights.topSourceCount.toLocaleString()}</span> ·
          Share: <span className="text-cyan-300 font-bold"> {consultInsights.topSourceSharePct}%</span> ·
          Concentration: <span className="text-cyan-300 font-bold"> {consultInsights.sourceConcentrationLevel}</span>
        </div>
        {bookingSources24h.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {bookingSources24h.map((entry) => (
              <div key={entry.source} className="flex items-center justify-between rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
                <span className="truncate pr-2">{entry.source}</span>
                <span className="text-cyan-300 font-bold">
                  {entry.count.toLocaleString()} · {bookingClicks > 0 ? Math.round((entry.count / bookingClicks) * 1000) / 10 : 0}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-500">No booking source data yet.</div>
        )}
      </div>
      <div className="mt-3 rounded-xl border border-gray-800 bg-black/20 px-3 py-3">
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Consult Slot Breakdown (24h)</div>
        <div className={`text-xs mb-2 ${concentrationClass}`}>
          Source concentration: {consultInsights.sourceConcentrationLevel.toUpperCase()}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Starter slot: <span className="text-cyan-300 font-bold">{consultSourceCounts.consulting_pricing_starter.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{funnel.rates.starterSlotBookingPct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Pro slot: <span className="text-cyan-300 font-bold">{consultSourceCounts.consulting_pricing_pro.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{funnel.rates.proSlotBookingPct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Scale slot: <span className="text-cyan-300 font-bold">{consultSourceCounts.consulting_pricing_scale.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{funnel.rates.scaleSlotBookingPct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Bottom CTA: <span className="text-cyan-300 font-bold">{consultSourceCounts.consulting_bottom_cta.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{funnel.rates.bottomCtaBookingPct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Enterprise CTA: <span className="text-cyan-300 font-bold">{consultSourceCounts.enterprise_api_cta.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{funnel.rates.enterpriseCtaBookingPct}%</span>
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-gray-800 bg-black/20 px-3 py-3">
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Consult Source Groups (24h)</div>
        <div className="text-xs text-gray-400 mb-2">
          Dominant group: <span className="text-cyan-300 font-bold">{consultDominantSourceGroup}</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Pricing slots: <span className="text-cyan-300 font-bold">{consultSourceGroups.pricingSlots.count.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{consultSourceGroups.pricingSlots.sharePct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Bottom CTA: <span className="text-cyan-300 font-bold">{consultSourceGroups.bottomCta.count.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{consultSourceGroups.bottomCta.sharePct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Enterprise CTA: <span className="text-cyan-300 font-bold">{consultSourceGroups.enterpriseCta.count.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{consultSourceGroups.enterpriseCta.sharePct}%</span>
          </div>
          <div className="rounded-lg border border-gray-800 px-2 py-1 text-gray-300">
            Other sources: <span className="text-cyan-300 font-bold">{consultSourceGroups.other.count.toLocaleString()}</span> · <span className="text-cyan-300 font-bold">{consultSourceGroups.other.sharePct}%</span>
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-gray-800 bg-black/20 px-3 py-3">
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Consult Health (24h)</div>
        <div className="text-sm text-gray-300 mb-1">
          Score: <span className="text-cyan-300 font-bold">{consultHealth.score}</span> ·
          Level: <span className="text-cyan-300 font-bold"> {consultHealth.level.toUpperCase()}</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Routing: <span className="text-cyan-300 font-bold">{consultHealth.routing.severity.toUpperCase()}</span> ·
          Action: <span className="text-cyan-300 font-bold"> {consultHealth.routing.action}</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Flags:{" "}
          <span className="text-cyan-300">
            {consultHealth.alertFlags.length > 0 ? consultHealth.alertFlags.join(", ") : "none"}
          </span>
        </div>
        <div className="text-xs text-gray-400 mb-2">{consultHealth.routing.reason}</div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          {consultHealth.reasons.map((reason) => (
            <div key={reason} className="rounded-lg border border-gray-800 px-2 py-1 text-gray-400">
              {reason}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Nudge Impressions: <span className="text-cyan-300 font-bold">{funnel.retentionNudges.impressions24h.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Nudge Clicks: <span className="text-cyan-300 font-bold">{funnel.retentionNudges.clicks24h.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-gray-400">
          Nudge CTR: <span className="text-cyan-300 font-bold">{funnel.rates.retentionNudgeCtrPct}%</span> · Dismisses: <span className="text-cyan-300 font-bold">{funnel.retentionNudges.dismisses24h.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-red-300">
        Checkout errors (24h): <span className="font-bold">{checkoutErrors.toLocaleString()}</span>
      </div>
      {funnel.note && (
        <div className="mt-4 text-xs text-gray-600 text-center">{funnel.note}</div>
      )}
    </div>
  )
}

function RetentionPanel({ retention }: { retention: DashData["retention"] }) {
  const levelClass =
    retention.overallLevel === "critical"
      ? "text-red-300 border-red-800 bg-red-950/30"
      : retention.overallLevel === "watch"
        ? "text-yellow-300 border-yellow-800 bg-yellow-950/30"
        : "text-green-300 border-green-800 bg-green-950/30"

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5">
      <div className={`rounded-xl border px-3 py-2 text-sm font-bold ${levelClass}`}>
        Overall retention signal: {retention.overallLevel.toUpperCase()}
      </div>
      <div className="mt-3 space-y-2">
        {retention.signals.map((signal) => (
          <div key={signal.key} className="rounded-xl border border-gray-800 bg-black/20 px-3 py-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider">{signal.key}</div>
            <div className="text-sm text-gray-200">{signal.message}</div>
            <div className="text-xs text-cyan-300 mt-1">
              level: {signal.level} · score: {signal.score}
            </div>
          </div>
        ))}
      </div>
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

function GeoMatrixPanel({ geo }: { geo: GeoMatrixData | null }) {
  if (!geo) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-black/30 p-5 text-sm text-gray-500">
        Keine Geo-Matrix-Daten verfügbar.
      </div>
    )
  }

  const topCities = geo.cityQuality7d.slice(0, 10).map((c) => ({
    city: c.city_name || c.city_slug,
    count: Number(c.variants_7d || 0),
    avgQuality: Number(c.avg_quality_7d || 0),
  }))
  const trendBars = geo.trend7d.map((d) => ({
    label: d.day.slice(5),
    value: Number(d.variants || 0),
    color: "bg-cyan-500",
  }))
  const qualityBars = geo.trend7d.map((d) => ({
    label: d.day.slice(5),
    value: Number(d.avg_quality || 0),
    color: "bg-violet-500",
  }))

  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Geo Variants (24h)" value={Number(geo.stats24h.variants_24h || 0).toLocaleString()} accent="cyan" />
        <StatCard label="Avg Quality (24h)" value={`${Number(geo.stats24h.avg_quality_24h || 0)} / 100`} accent="green" />
        <StatCard label="Distinct Cities (24h)" value={Number(geo.stats24h.distinct_cities_24h || 0).toLocaleString()} />
        <StatCard label="Distinct Base Slugs (24h)" value={Number(geo.stats24h.distinct_bases_24h || 0).toLocaleString()} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-gray-800 bg-black/20 p-3">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">7d Variant Volume</div>
          <MiniBarChart data={trendBars.length ? trendBars : [{ label: "—", value: 0 }]} />
        </div>
        <div className="rounded-xl border border-gray-800 bg-black/20 p-3">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">7d Avg Quality</div>
          <MiniBarChart data={qualityBars.length ? qualityBars : [{ label: "—", value: 0 }]} />
        </div>
      </div>

      <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Top Cities by Variant Volume (7d)</div>
      {topCities.length > 0 ? (
        <div className="space-y-2">
          {topCities.map((c) => (
            <div key={c.city} className="flex items-center justify-between rounded-xl border border-gray-800 bg-black/20 px-3 py-2 text-sm">
              <span className="text-gray-200">{c.city}</span>
              <span className="text-gray-400">Variants: <b className="text-white">{c.count}</b> · Quality: <b className="text-cyan-300">{c.avgQuality}</b></span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Noch keine Varianten vorhanden.</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main dashboard
// ---------------------------------------------------------------------------
export default function ProfitDashboard() {
  const [data, setData] = useState<DashData | null>(null)
  const [geo, setGeo] = useState<GeoMatrixData | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)
  const [blockMsg, setBlockMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    setErr(null)
    try {
      const [profitRes, geoRes] = await Promise.all([
        fetch("/api/admin/profit-analytics", { cache: "no-store" }),
        fetch("/api/admin/geo-matrix?limit=200", { cache: "no-store" }),
      ])
      if (profitRes.status === 401 || geoRes.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!profitRes.ok) {
        setErr("Fehler beim Laden des Dashboards")
        return
      }
      setData((await profitRes.json()) as DashData)
      if (geoRes.ok) {
        setGeo((await geoRes.json()) as GeoMatrixData)
      } else {
        setGeo(null)
      }
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

          {/* ── 5. Geo Matrix ── */}
          <section>
            <SectionHeader title="Geo Living Matrix" icon="🕸️" />
            <GeoMatrixPanel geo={geo} />
          </section>

          {/* ── 6. Retention Signals ── */}
          <section>
            <SectionHeader title="Retention Signals (Autopilot)" icon="🧲" />
            <RetentionPanel retention={data.retention} />
          </section>
        </>
      )}
    </div>
  )
}
