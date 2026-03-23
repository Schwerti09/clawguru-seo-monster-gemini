// lib/stats.ts
// Centralized, canonical stats used across the entire organism.
// All pages/components and APIs should import from here to keep numbers consistent.

import { totalSitemapUrls } from "@/lib/pseo"

export const TOTAL_RUNBOOKS = 4_200_000
export const TOTAL_SITEMAP_URLS = totalSitemapUrls()
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
