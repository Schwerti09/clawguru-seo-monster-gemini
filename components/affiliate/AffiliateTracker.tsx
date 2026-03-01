"use client"

import { useEffect } from "react"
import { AFFILIATE_COOKIE, AFFILIATE_COOKIE_MAX_AGE, isValidAffCode } from "@/lib/affiliate"

/**
 * AffiliateTracker
 *
 * Mount this once in the root layout.  It runs on every page load and:
 *  1. Reads `?aff=<CODE>` from the URL search params.
 *  2. Validates the code format.
 *  3. Writes it to a first-party cookie that expires in 60 days.
 *
 * The cookie is later picked up by BuyButton → /api/stripe/checkout, which
 * attaches it to the Stripe Checkout Session metadata.
 */
export default function AffiliateTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const code = params.get("aff")
    if (!isValidAffCode(code)) return

    // Set a first-party cookie (JS-accessible so BuyButton can read it).
    const expires = new Date(Date.now() + AFFILIATE_COOKIE_MAX_AGE * 1000).toUTCString()
    document.cookie = `${AFFILIATE_COOKIE}=${encodeURIComponent(code)}; expires=${expires}; path=/; SameSite=Lax`
  }, [])

  return null
}
