import type { NextRequest } from "next/server"

/**
 * Build an absolute origin (protocol + host) for redirects / callback URLs.
 * - Prefers the current request host so preview deployments keep users on the
 *   same deployment URL for redirects, Stripe callbacks, and portal returns.
 * - Falls back to configured site URL when the request host is unavailable.
 */
export function getOrigin(req: NextRequest): string {
  const h = req.headers
  const proto =
    h.get("x-forwarded-proto") ||
    (req.nextUrl?.protocol ? req.nextUrl.protocol.replace(":", "") : "") ||
    "https"
  const host =
    h.get("x-forwarded-host") ||
    h.get("host") ||
    (req.nextUrl?.host || "")

  if (host) {
    return `${proto}://${host}`.replace(/\/$/, "")
  }

  const env = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL
  if (env) return env.replace(/\/$/, "")

  return "http://localhost:3000"
}
