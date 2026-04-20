"use client"

import { ArrowRight, Calendar, Mail } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

/**
 * Env-driven booking button. If NEXT_PUBLIC_CAL_*_URL is set → opens Cal.com.
 * If not set → falls back to a well-formatted mailto with prefilled subject/body.
 *
 * Env vars (all optional — graceful fallback):
 *   NEXT_PUBLIC_CAL_STRATEGY_URL  — 30min free strategy call
 *   NEXT_PUBLIC_CAL_AUDIT_URL     — 60min audit scoping
 *   NEXT_PUBLIC_CAL_DEMO_URL      — 45min enterprise demo
 */

type BookingType = "strategy" | "audit" | "demo"

interface Props {
  type?: BookingType
  label?: string
  locale?: string
  source: string // analytics source tag
  variant?: "primary" | "secondary" | "minimal"
  className?: string
  subject?: string
  body?: string
}

const CAL_URL_MAP: Record<BookingType, string | undefined> = {
  strategy: process.env.NEXT_PUBLIC_CAL_STRATEGY_URL,
  audit: process.env.NEXT_PUBLIC_CAL_AUDIT_URL,
  demo: process.env.NEXT_PUBLIC_CAL_DEMO_URL,
}

const DEFAULT_LABELS: Record<string, { de: string; en: string }> = {
  strategy: { de: "Kostenlosen Strategy Call buchen", en: "Book a free strategy call" },
  audit: { de: "Audit-Termin vereinbaren", en: "Schedule audit scoping" },
  demo: { de: "Enterprise-Demo buchen", en: "Book enterprise demo" },
}

function buildMailto(subject: string, body: string): string {
  return `mailto:enterprise@clawguru.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function BookingButton({
  type = "strategy",
  label,
  locale = "de",
  source,
  variant = "primary",
  className = "",
  subject,
  body,
}: Props) {
  const isDE = locale === "de"
  const calUrl = CAL_URL_MAP[type]
  const hasCal = Boolean(calUrl)

  const defaultSubject = subject ?? (isDE ? "Consulting Anfrage" : "Consulting inquiry")
  const defaultBody =
    body ??
    (isDE
      ? "Name:\nFirma:\nTeam-Größe:\nAktueller Stack:\nZiel:\nZeitrahmen:\nBevorzugte Termine:\n"
      : "Name:\nCompany:\nTeam size:\nCurrent stack:\nGoal:\nTimeframe:\nPreferred times:\n")

  const href = hasCal ? calUrl! : buildMailto(defaultSubject, defaultBody)
  const displayLabel = label ?? DEFAULT_LABELS[type][isDE ? "de" : "en"]

  const base = "inline-flex items-center gap-2 font-semibold transition-all"
  const variants = {
    primary:
      "px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]",
    secondary:
      "px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 hover:border-cyan-500/50",
    minimal:
      "text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline",
  }

  const Icon = hasCal ? Calendar : Mail

  return (
    <a
      href={href}
      target={hasCal ? "_blank" : "_self"}
      rel={hasCal ? "noopener noreferrer" : undefined}
      onClick={() =>
        trackEvent("booking_click", {
          type,
          source,
          locale,
          channel: hasCal ? "calendly" : "mailto",
        })
      }
      className={`${base} ${variants[variant]} ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      <span>{displayLabel}</span>
      <ArrowRight className="h-4 w-4" aria-hidden />
    </a>
  )
}
