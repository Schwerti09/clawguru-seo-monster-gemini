"use client"

import { useEffect, useMemo, useState } from "react"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, t, type Locale } from "@/lib/i18n"

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

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE
  const lang = (navigator.language || DEFAULT_LOCALE).toLowerCase().slice(0, 2) as Locale
  return SUPPORTED_LOCALES.includes(lang) ? lang : DEFAULT_LOCALE
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
  const locale = useMemo(() => detectLocale(), [])

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

  const taxLabel = t(locale, "pricingTaxIncluded")
  const taxNote = quote
    ? `${taxLabel}${quote.country ? ` (${quote.country})` : ""}`
    : taxLabel

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
