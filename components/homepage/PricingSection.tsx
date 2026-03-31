import React from "react"

type Props = { prefix?: string; dict?: Record<string, string> }

export default function PricingSection({ prefix = "", dict = {} }: Props) {
  const tiers = [
    {
      name: "Daypass",
      price: dict.price_daypass_price || "€9 / 24h",
      features: [
        dict.price_daypass_f1 || "Full access to all runbooks",
        dict.price_daypass_f2 || "Execute in your own environment",
        dict.price_daypass_f3 || "Export & audit report",
      ],
      cta: { label: dict.price_daypass_btn || "Buy Daypass", href: "/api/stripe/checkout?plan=daypass" },
    },
    {
      name: "Pro",
      price: dict.price_pro_price || "€49 / month",
      features: [
        dict.price_pro_f1 || "Unlimited executions",
        dict.price_pro_f2 || "API access & team support",
        dict.price_pro_f3 || "Compliance & reports",
      ],
      cta: { label: dict.price_pro_btn || "View plans", href: `${prefix}/pricing` },
    },
  ]

  return (
    <div>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-white">{dict.price_title || "Get started in 5 minutes. No commitment."}</h2>
        <p className="mt-2 text-gray-400">{dict.price_sub || "Interactive previews are free – execution & export require Daypass or Pro."}</p>
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
