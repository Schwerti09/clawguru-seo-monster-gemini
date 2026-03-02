"use client"

import { useEffect, useMemo, useState } from "react"

type PricingQuote = {
  currency: string
  amountTotal: number
  taxAmount: number
  country?: string
}

type LocalizedPriceProps = {
  product: "daypass" | "pro" | "team" | "msp"
  fallback: string
  intervalLabel?: string
  priceClassName?: string
  intervalClassName?: string
  noteClassName?: string
}

function formatCurrency(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency.toLowerCase() === "jpy" ? 0 : 2,
  }).format(amount / 100)
}

export default function LocalizedPrice({
  product,
  fallback,
  intervalLabel,
  priceClassName,
  intervalClassName,
  noteClassName,
}: LocalizedPriceProps) {
  const [quote, setQuote] = useState<PricingQuote | null>(null)
  const locale = useMemo(
    () => (typeof navigator === "undefined" ? "de-DE" : navigator.language || "de-DE"),
    []
  )

  useEffect(() => {
    let active = true
    fetch(`/api/pricing/quote?product=${encodeURIComponent(product)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.currency || typeof data?.amountTotal !== "number") return
        setQuote({
          currency: data.currency,
          amountTotal: data.amountTotal,
          taxAmount: typeof data.taxAmount === "number" ? data.taxAmount : 0,
          country: typeof data.country === "string" ? data.country : undefined,
        })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [product])

  const displayPrice = quote
    ? formatCurrency(quote.amountTotal, quote.currency, locale)
    : fallback

  const taxNote = quote
    ? `inkl. lokale Steuern${quote.country ? ` (${quote.country})` : ""}`
    : "inkl. lokale Steuern"

  return (
    <div>
      <div className="flex items-end gap-2">
        <span className={priceClassName}>{displayPrice}</span>
        {intervalLabel ? (
          <span className={intervalClassName}>{intervalLabel}</span>
        ) : null}
      </div>
      <div className={noteClassName}>{taxNote}</div>
    </div>
  )
}
