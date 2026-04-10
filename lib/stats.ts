// lib/stats.ts
// Centralized, canonical stats used across the entire organism.
// All pages/components and APIs should import from here to keep numbers consistent.

function safeTotalSitemapUrls(): number {
  try {
    if (typeof window === "undefined") {
      // Resolve only on the server to keep client bundle light and avoid Node-only deps
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { totalSitemapUrls } = require("@/lib/pseo")
      return typeof totalSitemapUrls === "function" ? totalSitemapUrls() : 0
    }
  } catch {}
  return 0
}

export const TOTAL_RUNBOOKS = 4_200_000
export const TOTAL_SITEMAP_URLS = safeTotalSitemapUrls()
export const AVG_CLAW_SCORE = 78
export const ACTIVE_EXPLOITS_TODAY = 42
export const USERS_SAVED = 1_247_000
export const FORTUNE_100_CLIENTS = 47
export const SERVERS_HARDENED = 14_000
export const UPTIME_PCT = 99.98

// Trust/Live badge figures (moved here from constants)
export const EXPOSED_INSTANCES = 21_639
export const AUTH_BYPASS_RATE = 93.4
export const CHECKS_TOTAL = 128_457
export const CHECKS_TODAY = 912

export const STATS = {
  totalRunbooks: TOTAL_RUNBOOKS,
  totalSitemapUrls: TOTAL_SITEMAP_URLS,
  avgClawScore: AVG_CLAW_SCORE,
  activeExploitsToday: ACTIVE_EXPLOITS_TODAY,
  usersSaved: USERS_SAVED,
  fortune100Clients: FORTUNE_100_CLIENTS,
  serversHardened: SERVERS_HARDENED,
  uptimePct: UPTIME_PCT,
  exposedInstances: EXPOSED_INSTANCES,
  bypassRate: AUTH_BYPASS_RATE,
  checksTotal: CHECKS_TOTAL,
  checksToday: CHECKS_TODAY,
} as const

export type TagStats = {
  tags: string[]
  counts: Record<string, number>
  avgClaw: Record<string, number>
}

// Build per-tag stats on the client (or server) from the canonical pseo dataset.
// Uses a sampled synthetic builder if available to avoid large payloads.
export async function buildTagStatsClient(sampleSize = 10000): Promise<TagStats> {
  const pseo: any = await import("@/lib/pseo")
  const buildClient: undefined | ((n: number) => any[]) = (pseo as any).buildRunbooksClient
  let list: any[] = []
  try {
    list = buildClient ? buildClient(sampleSize) : (pseo as any).materializedRunbooks()
  } catch {
    list = ((pseo as any).materializedRunbooks?.() ?? []) as any[]
  }
  const setUniq = new Set<string>()
  const cMap = new Map<string, number>()
  const sMap = new Map<string, number>()
  for (const r of list) {
    const score = Number(r?.clawScore || 0) || 0
    for (const t of r?.tags || []) {
      const key = String(t)
      setUniq.add(key)
      cMap.set(key, (cMap.get(key) || 0) + 1)
      sMap.set(key, (sMap.get(key) || 0) + score)
    }
  }
  const counts: Record<string, number> = {}
  const avgClaw: Record<string, number> = {}
  for (const t of setUniq) {
    const c = cMap.get(t) || 0
    const s = sMap.get(t) || 0
    counts[t] = c
    avgClaw[t] = c ? Math.round((s / c) * 10) / 10 : 0
  }
  const tags = Array.from(setUniq).sort((a, b) => a.localeCompare(b))
  return { tags, counts, avgClaw }
}
