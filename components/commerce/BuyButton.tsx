"use client"

import { useState } from "react"
import { trackEvent } from "@/lib/analytics"
import { COUPON_SESSION_KEY } from "@/components/marketing/CouponBanner"

export default function BuyButton({
  product,
  label,
  className,
  style,
  analyticsSource,
  annual,
}: {
  product: "daypass" | "pro" | "team" | "msp"
  label: string
  className?: string
  style?: React.CSSProperties
  analyticsSource?: string
  annual?: boolean
}) {
  const [loading, setLoading] = useState(false)

  async function go() {
    trackEvent("pricing_click", { product, source: analyticsSource ?? "buy_button", annual: !!annual })
    setLoading(true)
    const coupon = typeof window !== "undefined"
      ? (sessionStorage.getItem(COUPON_SESSION_KEY) ?? undefined)
      : undefined
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, annual: !!annual, coupon_code: coupon ?? undefined })
      })

      const text = await res.text()
      console.log("[BuyButton] status:", res.status)
      console.log("[BuyButton] raw response:", text)

      let data: unknown = null
      try {
        data = JSON.parse(text) as unknown
      } catch {
        alert("Checkout antwortet nicht als JSON:\n" + text)
        return
      }

      const dataObj = (data && typeof data === "object" ? (data as { error?: unknown; url?: unknown }) : {})

      if (!res.ok) {
        alert(
          "Checkout-Fehler:\n" +
            (typeof dataObj.error === "string" ? dataObj.error : `HTTP ${res.status}`)
        )
        return
      }

      if (typeof dataObj.url !== "string" || !dataObj.url) {
        alert("Keine Checkout-URL erhalten.\nResponse:\n" + JSON.stringify(data, null, 2))
        return
      }

      window.location.href = dataObj.url
    } catch (err) {
      console.error("[BuyButton] fetch failed:", err)
      alert("Checkout-Request fehlgeschlagen. Details in der Browser-Konsole.")
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
      {loading ? "…" : label}
    </button>
  )
}