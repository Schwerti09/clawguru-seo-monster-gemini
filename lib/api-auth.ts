/**
 * Enterprise API Key Authentication & Usage Tracking
 *
 * Validates API keys from the X-Api-Key header (or Authorization: Bearer <key>).
 * Reports metered usage to Stripe for usage-based billing.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY         – Stripe secret key
 *   STRIPE_METERED_PRICE_ID   – Stripe Price ID with billing_scheme=per_unit + usage_type=metered
 *
 * API keys are stored as comma-separated entries in:
 *   ENTERPRISE_API_KEYS=key1:customerId1:subItemId1,key2:customerId2:subItemId2
 *
 * Each entry is: <api_key>:<stripe_customer_id>:<stripe_subscription_item_id>
 */

import { NextRequest } from "next/server"
import Stripe from "stripe"

export type ApiKeyInfo = {
  apiKey: string
  customerId: string
  subscriptionItemId: string
}

function parseApiKeys(): Map<string, ApiKeyInfo> {
  const raw = process.env.ENTERPRISE_API_KEYS || ""
  const map = new Map<string, ApiKeyInfo>()
  for (const entry of raw.split(",")) {
    const parts = entry.trim().split(":")
    if (parts.length === 3) {
      const [apiKey, customerId, subscriptionItemId] = parts
      map.set(apiKey, { apiKey, customerId, subscriptionItemId })
    }
  }
  return map
}

export function extractApiKey(req: NextRequest): string | null {
  // Try X-Api-Key header first, then Authorization: Bearer <key>
  const xKey = req.headers.get("x-api-key")
  if (xKey) return xKey.trim()

  const auth = req.headers.get("authorization") || ""
  const match = auth.match(/^Bearer\s+(.+)$/i)
  return match ? match[1].trim() : null
}

export function validateApiKey(key: string): ApiKeyInfo | null {
  const keys = parseApiKeys()
  return keys.get(key) ?? null
}

/**
 * Report one API call as a metered usage record to Stripe.
 * Fire-and-forget – errors are logged but never propagate to the caller.
 */
export async function reportUsage(info: ApiKeyInfo): Promise<void> {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || !info.subscriptionItemId) return

  try {
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" })
    await stripe.subscriptionItems.createUsageRecord(info.subscriptionItemId, {
      quantity: 1,
      timestamp: Math.floor(Date.now() / 1000),
      action: "increment",
    })
  } catch (err) {
    console.error("[api-auth] Stripe usage report failed:", err)
  }
}

export type AuthResult =
  | { ok: true; info: ApiKeyInfo }
  | { ok: false; status: 401 | 403; error: string }

/**
 * Authenticate an incoming enterprise API request.
 * Returns the API key info on success, or an error descriptor on failure.
 */
export function authenticateApiRequest(req: NextRequest): AuthResult {
  const key = extractApiKey(req)
  if (!key) {
    return { ok: false, status: 401, error: "Missing API key. Provide X-Api-Key header or Authorization: Bearer <key>." }
  }
  const info = validateApiKey(key)
  if (!info) {
    return { ok: false, status: 403, error: "Invalid API key." }
  }
  return { ok: true, info }
}
