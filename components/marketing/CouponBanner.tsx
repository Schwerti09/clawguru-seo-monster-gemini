"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export const COUPON_SESSION_KEY = "cg_coupon_code"

const KNOWN_CODES: Record<string, string> = {
  HUNTER50: "50% off Pro",
  SHOWHN50: "50% off Pro",
  REDDIT30: "30% off Pro",
  BIRDS25: "25% off Pro",
  LINKEDIN25: "25% off Pro",
  SAVE5: "€5 off",
}

export default function CouponBanner() {
  const searchParams = useSearchParams()
  const [code, setCode] = useState<string | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const urlCode = searchParams.get("coupon")?.toUpperCase()
    if (urlCode) {
      sessionStorage.setItem(COUPON_SESSION_KEY, urlCode)
      setCode(urlCode)
      return
    }
    const stored = sessionStorage.getItem(COUPON_SESSION_KEY)
    if (stored) setCode(stored)
  }, [searchParams])

  if (!code || dismissed) return null

  const label = KNOWN_CODES[code] ?? "Rabatt"

  return (
    <div className="relative mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 flex items-center gap-4">
      <span className="text-2xl" aria-hidden="true">🎟</span>
      <div className="flex-1">
        <span className="font-black text-emerald-300 tracking-wide">{code}</span>
        <span className="ml-2 text-sm text-emerald-200">
          — {label} · Wird automatisch im Checkout angewendet
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Banner schließen"
        className="shrink-0 text-emerald-500 hover:text-emerald-300 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
