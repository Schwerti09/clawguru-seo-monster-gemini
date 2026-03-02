"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Activity, DollarSign, Shield, RefreshCw, LogOut, ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react"

type Overview = {
  now: string
  siteUrl: string
  env: { hasStripe: boolean; hasOpenAI: boolean; hasAdmin: boolean; hasWebhook: boolean; hasEmail: boolean }
  stripe?: {
    currency: string
    charges7d: number
    charges24h: number
    chargeCount7d: number
    activeSubs: number
    trialingSubs: number
    lastPayments: Array<{ created: number; amount: number; currency: string; description?: string | null }>
  }
}

function money(v: number, currency = "eur") {
  const amt = v / 100
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: currency.toUpperCase() }).format(amt)
}

export default function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)

  async function load() {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" })
      if (res.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!res.ok) {
        setErr("Fehler beim Laden")
        return
      }
      const j = (await res.json()) as Overview
      setData(j)
    } catch {
      setErr("Netzwerkfehler")
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  const stripe = data?.stripe
  const last = useMemo(() => stripe?.lastPayments || [], [stripe])
  const mrrEstimate = stripe ? Math.round((stripe.charges7d / 7) * 30) : 0
  const mrrTarget = 5_000_000
  const mrrProgress = stripe ? Math.min(100, Math.round((mrrEstimate / mrrTarget) * 100)) : 0

  const salePulses = useMemo(() => {
    const points = [
      { x: 90, y: 90, label: "North America" },
      { x: 210, y: 70, label: "Europe" },
      { x: 270, y: 110, label: "Middle East" },
      { x: 330, y: 120, label: "Asia" },
      { x: 400, y: 180, label: "Australia" },
      { x: 180, y: 160, label: "South America" },
    ]
    const activeCount = Math.max(1, Math.min(points.length, last.length))
    return points.map((point, index) => ({ ...point, active: index < activeCount }))
  }, [last.length])

  const botPulses = useMemo(
    () => [
      { x: 140, y: 60 },
      { x: 250, y: 140 },
      { x: 360, y: 80 },
    ],
    []
  )

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
  }

  function EnvBadge({ ok, label, onText = "ON", offText = "OFF", offColorClass = "text-red-300" }: { ok: boolean; label: string; onText?: string; offText?: string; offColorClass?: string }) {
    return (
      <div className="flex items-center gap-2">
        {ok ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
        <span className="text-gray-400">{label}:</span>
        <span className={ok ? "text-green-300 font-bold" : `${offColorClass} font-bold`}>{ok ? onText : offText}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4 text-cyan-400" />
          Live · auto-refresh 30s · {data?.now || "—"}
        </div>
        <div className="flex gap-3">
          <a
            href="/api/admin/logout"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </a>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {busy && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-3xl border border-gray-800 bg-black/30 text-gray-300">
          Lädt Control Center…
        </motion.div>
      )}
      {err && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 p-6 rounded-3xl border border-red-900/50 bg-red-950/30 text-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {err}
        </motion.div>
      )}

      {data && (
        <>
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                Health
              </div>
              <div className="mt-2 text-2xl font-black flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                OK
              </div>
              <div className="mt-3 text-sm text-gray-300 space-y-1.5">
                <div>
                  Site: <span className="text-gray-100 font-bold">{data.siteUrl}</span>
                </div>
                <EnvBadge ok={data.env.hasStripe} label="Stripe" />
                <div className="flex items-center gap-2">
                  {data.env.hasOpenAI ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                  <span className="text-gray-400">OpenAI:</span>
                  <span className={data.env.hasOpenAI ? "text-green-300 font-bold" : "text-orange-300 font-bold"}>{data.env.hasOpenAI ? "ON" : "OFF"}</span>
                </div>
                <EnvBadge ok={data.env.hasAdmin} label="Admin ENV" onText="OK" offText="MISSING" />
                <div className="flex items-center gap-2">
                  {data.env.hasWebhook ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                  <span className="text-gray-400">Webhooks:</span>
                  <span className={data.env.hasWebhook ? "text-green-300 font-bold" : "text-orange-300 font-bold"}>{data.env.hasWebhook ? "ON" : "OFF"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {data.env.hasEmail ? <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                  <span className="text-gray-400">Email:</span>
                  <span className={data.env.hasEmail ? "text-green-300 font-bold" : "text-orange-300 font-bold"}>{data.env.hasEmail ? "ON" : "OFF"}</span>
                </div>
              </div>
              <a href="/live" className="mt-4 inline-flex items-center gap-1 text-cyan-300 underline hover:text-cyan-200">
                Ops Wall öffnen <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30 lg:col-span-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                <DollarSign className="w-3.5 h-3.5" />
                Stripe
              </div>
              <div className="mt-2 text-2xl font-black">Revenue Snapshot</div>
              {stripe ? (
                <div className="mt-4 grid md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                    <div className="text-xs text-gray-400">24h</div>
                    <div className="mt-1 text-xl font-black">{money(stripe.charges24h, stripe.currency)}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                    <div className="text-xs text-gray-400">7d</div>
                    <div className="mt-1 text-xl font-black">{money(stripe.charges7d, stripe.currency)}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                    <div className="text-xs text-gray-400">Charges (7d)</div>
                    <div className="mt-1 text-xl font-black">{stripe.chargeCount7d}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                    <div className="text-xs text-gray-400">Active Subs</div>
                    <div className="mt-1 text-xl font-black">{stripe.activeSubs}</div>
                    <div className="text-xs text-gray-500">Trialing: {stripe.trialingSubs}</div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-gray-400">Stripe nicht konfiguriert.</div>
              )}

              {stripe && (
                <div className="mt-6 rounded-2xl border border-gray-800 bg-black/35 p-4">
                  <div className="text-xs uppercase tracking-widest text-gray-400">Profit-O-Meter (MRR)</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-3 flex-1 rounded-full bg-gray-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
                        style={{ width: `${mrrProgress}%` }}
                      />
                    </div>
                    <div className="text-sm font-black">{money(mrrEstimate, stripe.currency)}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Target: {money(mrrTarget, stripe.currency)} MRR</div>
                </div>
              )}

              {stripe && (
                <div className="mt-6">
                  <div className="text-sm font-bold text-gray-200 mb-2">Last Payments</div>
                  <div className="grid gap-2">
                    {last.slice(0, 8).map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-800 bg-black/35">
                        <div className="text-sm text-gray-300">
                          {new Date(p.created * 1000).toLocaleString("de-DE")}
                          <span className="text-gray-500"> · </span>
                          <span className="text-gray-400">{p.description || "—"}</span>
                        </div>
                        <div className="font-black">{money(p.amount, p.currency)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="text-xs uppercase tracking-widest text-gray-400">Growth</div>
              <div className="mt-2 text-2xl font-black">Loop Controls</div>
              <div className="mt-4 flex flex-col gap-3">
                <a className="px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 text-center" href="/check">
                  Score → Badge → Share
                </a>
                <a className="px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-center" href="/admin/dashboard">
                  🚀 Management Cockpit
                </a>
                <a className="px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-green-600 to-cyan-600 hover:opacity-90 text-center" href="/admin/profit-dashboard">
                  💰 Profit Dashboard
                </a>
                <a className="px-4 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center" href="/copilot">
                  Copilot Runbooks
                </a>
                <a className="px-4 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 text-center" href="/runbooks">
                  1000 Runbooks
                </a>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Tipp: UTM-Links überall. Share-Badges erzeugen „free distribution“.
              </div>
            </motion.div>

            <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30 lg:col-span-2">
              <div className="text-xs uppercase tracking-widest text-gray-400">Quick Checks</div>
              <div className="mt-2 text-2xl font-black">Website Health</div>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                {[
                  ["Health Endpoint", "/api/health", "Schnell-OK"],
                  ["Ops Feed", "/api/live-wall", "Live Data"],
                  ["Sitemaps", "/sitemaps/main.xml", "Indexing"]
                ].map(([t, href, d]) => (
                  <a key={href} href={href} className="p-4 rounded-2xl border border-gray-800 bg-black/35 hover:bg-black/45 transition-colors">
                    <div className="font-black">{t}</div>
                    <div className="text-xs text-gray-500 mt-1">{d}</div>
                    <div className="text-sm text-cyan-300 mt-2 underline">{href}</div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-xs uppercase tracking-widest text-gray-400">Global Pulse Map</div>
            <div className="mt-2 text-2xl font-black">Live Crawl & Sales Activity</div>
            <div className="mt-4 rounded-2xl border border-gray-800 bg-black/40 p-4">
              <svg viewBox="0 0 480 240" className="w-full h-56 text-cyan-200">
                <rect x="20" y="60" width="120" height="60" rx="30" fill="rgba(255,255,255,0.05)" />
                <rect x="140" y="50" width="140" height="70" rx="28" fill="rgba(255,255,255,0.05)" />
                <rect x="260" y="80" width="150" height="70" rx="32" fill="rgba(255,255,255,0.05)" />
                <rect x="150" y="140" width="80" height="60" rx="24" fill="rgba(255,255,255,0.05)" />
                <rect x="350" y="150" width="80" height="50" rx="24" fill="rgba(255,255,255,0.05)" />
                {salePulses.map((pulse) => (
                  <circle
                    key={pulse.label}
                    cx={pulse.x}
                    cy={pulse.y}
                    r={pulse.active ? 6 : 4}
                    className={pulse.active ? "fill-emerald-400 animate-pulse" : "fill-emerald-400/50"}
                  />
                ))}
                {botPulses.map((pulse, index) => (
                  <circle
                    key={`bot-${index}`}
                    cx={pulse.x}
                    cy={pulse.y}
                    r={3}
                    className="fill-cyan-400/70 animate-pulse"
                  />
                ))}
              </svg>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Sales pulse
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Crawler pulse
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
