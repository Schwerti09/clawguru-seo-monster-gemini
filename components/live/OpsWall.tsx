"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useI18n } from "@/components/i18n/I18nProvider"
import { RUNBOOK_COUNT_SHORT_EN, STATS } from "@/lib/stats"
import { pick } from "@/lib/i18n-pick"

type LivePayload = {
  updatedAt: string
  day: string
  counts: { runbooks: number; tags: number }
  pulse: number
  sessions?: number
  topTags: { name: string; count: number }[]
  issueCounts: { name: string; count: number }[]
  trending: { slug: string; title: string; summary: string; tags: string[] }[]
  cves?: { cveId: string; name: string; severity: string; cvssScore: number; publishedDate: string; tags: string[] }[]
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
    "nginx", "webhook", "ssl", "docker", "secrets", "oauth", "sso", "redis", "postgres",
    "cdn", "cache", "ci/cd", "vercel", "nextjs", "rate-limit", "cors", "k8s", "helm", "kafka", "vault"
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
  // Slugs use the valid 100k format: {provider}-{service}-{issue}-{year}
  const trending = [
    { slug: "hetzner-nginx-hardening-2026", title: "Nginx Hardening auf Hetzner 2026", summary: "Upstreams prüfen, timeouts erhöhen, health-checks, TLS.", tags: ["nginx", "hardening", "hetzner"] },
    { slug: "aws-docker-secret-rotation-2026", title: "Docker Secret Rotation auf AWS 2026", summary: "Signing-Secret, ENV-Leak vermeiden, Vault-Mounts.", tags: ["docker", "secrets", "aws"] },
    { slug: "kubernetes-kubernetes-hardening-2026", title: "Kubernetes Hardening 2026", summary: "RBAC, PSS, Netzwerkrichtlinien, Admission Control.", tags: ["k8s", "hardening"] },
    { slug: "hetzner-redis-hardening-2026", title: "Redis Hardening auf Hetzner 2026", summary: "Auth, maxmemory, eviction policy, TLS.", tags: ["redis", "hardening"] },
    { slug: "aws-postgres-hardening-2026", title: "PostgreSQL Hardening auf AWS 2026", summary: "Pooling, pgbouncer, least privilege, audit logs.", tags: ["postgres", "hardening"] },
    { slug: "gcp-nginx-rate-limiting-2026", title: "Nginx Rate Limiting auf GCP 2026", summary: "limit_req_zone, burst, 429-Handling.", tags: ["nginx", "rate-limiting"] },
    { slug: "azure-kubernetes-rbac-misconfig-2026", title: "Kubernetes RBAC Misconfiguration auf Azure 2026", summary: "Service accounts, cluster-admin, audit.", tags: ["k8s", "rbac"] },
    { slug: "hetzner-nginx-cors-misconfig-2026", title: "CORS Misconfiguration Nginx auf Hetzner 2026", summary: "Allowed origins, headers, preflight.", tags: ["nginx", "cors"] },
    { slug: "aws-vault-secrets-management-2026", title: "Vault Secrets Management auf AWS 2026", summary: "KV-v2, dynamic secrets, rotation.", tags: ["vault", "secrets"] },
    { slug: "hetzner-docker-container-escape-2026", title: "Docker Container Escape auf Hetzner 2026", summary: "Seccomp, capabilities drop, rootless Docker.", tags: ["docker", "security"] }
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
  const [visibleCount, setVisibleCount] = useState(24)
  const prefersReduced = useReducedMotion()
  const [rel, setRel] = useState<string>("")
  const [cves, setCves] = useState<
    { cveId: string; name: string; severity: string; cvssScore: number; publishedDate: string; tags: string[] }[] | null
  >(null)
  const [visibleCveCount, setVisibleCveCount] = useState(12)
  const [buying, setBuying] = useState<null | "daypass" | "pro">(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const TOTAL_COUNT = STATS.totalRunbooks
  const totalShort = useMemo(() => {
    try {
      const isDE = String(locale).toLowerCase().startsWith("de")
      const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
      if (TOTAL_COUNT >= 1_000_000_000) {
        const v = TOTAL_COUNT / 1_000_000_000
        return `${nf.format(v)}${pick(isDE, " Mrd", "B")}+`
      }
      if (TOTAL_COUNT >= 1_000_000) {
        const v = TOTAL_COUNT / 1_000_000
        return `${nf.format(v)}${pick(isDE, " Mio", "M")}+`
      }
      if (TOTAL_COUNT >= 1_000) {
        const v = TOTAL_COUNT / 1_000
        return `${nf.format(v)}${pick(isDE, " Tsd", "K")}+`
      }
      return new Intl.NumberFormat(locale).format(TOTAL_COUNT)
    } catch {
      return `${RUNBOOK_COUNT_SHORT_EN}+`
    }
  }, [locale])
  const totalExact = useMemo(() => new Intl.NumberFormat(locale).format(TOTAL_COUNT), [locale, TOTAL_COUNT])

  async function checkout(product: "daypass" | "pro") {
    try {
      setBuying(product)
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      })
      const json = await res.json().catch(() => null)
      const url = (json && typeof json.url === "string") ? json.url : null
      if (url) {
        window.location.href = url
        return
      }
      window.location.href = `${prefix}/pricing`
    } catch {
      window.location.href = `${prefix}/pricing`
    } finally {
      setBuying(null)
    }
  }

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
    if (!data) {
      const s = makeSynthetic()
      setData(s)
      setSynthetic(true)
      setErr(null)
    }
    load()
    const t = setInterval(load, 60000)
    return () => {
      clearInterval(t)
      if (ctrlRef.current) ctrlRef.current.abort()
    }
  }, [])

  useEffect(() => {
    function computeRelative(iso?: string) {
      if (!iso) return "—"
      const d = new Date(iso).getTime()
      const s = Math.max(0, Math.round((Date.now() - d) / 1000))
      if (s < 60) return `${s}s`
      const m = Math.floor(s / 60)
      if (m < 60) return `${m}m`
      const h = Math.floor(m / 60)
      return `${h}h`
    }
    setRel(computeRelative(data?.updatedAt))
    const id = setInterval(() => setRel(computeRelative(data?.updatedAt)), 1000)
    return () => clearInterval(id)
  }, [data?.updatedAt])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const mod: any = await import("@/lib/cve-pseo")
        const arr = Array.isArray(mod.KNOWN_CVES) ? mod.KNOWN_CVES.slice() : []
        arr.sort((a: any, b: any) => String(b.publishedDate || "").localeCompare(String(a.publishedDate || "")))
        const small = arr.slice(0, 24).map((e: any) => ({
          cveId: e.cveId,
          name: e.name,
          severity: e.severity,
          cvssScore: e.cvssScore,
          publishedDate: e.publishedDate,
          tags: e.tags || [],
        }))
        if (mounted) setCves(small)
      } catch {
        if (mounted) setCves(null)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Heavy client-side pseo computation removed – was causing ~60s UI freeze.
  // Trending data comes from /api/live-wall or the synthetic fallback above.

  useEffect(() => {
    setVisibleCount(24)
  }, [data?.trending?.length, synthetic])

  const incidentLink = useMemo(() => {
    const base = incident.trim()
      ? `Ich habe ein Incident-Symptom: ${incident.trim()}. Gib mir ein Runbook mit Steps + Checks.`
      : `Ich will eine Härtungs-Session: gib mir ein Runbook für sichere Defaults (Firewall, SSH, Secrets, Webhooks).`
    return `${prefix}/copilot?q=${encodeURIComponent(base)}`
  }, [incident, prefix])

  const baseTrending = useMemo(() => {
    const src = (data?.trending && data.trending.length > 0) ? data.trending : makeSynthetic().trending
    return src
  }, [data?.trending])

  const expandedTrending = useMemo(() => {
    if (!baseTrending.length) return [] as LivePayload["trending"]
    const target = Math.max(300, baseTrending.length)
    const out: LivePayload["trending"] = []
    for (let i = 0; i < target; i++) out.push(baseTrending[i % baseTrending.length]!)
    return out
  }, [baseTrending])

  const filteredTrending = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return expandedTrending
    return expandedTrending.filter((t) => {
      if (t.title.toLowerCase().includes(s)) return true
      if (t.summary.toLowerCase().includes(s)) return true
      if (t.tags.some((tg) => tg.toLowerCase().includes(s))) return true
      return false
    })
  }, [expandedTrending, q])

  const visibleTrending = useMemo(() => filteredTrending.slice(0, Math.min(visibleCount, filteredTrending.length)), [filteredTrending, visibleCount])
  const lowActivity = (data?.trending?.length || 0) < 50
  const pillText = `${synthetic ? "Synthetic Pulse" : "Live Pulse"}: ${data?.pulse ?? 87}% · ${totalShort} Library`

  return (
    <div ref={rootRef} className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="text-xl md:text-2xl font-black tracking-tight">LIVE OPS WALL – Neueste Viren & Hot Threats</div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              <span className="relative">
                {totalShort} Runbooks generierbar
                <span
                  className="absolute -inset-1.5 -z-10 rounded-full blur-2xl opacity-40"
                  style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(0,184,255,0.25), rgba(0,0,0,0))" }}
                />
              </span>
            </div>
            <div className="text-xs text-gray-400">≈ {totalExact} potenzielle Fixes · Live zeigt Top 100 hot + trending – Rest on‑demand</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-200 text-xs font-bold">
              {pillText}
            </div>
            <div className="px-3 py-1.5 rounded-full text-[11px] font-extrabold text-white"
              style={{ background: "linear-gradient(90deg, rgba(0,255,157,0.25), rgba(0,184,255,0.25))", boxShadow: "0 0 24px rgba(0,184,255,0.25) inset, 0 0 14px rgba(0,255,157,0.25)" }}
            >
              {totalShort} Badge
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Suche in ${totalShort} Runbooks…`}
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <a
            href={`${prefix}/runbooks?q=${encodeURIComponent(q.trim())}`}
            className="px-4 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-gray-700 font-bold"
          >
            Suchen
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-3">
          <div className="text-sm font-bold text-gray-200">Freischalten</div>
          <div className="flex items-center gap-2">
            <button onClick={() => checkout("daypass")} disabled={buying === "daypass"} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-green-500 text-white font-bold hover:opacity-90 disabled:opacity-60">
              Daypass 9,99 € – 24h Full Live Feed
            </button>
            <button onClick={() => checkout("pro")} disabled={buying === "pro"} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold hover:opacity-90 disabled:opacity-60">
              Pro 29 €/Monat – Unbegrenzter Zugriff + Alerts
            </button>
            <a href={`${prefix}/pricing`} className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200">
              Team 99 €/Monat – Collaboration + Enterprise
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 relative overflow-hidden">
          <div className="text-xs text-gray-500 mb-2">
            Ops Pulse {synthetic ? "(synthetic fallback)" : "(live)"}
          </div>
          <div className="flex items-end gap-3">
            <div className="relative">
              <div className="text-5xl font-black relative z-10">{data?.sessions ?? data?.pulse ?? "—"}</div>
              {!prefersReduced && (
                <>
                  <motion.div
                    className="absolute inset-[-10px] rounded-full border border-cyan-500/30"
                    initial={{ scale: 0.95, opacity: 0.6 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-[-18px] rounded-full border border-cyan-500/20"
                    initial={{ scale: 0.9, opacity: 0.5 }}
                    animate={{ scale: 1.18, opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  />
                </>
              )}
            </div>
            <div className="pb-2 text-sm text-gray-300">aktive “Sessions”</div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Updated: {data ? fmtTime(data.updatedAt) : "—"} ({rel}) · Day: {data?.day ?? "—"}
          </div>
          <div className="mt-4 h-2 rounded-full bg-gray-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan to-brand-violet"
              style={{ width: `${Math.min(100, Math.max(5, (data?.pulse ?? 87))) }%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 transition-all will-change-transform hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(34,211,238,0.25)]">
          <div className="text-xs text-gray-500 mb-2">Library</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-black">{totalExact}</div>
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

        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 transition-all will-change-transform hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(34,211,238,0.25)]">
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
        <div className="p-6 rounded-3xl border border-gray-800 bg-black/30 relative overflow-hidden">
          {lowActivity ? (
            <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.08),transparent_70%)] motion-safe:animate-pulse" />
          ) : null}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="text-lg font-black">Top 100 Trending Runbooks</div>
            <a href={`${prefix}/runbooks`} className="text-sm text-cyan-300 hover:text-cyan-200 underline">
              alle Runbooks →
            </a>
          </div>

          {lowActivity ? (
            <div className="mb-4 relative z-10 text-xs text-cyan-200">
              Beispiel-Feed bei niedriger Aktivität · Demo‑Ansicht
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
            {visibleTrending.map((t, idx) => (
              <a
                key={`${t.slug}-${idx}`}
                href={`${prefix}/runbook/${t.slug}`}
                className="group block p-4 rounded-2xl border border-gray-800 bg-black/20 hover:bg-black/30 transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)_inset,0_10px_24px_-12px_rgba(34,211,238,0.35)] relative overflow-hidden"
                onMouseDown={(e) => {
                  if (prefersReduced) return
                  const el = (e.currentTarget as HTMLAnchorElement)
                  const burst = document.createElement('span')
                  burst.className = 'pointer-events-none absolute w-24 h-24 rounded-full'
                  const rect = el.getBoundingClientRect()
                  burst.style.left = `${e.clientX - rect.left - 48}px`
                  burst.style.top = `${e.clientY - rect.top - 48}px`
                  burst.style.background = 'radial-gradient(circle, rgba(0,184,255,0.5) 0%, rgba(0,184,255,0.15) 40%, rgba(0,184,255,0) 70%)'
                  burst.style.filter = 'blur(1px)'
                  burst.style.opacity = '0.9'
                  burst.style.transform = 'scale(0.6)'
                  burst.style.transition = 'transform 420ms cubic-bezier(0.16,1,0.3,1), opacity 420ms'
                  el.appendChild(burst)
                  requestAnimationFrame(() => {
                    burst.style.transform = 'scale(1.35)'
                    burst.style.opacity = '0'
                  })
                  setTimeout(() => burst.remove(), 450)
                }}
              >
                {!prefersReduced && (
                  <div className="pointer-events-none absolute inset-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute block w-1.5 h-1.5 rounded-full bg-cyan-400/70 opacity-0 translate-y-0 translate-x-0 scale-75 group-hover:opacity-0 group-hover:scale-110"
                        style={{
                          top: `${(i * 17 + idx * 7) % 90 + 5}%`,
                          left: `${(i * 23 + idx * 11) % 90 + 5}%`,
                          boxShadow: "0 0 10px rgba(0,184,255,0.6)",
                          transition: "transform 400ms cubic-bezier(0.16,1,0.3,1), opacity 400ms",
                          transform: `translate(${((i%2)*2-1)*6}px, ${(((i+1)%2)*2-1)*6}px)`
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="font-bold text-gray-100">{t.title}</div>
                <div className="mt-1 text-sm text-gray-400">{t.summary}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((x) => (
                    <span key={`${x}-${idx}`} className="px-2 py-1 rounded-lg border border-gray-800 bg-black/30 text-xs text-gray-300">
                      {x}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {visibleCount < expandedTrending.length ? (
            <div className="mt-4 flex justify-center relative z-10">
              <button
                onClick={() => setVisibleCount((v) => Math.min(v + 50, expandedTrending.length))}
                className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 bg-black/40 text-gray-200 font-bold"
              >
                Mehr laden (+50)
              </button>
            </div>
          ) : null}
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

          <div className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-lg font-black mb-4">Neueste Viren (CVE‑Pulse)</div>
            <div className="space-y-2">
              {(cves || []).slice(0, visibleCveCount).map((x) => (
                <a
                  key={x.cveId}
                  href={`${prefix}/solutions/fix/${x.cveId}`}
                  className="flex items-center justify-between px-3 py-2 rounded-2xl border border-gray-800 bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-gray-700 text-gray-300">{x.cveId}</span>
                    <span className="text-sm font-bold text-gray-100">{x.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${x.severity === "critical" ? "bg-red-600/20 border border-red-600/50 text-red-200" : x.severity === "high" ? "bg-orange-600/20 border border-orange-600/50 text-orange-200" : "bg-yellow-600/20 border border-yellow-600/50 text-yellow-200"} text-xs font-bold px-2 py-0.5 rounded-full`}>{x.severity.toUpperCase()}</span>
                    <span className="text-xs text-gray-400">{(x.cvssScore as any)?.toFixed ? (x.cvssScore as any).toFixed(1) : x.cvssScore}</span>
                  </div>
                </a>
              ))}
            </div>
            {cves && visibleCveCount < cves.length ? (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setVisibleCveCount((v) => v + 10)}
                  className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 bg-black/40 text-gray-200 font-bold"
                >
                  Mehr laden (+10)
                </button>
              </div>
            ) : null}
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
