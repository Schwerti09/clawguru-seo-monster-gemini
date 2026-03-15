import { NextResponse } from "next/server"

export const runtime = "edge"
export const dynamic = "force-dynamic"

let CACHE: { body: any; expiresAt: number } | null = null
const CACHE_TTL_MS = 60 * 1000

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pickUnique<T>(arr: T[], n: number, rnd: () => number) {
  const copy = [...arr]
  const out: T[] = []
  while (copy.length && out.length < n) {
    const i = Math.floor(rnd() * copy.length)
    out.push(copy.splice(i, 1)[0]!)
  }
  return out
}

function countTop<T extends string>(items: T[]) {
  const map = new Map<string, number>()
  for (const x of items) map.set(x, (map.get(x) || 0) + 1)
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([name, count]) => ({ name, count }))
}

function summarize(body: any) {
  if (!body) return null
  return {
    updatedAt: body.updatedAt,
    day: body.day,
    counts: body.counts,
    pulse: body.pulse,
    topTagsLen: Array.isArray(body.topTags) ? body.topTags.length : 0,
    trendingLen: Array.isArray(body.trending) ? body.trending.length : 0,
    issueCountsLen: Array.isArray(body.issueCounts) ? body.issueCounts.length : 0
  }
}

function isMeaningfulPayload(p: any) {
  if (!p) return false
  const listsOk = (Array.isArray(p.topTags) && p.topTags.length > 0) || (Array.isArray(p.trending) && p.trending.length > 0)
  const countsOk = p.counts && (p.counts.runbooks ?? 0) + (p.counts.tags ?? 0) > 0
  return Boolean(listsOk || countsOk)
}

function syntheticPayload(now = new Date()) {
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
    updatedAt: now.toISOString(),
    day: isoDate(now),
    counts: { runbooks: 100, tags: 20 },
    pulse: 87,
    topTags,
    issueCounts,
    trending
  }
}

export async function GET() {
  if (CACHE && Date.now() < CACHE.expiresAt) {
    const resp = NextResponse.json(CACHE.body, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
      }
    })
    console.log("live-wall fetch", { status: "cache", data: summarize(CACHE.body), error: null })
    return resp
  }

  let status: "ok" | "fallback" | "error" = "ok"
  let payload: any = null
  let error: any = null

  try {
    const { RUNBOOKS, allTags } = await import("@/lib/pseo")
    const now = new Date()
    const day = isoDate(now)
    const seed = hash(day)
    const rnd = mulberry32(seed)

    const tags = allTags()
    const topTags = countTop(RUNBOOKS.flatMap((r) => r.tags))

    const issueKeywords = [
      "502",
      "503",
      "504",
      "ECONNRESET",
      "ETIMEDOUT",
      "webhook",
      "signature",
      "CORS",
      "rate limit",
      "SSH",
      "firewall",
      "nginx",
      "docker",
      "secrets",
      "env",
      "redis",
      "postgres",
      "neon",
      "oauth",
      "cookie"
    ]

    const issueCounts = issueKeywords
      .map((k) => {
        const key = k.toLowerCase()
        const count = RUNBOOKS.filter((r) => (r.title + " " + r.summary).toLowerCase().includes(key)).length
        return { name: k, count }
      })
      .filter((x) => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const trending = pickUnique(RUNBOOKS, 10, rnd).map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      tags: r.tags.slice(0, 4)
    }))

    const t = now.getTime() / 1000
    const pulse = Math.round(60 + 18 * Math.sin(t / 18) + 11 * Math.sin(t / 7) + rnd() * 7)

    payload = {
      updatedAt: now.toISOString(),
      day,
      counts: {
        runbooks: RUNBOOKS.length,
        tags: tags.length
      },
      pulse: Math.max(7, pulse),
      topTags,
      issueCounts,
      trending
    }

    if (!isMeaningfulPayload(payload)) {
      status = "fallback"
      payload = syntheticPayload(now)
    }
  } catch (e: any) {
    status = "error"
    error = e?.message || String(e)
    const now = new Date()
    payload = syntheticPayload(now)
  }

  CACHE = { body: payload, expiresAt: Date.now() + CACHE_TTL_MS }
  console.log("live-wall fetch", { status, data: summarize(payload), error })
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
    }
  })
}
