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
  geminiUsage?: {
    date: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    totalCostEur: number
    requestCount: number
    hardLimitEur: number
    hardLimitReached: boolean
    updatedAt: string
  }
}

function money(v: number, currency = "eur") {
  const amt = v / 100
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: currency.toUpperCase() }).format(amt)
}

function eur(v: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v)
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
  const gemini = data?.geminiUsage

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

          {gemini && (
            <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                <Activity className="w-3.5 h-3.5" />
                Gemini Token-Burn
              </div>
              <div className="mt-2 text-2xl font-black flex items-center gap-2">
                <span className={gemini.hardLimitReached ? "text-red-300" : "text-cyan-300"}>
                  {eur(gemini.totalCostEur)}
                </span>
                <span className="text-sm text-gray-500">heute</span>
              </div>
              <div className="mt-4 grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                  <div className="text-xs text-gray-400">Tokens</div>
                  <div className="mt-1 text-xl font-black">{gemini.totalTokens.toLocaleString("de-DE")}</div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                  <div className="text-xs text-gray-400">Prompt</div>
                  <div className="mt-1 text-xl font-black">{gemini.promptTokens.toLocaleString("de-DE")}</div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                  <div className="text-xs text-gray-400">Output</div>
                  <div className="mt-1 text-xl font-black">{gemini.completionTokens.toLocaleString("de-DE")}</div>
                </div>
                <div className="p-4 rounded-2xl border border-gray-800 bg-black/35">
                  <div className="text-xs text-gray-400">Requests</div>
                  <div className="mt-1 text-xl font-black">{gemini.requestCount}</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 flex flex-wrap items-center gap-2">
                <span>Hard-Limit: {eur(gemini.hardLimitEur)}</span>
                <span>·</span>
                <span>Letztes Update: {new Date(gemini.updatedAt).toLocaleTimeString("de-DE")}</span>
                {gemini.hardLimitReached && (
                  <span className="px-2 py-0.5 rounded-full bg-red-950/40 text-red-300 border border-red-800">
                    Limit erreicht – Runbooks pausiert
                  </span>
                )}
              </div>
            </motion.div>
          )}

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
        </>
      )}
    </div>
  )
}
