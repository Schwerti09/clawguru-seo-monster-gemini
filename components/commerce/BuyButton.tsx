"use client"

import { useState } from "react"
import { AFFILIATE_COOKIE } from "@/lib/affiliate"

/** Read the affiliate code cookie set by AffiliateTracker (client-side only). */
function readAffCookie(): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${AFFILIATE_COOKIE}=`))
  if (!match) return undefined
  return decodeURIComponent(match.split("=")[1])
}

export default function BuyButton({
  product,
  label,
  className,
  style
}: {
  product: "daypass" | "pro" | "team"
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  const [loading, setLoading] = useState(false)

  async function go() {
    setLoading(true)
    try {
      const affCode = readAffCookie()
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, ...(affCode ? { affCode } : {}) })
      })
      const data = await res.json()
      if (data?.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={go}
      disabled={loading}
      className={
        className ||
        "px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-60"
      }
      style={style}
    >
      {loading ? "Weiter…" : label}
    </button>
  )
}
