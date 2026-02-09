import type { NextRequest } from "next/server"

/**
 * Build an absolute origin (protocol + host) for redirects / callback URLs.
 * - Prefers NEXT_PUBLIC_SITE_URL if provided (e.g. https://clawguru.org)
 * - Falls back to reverse-proxy headers (Netlify/Vercel) and request URL.
 */
export function getOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (env) return env.replace(/\/$/, "")

  const h = req.headers
  const proto =
    h.get("x-forwarded-proto") ||
    (req.nextUrl?.protocol ? req.nextUrl.protocol.replace(":", "") : "") ||
    "https"
  const host =
    h.get("x-forwarded-host") ||
    h.get("host") ||
    (req.nextUrl?.host || "")

  return `${proto}://${host}`.replace(/\/$/, "")
}
