import { AFFILIATE_QUERY_KEYS, sanitizeAffiliateRef } from "@/lib/affiliate"

const AFFILIATE_STORAGE_KEY = "clawguru_affiliate_ref"
const AFFILIATE_TTL_MS = 30 * 24 * 60 * 60 * 1000

type StoredAffiliate = {
  value: string
  expiresAt: number
}

function now() {
  return Date.now()
}

export function storeAffiliateRef(ref: string): void {
  if (typeof window === "undefined") return
  const value = sanitizeAffiliateRef(ref)
  if (!value) return
  const payload: StoredAffiliate = { value, expiresAt: now() + AFFILIATE_TTL_MS }
  window.localStorage.setItem(AFFILIATE_STORAGE_KEY, JSON.stringify(payload))
}

export function readAffiliateRef(): string | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(AFFILIATE_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as StoredAffiliate
    if (!parsed.value || !parsed.expiresAt || parsed.expiresAt < now()) {
      window.localStorage.removeItem(AFFILIATE_STORAGE_KEY)
      return null
    }
    return parsed.value
  } catch {
    window.localStorage.removeItem(AFFILIATE_STORAGE_KEY)
    return null
  }
}

export function captureAffiliateFromParams(params: { get: (key: string) => string | null }): string | null {
  for (const key of AFFILIATE_QUERY_KEYS) {
    const value = params.get(key)
    const cleaned = value ? sanitizeAffiliateRef(value) : null
    if (cleaned) {
      storeAffiliateRef(cleaned)
      return cleaned
    }
  }
  return null
}
