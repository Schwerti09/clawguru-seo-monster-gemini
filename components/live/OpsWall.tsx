"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"

type LivePayload = {
  updatedAt: string
  day: string
  counts: { runbooks: number; tags: number }
  pulse: number
  sessions?: number
  topTags: { name: string; count: number }[]
  issueCounts: { name: string; count: number }[]
  trending: { slug: string; title: string; summary: string; tags: string[] }[]
}

function isMeaningful(p: Partial<LivePayload> | null | undefined): p is LivePayload {
  if (!p) return false
  const hasLists = Boolean((p.topTags && p.topTags.length) || (p.trending && p.trending.length) || (p.issueCounts && p.issueCounts.length))
  const hasCounts = Boolean(p.counts && (p.counts.runbooks ?? 0) + (p.counts.tags ?? 0) > 0)
  return hasLists || hasCounts
}

function makeSynthetic(): LivePayload {
  const now = new Date().toISOString()
  const tags = [
    "nginx", "webhook", "ssl", "docker", "secrets", "stripe", "oauth", "sso", "redis", "postgres",
    "cdn", "cache", "ci/cd", "vercel", "nextjs", "rate-limit", "cors", "k8s", "helm", "kafka"
  ]
  const topTags = tags.slice(0, 20).map((name, i) => ({ name, count: 5 + ((i * 3) % 17) }))
  const issueCounts = [
    { name: "5xx", count: 14 },
    { name: "DB", count: 9 },
    { name: "Cache", count: 7 },
    { name: "Webhook", count: 11 },
    { name: "Auth", count: 6 },
    { name: "Build", count: 4 }
  ]
  const trending = [
    { slug: "nginx-502-gateway-timeout", title: "Nginx 502 Gateway Timeout fixen", summary: "Upstreams prüfen, timeouts erhöhen, health-checks.", tags: ["nginx", "timeouts", "upstream"] },
    { slug: "stripe-webhook-signature-mismatch", title: "Stripe Webhook: Signature mismatch", summary: "Signing-Secret, raw body, clock skew.", tags: ["stripe", "webhook", "security"] },
    { slug: "docker-secrets-best-practices", title: "Docker Secrets Best Practices", summary: "Kein ENV-Leak, mounts, rotation.", tags: ["docker", "secrets"] },
    { slug: "cdn-cache-busting-strategies", title: "CDN Cache Busting Strategien", summary: "s-maxage, stale-while-revalidate, keys.", tags: ["cdn", "cache"] },
    { slug: "postgres-connections", title: "Postgres: Too many connections", summary: "Pooling, pgbouncer, idle-killer.", tags: ["postgres", "pool"] },
    { slug: "oauth-callback-mismatch", title: "OAuth Callback Mismatch", summary: "Origin korrekt setzen, redirect-URIs prüfen.", tags: ["oauth", "sso"] },
    { slug: "k8s-crashloopbackoff", title: "K8s CrashLoopBackOff", summary: "Probes, resources, logs.", tags: ["k8s", "probes"] },
    { slug: "cors-preflight-fail", title: "CORS Preflight Fail", summary: "Allowed origins, headers, methods.", tags: ["cors", "security"] },
    { slug: "redis-evictions", title: "Redis Evictions", summary: "Maxmemory, eviction policy, sizing.", tags: ["redis", "memory"] },
    { slug: "nextjs-edge-timeout", title: "Next.js Edge Timeout", summary: "Runtime wählen, payload minimieren, streaming.", tags: ["nextjs", "vercel"] }
  ]
  return {
    updatedAt: now,
    day: new Date().toLocaleDateString(undefined, { weekday: "short" }),
    counts: { runbooks: 100, tags: 20 },
    pulse: 87,
    sessions: 5,
    topTags,
    issueCounts,
    trending
  }
}

function fmtTime(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  } catch {
    return iso
  }
}

export default function OpsWall() {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const [data, setData] = useState<LivePayload | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [incident, setIncident] = useState("")
  const [synthetic, setSynthetic] = useState(false)
  const ctrlRef = useRef<AbortController | null>(null)

  async function load() {
    try {
      if (ctrlRef.current) ctrlRef.current.abort()
      const ctrl = new AbortController()
      ctrlRef.current = ctrl
      const res = await fetch("/api/live-wall", { cache: "default", signal: ctrl.signal })
      if (!res.ok) throw new Error("Live Feed nicht erreichbar")
      const json = (await res.json()) as Partial<LivePayload>
      if (isMeaningful(json)) {
        setData(json as LivePayload)
        setSynthetic(false)
        setErr(null)
      } else {
        const s = makeSynthetic()
        setData(s)
        setSynthetic(true)
        setErr(null)
        console.warn("/api/live-wall returned empty – using synthetic fallback")
      }
    } catch (e: unknown) {
      const s = makeSynthetic()
      setData(s)
      setSynthetic(true)
      setErr(e instanceof Error ? e.message : "Live Feed Fehler")
    }
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 60000)
    return () => {
      clearInterval(t)
      if (ctrlRef.current) ctrlRef.current.abort()
    }
  }, [])

  const incidentLink = useMemo(() => {
    const base = incident.trim()
      ? `Ich habe ein Incident-Symptom: ${incident.trim()}. Gib mir ein Runbook mit Steps + Checks.`
      : `Ich will eine Härtungs-Session: gib mir ein Runbook für sichere Defaults (Firewall, SSH, Secrets, Webhooks).`
    return `${prefix}/copilot?q=${encodeURIComponent(base)}`
  }, [incident, prefix])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
          <div className="text-xs text-gray-500 mb-2">
            Ops Pulse {synthetic ? "(synthetic fallback)" : "(live)"}
          </div>
          <div className="flex items-end gap-3">
            <div className="text-5xl font-black">{data?.sessions ?? data?.pulse ?? "—"}</div>
            <div className="pb-2 text-sm text-gray-300">aktive “Sessions”</div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Updated: {data ? fmtTime(data.updatedAt) : "—"} · Day: {data?.day ?? "—"}
          </div>
          <div className="mt-4 h-2 rounded-full bg-gray-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan to-brand-violet"
              style={{ width: `${Math.min(100, Math.max(5, (data?.pulse ?? 87))) }%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
          <div className="text-xs text-gray-500 mb-2">Library</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-black">{data?.counts?.runbooks ?? "—"}</div>
              <div className="text-sm text-gray-300">Runbooks</div>
            </div>
            <div>
              <div className="text-3xl font-black">{data?.counts?.tags ?? "—"}</div>
              <div className="text-sm text-gray-300">Tags</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Alles indexierbar. Alles verlinkbar. Alles “problem → fix → verify”.
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
          <div className="text-xs text-gray-500 mb-2">Fast Actions</div>

          <div className="space-y-3">
            <div>
              <div className="text-sm font-bold mb-2">Runbooks durchsuchen</div>
              <div className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="z.B. 502, webhook, nginx map, docker secrets…"
                  className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <a
                  href={`${prefix}/runbooks?q=${encodeURIComponent(q.trim())}`}
                  className="px-4 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-gray-700 font-bold"
                >
                  Go
                </a>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold mb-2">Incident starten</div>
              <input
                value={incident}
                onChange={(e) => setIncident(e.target.value)}
                placeholder="Symptom in 1 Satz… (z.B. Stripe webhook signature mismatch)"
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={incidentLink}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 font-bold text-white"
                >
                  Copilot öffnen →
                </a>
                <a
                  href={`${prefix}/check`}
                  className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors"
                >
                  Score prüfen
                </a>
              </div>
            </div>
          </div>

          {err ? (
            <div className="mt-4 text-sm text-red-200 flex items-center gap-3">
              <span>{err} – Synthetic Mode aktiv</span>
              <button
                onClick={() => load()}
                className="px-3 py-1 rounded-lg border border-red-500/50 hover:border-red-400 text-red-200/90 hover:text-white transition-colors"
              >
                Retry
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-black">Trending Fixes</div>
            <a href={`${prefix}/runbooks`} className="text-sm text-cyan-300 hover:text-cyan-200 underline">
              alle Runbooks →
            </a>
          </div>

          <div className="space-y-3">
            {(data?.trending || []).map((t) => (
              <a
                key={t.slug}
                href={`${prefix}/runbook/${t.slug}`}
                className="block p-4 rounded-2xl border border-gray-800 bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div className="font-bold text-gray-100">{t.title}</div>
                <div className="mt-1 text-sm text-gray-400">{t.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((x) => (
                    <span key={x} className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300">
                      {x}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-lg font-black mb-4">Top Tags</div>
            <div className="grid grid-cols-2 gap-2">
              {(data?.topTags || []).slice(0, 12).map((t) => (
                <a
                  key={t.name}
                  href={`${prefix}/tag/${encodeURIComponent(t.name)}`}
                  className="px-3 py-2 rounded-2xl border border-gray-800 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-bold">{t.name}</span>
                  <span className="text-xs text-gray-400">{t.count}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Diese Tags sind aus der Runbook-Library aggregiert (keine Userdaten).
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-lg font-black mb-4">Hot Issues</div>
            <div className="space-y-2">
              {(data?.issueCounts || []).map((x) => (
                <div key={x.name} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-bold text-gray-200">{x.name}</div>
                  <div className="flex-1 h-2 rounded-full bg-gray-900 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-violet"
                      style={{ width: `${Math.min(100, Math.max(3, (x.count / (data?.counts?.runbooks || 1)) * 220))}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-xs text-gray-400">{x.count}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              “Hot” = Häufigkeit in Titles/Summaries der Library, nicht aus deinen Logs.
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-gray-800 bg-gradient-to-br from-cyan-950/20 to-blue-950/10">
        <div className="text-2xl font-black mb-2">Make it a conversation.</div>
        <p className="text-gray-300">
          Das Ziel ist nicht “Content”. Das Ziel ist Rückkehr: Score → Runbook → Fix → Re-Check → Share → Team-Workflow.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={`${prefix}/check`} className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 font-bold text-white">
            Security-Check
          </a>
          <a href={`${prefix}/copilot`} className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
            Copilot
          </a>
          <a href={`${prefix}/pricing`} className="px-5 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
            Pro / Team
          </a>
        </div>
      </div>
    </div>
  )
}
