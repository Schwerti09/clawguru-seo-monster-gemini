import type { NextRequest } from "next/server"

/**
 * Validate an API key from an incoming request.
 *
 * Accepted locations (in priority order):
 *   1. Authorization: Bearer <key>
 *   2. X-API-Key: <key>
 *   3. ?api_key=<key> query param
 *
 * Valid keys are taken from the INTEL_API_KEYS env var (comma-separated).
 * A single key may also be set via INTEL_API_KEY (singular).
 */
export function validateApiKey(req: NextRequest): boolean {
  const raw = process.env.INTEL_API_KEYS || process.env.INTEL_API_KEY || ""
  const validKeys = raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)

  if (validKeys.length === 0) return false

  const authHeader = req.headers.get("authorization") || ""
  let provided: string | null = null

  if (authHeader.toLowerCase().startsWith("bearer ")) {
    provided = authHeader.slice(7).trim()
  } else {
    provided = req.headers.get("x-api-key")?.trim() || null
  }

  if (!provided) {
    provided = req.nextUrl.searchParams.get("api_key")?.trim() || null
  }

  if (!provided) return false
  return validKeys.includes(provided)
}
