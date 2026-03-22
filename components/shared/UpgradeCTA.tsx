"use client"

import React from "react"

type Props = {
  prefix?: string
  dict?: any
  variant?: "intel" | "list"
  ctaHref?: string
}

export default function UpgradeCTA({ prefix = "", dict, variant = "list", ctaHref }: Props) {
  if (variant === "intel") {
    const href = ctaHref || `${prefix || ''}/daypass`
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-black/60 via-black/50 to-black/60 p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="text-sm text-cyan-300 mb-2">{dict?.upgrade_premium_label || "Premium"}</div>
                <h3 className="text-2xl font-black text-white">{dict?.upgrade_title || "Mehr Sichtbarkeit mit Daypass"}</h3>
                <p className="text-gray-300 mt-2 text-sm">
                  {dict?.upgrade_text || "Vollständiger Feed, Export (CSV/PDF), erweiterte Filter und automatische Runbook‑Ausführung."}
                </p>
              </div>
              <div className="text-right ltr:text-right rtl:text-left">
                <a href={href} className="inline-flex items-center px-6 py-3 rounded-2xl font-black text-black"
                   style={{ background: "linear-gradient(135deg,#00e6a0,#00b8ff)" }}>
                  {dict?.upgrade_button || "Daypass starten"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default: list variant
  const items: string[] = Array.isArray(dict?.upgrade_items)
    ? dict.upgrade_items
    : [
        "Runbooks automatisch ausführen",
        "Export als PDF / Markdown",
        "Personalisierte Empfehlungen",
      ]
  const href = ctaHref || "/api/stripe/checkout?plan=daypass"

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-transparent p-6">
        <div className="md:flex items-center justify-between gap-6">
          <div>
            <div className="text-white font-semibold text-lg">{dict?.upgrade_title || "Mehr Power mit Daypass"}</div>
            <ul className="mt-2 text-sm text-gray-300 list-disc ltr:pl-5 rtl:pr-5 space-y-1">
              {items.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4 md:mt-0">
            <a href={href} className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
              {dict?.upgrade_button || "Daypass starten"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
