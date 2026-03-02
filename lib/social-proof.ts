import { apiCacheGet, apiCacheSet } from "@/lib/api-cache"

export type SocialProofEvent = {
  id: string
  country: string
  cveId: string
  runbookSlug: string
  createdAt: number
}

const CACHE_KEY = "social-proof-events"
const MAX_EVENTS = 20
const CACHE_TTL_SECONDS = 60 * 60 * 6

const FALLBACK_COUNTRIES = [
  "Deutschland",
  "USA",
  "Schweiz",
  "Österreich",
  "Niederlande",
  "Schweden",
  "Frankreich",
  "Italien",
  "Spanien",
  "Singapur",
  "Japan",
  "Brasilien",
]

const FALLBACK_CVES = [
  "CVE-2024-6387",
  "CVE-2024-3094",
  "CVE-2024-27198",
  "CVE-2025-29927",
  "CVE-2023-44487",
  "CVE-2024-21626",
  "CVE-2024-45337",
  "CVE-2024-56374",
  "CVE-2024-43598",
  "CVE-2024-1103",
]

const FALLBACK_RUNBOOKS = [
  "ssh-hardening",
  "firewall-baseline",
  "security-headers-csp",
  "ddos-first-response",
  "rate-limit-baseline",
  "api-key-rotation",
  "kubernetes-rbac",
  "container-hardening",
]

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Deutschland",
  US: "USA",
  CH: "Schweiz",
  AT: "Österreich",
  NL: "Niederlande",
  SE: "Schweden",
  FR: "Frankreich",
  IT: "Italien",
  ES: "Spanien",
  SG: "Singapur",
  JP: "Japan",
  BR: "Brasilien",
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function pickFrom<T>(list: T[], seed: string): T {
  if (list.length === 0) throw new Error("Empty list")
  const index = hashString(seed) % list.length
  return list[index]
}

function normalizeCountry(country?: string | null): string | undefined {
  if (!country) return undefined
  const key = country.toUpperCase()
  return COUNTRY_NAMES[key] || country
}

export function recordSocialProofEvent(event: SocialProofEvent): void {
  const existing = apiCacheGet<SocialProofEvent[]>(CACHE_KEY) ?? []
  const filtered = existing.filter((item) => item.id !== event.id)
  const next = [event, ...filtered].slice(0, MAX_EVENTS)
  apiCacheSet(CACHE_KEY, next, CACHE_TTL_SECONDS)
}

export function buildSocialProofEventFromStripe(params: {
  id: string
  country?: string | null
  cveId?: string | null
  runbookSlug?: string | null
}): SocialProofEvent {
  const seed = params.id || `${Date.now()}`
  return {
    id: params.id,
    country: normalizeCountry(params.country) || pickFrom(FALLBACK_COUNTRIES, `${seed}-country`),
    cveId: params.cveId || pickFrom(FALLBACK_CVES, `${seed}-cve`),
    runbookSlug: params.runbookSlug || pickFrom(FALLBACK_RUNBOOKS, `${seed}-runbook`),
    createdAt: Date.now(),
  }
}

export function getSocialProofEvents(): SocialProofEvent[] {
  const cached = apiCacheGet<SocialProofEvent[]>(CACHE_KEY)
  if (cached && cached.length > 0) return cached

  const seedBase = Date.now().toString()
  const fallback = Array.from({ length: MAX_EVENTS }, (_, index) => {
    const seed = `${seedBase}-${index}`
    return buildSocialProofEventFromStripe({
      id: `seed-${seed}`,
      country: pickFrom(FALLBACK_COUNTRIES, `${seed}-country`),
      cveId: pickFrom(FALLBACK_CVES, `${seed}-cve`),
      runbookSlug: pickFrom(FALLBACK_RUNBOOKS, `${seed}-runbook`),
    })
  })

  apiCacheSet(CACHE_KEY, fallback, CACHE_TTL_SECONDS)
  return fallback
}
