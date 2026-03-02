export const AFFILIATE_REF_MAX_LENGTH = 64
export const AFFILIATE_QUERY_KEYS = ["affiliate_ref", "ref", "aff"] as const
export const AFFILIATE_COOKIE = "affiliate_ref"
export const AFFILIATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function sanitizeAffiliateRef(ref: string): string | null {
  const cleaned = ref.trim().slice(0, AFFILIATE_REF_MAX_LENGTH)
  return cleaned.length > 0 ? cleaned : null
}
