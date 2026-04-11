import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 15

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
  // Slugs use valid 100k format (provider-service-issue-year) so card links don't 404
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
    updatedAt: now.toISOString(),
    day: isoDate(now),
    counts: { runbooks: 100, tags: 20 },
    pulse: 87,
    sessions: 5,
    topTags,
    issueCounts,
    trending
  }
}

export const getLiveWallCached = unstable_cache(
  async () => {
    let status: "ok" | "fallback" | "error" = "ok"
    let payload: any = null
    let error: any = null

    try {
      const { materializedRunbooks } = await import("@/lib/pseo")
      const cveMod: any = await import("@/lib/cve-pseo").catch(() => null)
      const now = new Date()
      const day = isoDate(now)
      const seed = hash(day)
      const rnd = mulberry32(seed)

      const allRunbooks = materializedRunbooks()
      const RB = allRunbooks.slice(0, Math.min(5000, allRunbooks.length))
      const topTags = countTop(RB.flatMap((r) => r.tags))

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
          const count = RB.filter((r) => (r.title + " " + r.summary).toLowerCase().includes(key)).length
          return { name: k, count }
        })
        .filter((x) => x.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const trending = pickUnique(RB, 10, rnd).map((r) => ({
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        tags: r.tags.slice(0, 4)
      }))

      let cves: Array<{ cveId: string; name: string; severity: string; cvssScore: number; publishedDate: string; tags: string[] }> | undefined
      if (cveMod && Array.isArray(cveMod.KNOWN_CVES)) {
        cves = cveMod.KNOWN_CVES
          .slice()
          .sort((a: any, b: any) => String(b.publishedDate || "").localeCompare(String(a.publishedDate || "")))
          .slice(0, 40)
          .map((e: any) => ({
            cveId: e.cveId,
            name: e.name,
            severity: e.severity,
            cvssScore: e.cvssScore,
            publishedDate: e.publishedDate,
            tags: e.tags || [],
          }))
      }

      const t = now.getTime() / 1000
      const pulse = Math.round(60 + 18 * Math.sin(t / 18) + 11 * Math.sin(t / 7) + rnd() * 7)

      payload = {
        updatedAt: now.toISOString(),
        day,
        counts: {
          runbooks: allRunbooks.length,
          tags: new Set(RB.flatMap((r) => r.tags)).size
        },
        pulse: Math.max(7, pulse),
        topTags,
        issueCounts,
        trending,
        ...(cves ? { cves } : {})
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

    console.log("live-wall fetch", { status, data: summarize(payload), error })
    return payload
  },
  ["live-wall-real"],
  { revalidate: 30 }
)

export async function GET() {
  const body = await getLiveWallCached()
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30"
    }
  })
}
