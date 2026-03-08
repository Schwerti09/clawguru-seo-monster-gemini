"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

export default function BuyButton({
  product,
  label,
  className,
  style
}: {
  product: "daypass" | "pro" | "team" | "msp"
  label: string
  className?: string
  style?: React.CSSProperties
}) {
  const pathname = usePathname()
  const firstSegment = pathname.split("/").filter(Boolean)[0] as Locale
  const locale: Locale = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "de"
  const [loading, setLoading] = useState(false)

  async function go() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product })
      })

      const text = await res.text()
      console.log("[BuyButton] status:", res.status)
      console.log("[BuyButton] raw response:", text)

      let data: any = null
      try {
        data = JSON.parse(text)
      } catch {
        alert("Checkout antwortet nicht als JSON:\n" + text)
        return
      }

      if (!res.ok) {
        alert("Checkout-Fehler:\n" + (data?.error || `HTTP ${res.status}`))
        return
      }

      if (!data?.url) {
        alert("Keine Checkout-URL erhalten.\nResponse:\n" + JSON.stringify(data, null, 2))
        return
      }

      window.location.href = data.url
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
      {loading ? t(locale, "buyLoading") : label}
    </button>
  )
}