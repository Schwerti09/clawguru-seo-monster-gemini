/**
 * API Guard – Kill-Switch helper
 *
 * Checks environment variables to determine whether AI/API features are currently active.
 * Set DISABLE_AI_FEATURES=true to block only AI endpoints.
 * Set DISABLE_ALL_APIS=true to block all external API calls (AI + Stripe + …).
 *
 * Returns a 503 response when the service is unavailable so no costs are incurred.
 */

import { NextResponse } from "next/server"

// Read once at module load time to avoid repeated string comparisons on every request.
const _disableAllApis = process.env.DISABLE_ALL_APIS === "true"
const _disableAiFeatures = process.env.DISABLE_AI_FEATURES === "true"

/** Returns true when AI/API features are enabled and requests should proceed. */
export function isApiActive(): boolean {
  if (_disableAllApis) return false
  if (_disableAiFeatures) return false
  return true
}

/** Returns true when only Stripe/payment features are active (AI may be disabled). */
export function isStripeActive(): boolean {
  if (_disableAllApis) return false
  return true
}

/** Convenience: returns a standard 503 JSON response for a blocked API call. */
export function apiUnavailableResponse(): NextResponse {
  return NextResponse.json(
    { error: "Service temporarily unavailable. Please try again later." },
    { status: 503 },
  )
}
