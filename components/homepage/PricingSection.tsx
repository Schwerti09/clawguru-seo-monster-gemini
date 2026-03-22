import React from "react"

type Props = { prefix?: string; locale?: string; dict?: any }

export default function PricingSection({ prefix = "", locale = "de", dict }: Props) {
  const isDe = locale?.startsWith("de")
  const d = dict || {}

  const tiers = [
    {
      name: d.dayPassBadge || "Daypass",
      price: (isDe ? "9–19 € / 24h" : "€9–19 / 24h"),
      features: (isDe
        ? ["Voller Zugriff auf alle Runbooks", "Ausführung in eigener Umgebung", "Export & Audit‑Report"]
        : ["Full access to all runbooks", "Execute in your own environment", "Export & audit report"]),
      cta: { label: d.dayPassBtn || (isDe ? "Daypass kaufen" : "Buy Daypass"), href: "/api/stripe/checkout?plan=daypass" },
    },
    {
      name: d.proBadge || "Pro",
      price: (isDe ? "49–149 € / Monat" : "€49–149 / month"),
      features: (isDe
        ? ["Unlimitierte Ausführungen", "API‑Zugriff & Team‑Support", "Compliance & Reports"]
        : ["Unlimited executions", "API access & team support", "Compliance & reports"]),
      cta: { label: d.proBtn || (isDe ? "Angebote ansehen" : "View plans"), href: `${prefix}/pricing` },
    },
  ]

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white">{d.title || (isDe ? "Starte in 5 Minuten. Kein Commitment." : "Get started in 5 minutes. No commitment.")}</h2>
        <p className="mt-2 text-gray-400">{d.subtitle || (isDe ? "Interaktive Karten sind kostenlos – Ausführung & Export erfordern Daypass oder Pro." : "Interactive previews are free – execution & export require Daypass or Pro.")}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {tiers.map((t) => (
          <div key={t.name} className="rounded-2xl glass-vault border border-white/10 p-6">
            <div className="flex items-baseline justify-between">
              <div className="text-xl font-black text-white">{t.name}</div>
              <div className="text-sm text-gray-400">{t.price}</div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-gray-300 list-disc pl-5">
              {t.features.map((f: string) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="mt-6">
              <a href={t.cta.href} className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                {t.cta.label}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
