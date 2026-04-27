// lib/booking-url.ts
//
// Centralized validation for the NEXT_PUBLIC_CAL_* booking URLs.
//
// Why this exists:
//   Before this helper, BookingButton accepted any truthy string as a booking
//   URL. A typo in Railway Dashboard (e.g. NEXT_PUBLIC_CAL_DEMO_URL="TODO",
//   a leftover "cal.com/..." without scheme, or accidentally "javascript:...")
//   would break the Scale-tier CTA and, in the worst case, open a malformed
//   link instead of the safe mailto fallback.
//
// Contract:
//   - Must be a parseable URL.
//   - Scheme must be "https:" (no http, no javascript, no data, no mailto).
//   - Hostname must be cal.com, calendly.com, or a subdomain of either.
//
// Consumers:
//   - components/booking/BookingButton.tsx   (Scale-tier CTA, strategy/audit/demo)
//   - app/api/consult-health/env-check/route.ts (booking.cal_* ENV checks)

const ALLOWED_BOOKING_HOSTS = ["cal.com", "calendly.com"]

/**
 * Returns true if the given string is a safe, https-scheme URL pointing at
 * one of the whitelisted booking hosts. Returns false for null, undefined,
 * non-strings, empty or whitespace-only strings, non-https schemes, and
 * hosts outside the whitelist.
 */
export function isValidBookingUrl(url: string | undefined | null): boolean {
  if (typeof url !== "string") return false
  const trimmed = url.trim()
  if (trimmed.length === 0) return false
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return false
  }
  if (parsed.protocol !== "https:") return false
  const host = parsed.hostname.toLowerCase()
  return ALLOWED_BOOKING_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  )
}

/**
 * Returns the trimmed URL string if it passes `isValidBookingUrl`, otherwise
 * returns null. Use this when the caller wants a one-liner that yields the
 * safe value or the fallback-signal (null).
 *
 * Example:
 *   const calUrl = resolveBookingUrl(process.env.NEXT_PUBLIC_CAL_DEMO_URL)
 *   const href = calUrl ?? buildMailto(...)
 */
export function resolveBookingUrl(url: string | undefined | null): string | null {
  if (!isValidBookingUrl(url)) return null
  return (url as string).trim()
}
