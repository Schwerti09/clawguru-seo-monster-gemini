import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Crown, Zap, Shield, Lock, Check, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-pro"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Roast Pro — Premium Security Features | ClawGuru"
    : "Roast Pro — Premium Security Features | ClawGuru"
  const description = isDE
    ? "Premium Security-Features für Teams und Enterprise. Gated Features für Conversion. Keine Mock-Daten."
    : "Premium security features for teams and enterprise. Gated features for conversion. No mock data."
  return {
    title,
    description,
    keywords: ["roast pro", "premium features", "security upgrade", "enterprise features", "pro plan"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getProFeatures = (isDE: boolean) => [
  {
    icon: Zap,
    title: isDE ? "Unbegrenzte Roasts" : "Unlimited Roasts",
    description: isDE
      ? "Roaste so viele Stacks wie du willst. Keine Limits für Pro-Nutzer."
      : "Roast as many stacks as you want. No limits for Pro users.",
    popular: true,
  },
  {
    icon: Shield,
    title: isDE ? "Erweiterte Analyse" : "Advanced Analysis",
    description: isDE
      ? "Deep-Dive Security-Analyse mit Detail-Reports und Recommendations."
      : "Deep-dive security analysis with detailed reports and recommendations.",
    popular: false,
  },
  {
    icon: Lock,
    title: isDE ? "Private Roasts" : "Private Roasts",
    description: isDE
      ? "Deine Roasts sind privat und werden nicht in der Leaderboard angezeigt."
      : "Your roasts are private and won't appear in the leaderboard.",
    popular: false,
  },
  {
    icon: Crown,
    title: isDE ? "Priority Support" : "Priority Support",
    description: isDE
      ? "24/7 Priority Support für alle deine Security-Fragen."
      : "24/7 priority support for all your security questions.",
    popular: false,
  },
  {
    icon: Check,
    title: isDE ? "Custom Branding" : "Custom Branding",
    description: isDE
      ? "White-Label Roasts mit deinem Branding und Logo."
      : "White-label roasts with your branding and logo.",
    popular: false,
  },
  {
    icon: ArrowRight,
    title: isDE ? "API Access" : "API Access",
    description: isDE
      ? "Voller API-Zugang für Integration in deine CI/CD Pipelines."
      : "Full API access for integration into your CI/CD pipelines.",
    popular: false,
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: isDE ? "Free" : "Free",
    price: isDE ? "0€" : "0€",
    period: isDE ? "Kostenlos" : "Free",
    features: [
      isDE ? "5 Roasts/Monat" : "5 roasts/month",
      isDE ? "Basis Security-Check" : "Basic security check",
      isDE ? "Community Support" : "Community support",
      isDE ? "Öffentliche Leaderboard" : "Public leaderboard",
    ],
    cta: isDE ? "Aktuell aktiv" : "Currently active",
    popular: false,
  },
  {
    name: isDE ? "Pro" : "Pro",
    price: isDE ? "29€" : "29€",
    period: isDE ? "pro Monat" : "per month",
    features: [
      isDE ? "Unbegrenzte Roasts" : "Unlimited roasts",
      isDE ? "Erweiterte Analyse" : "Advanced analysis",
      isDE ? "Private Roasts" : "Private roasts",
      isDE ? "Priority Support" : "Priority support",
      isDE ? "API Access" : "API access",
      isDE ? "Custom Branding" : "Custom branding",
    ],
    cta: isDE ? "Upgrade zu Pro" : "Upgrade to Pro",
    popular: true,
  },
  {
    name: isDE ? "Enterprise" : "Enterprise",
    price: isDE ? "Custom" : "Custom",
    period: isDE ? "auf Anfrage" : "on request",
    features: [
      isDE ? "Unbegrenzte Roasts" : "Unlimited roasts",
      isDE ? "Erweiterte Analyse" : "Advanced analysis",
      isDE ? "Private Roasts" : "Private roasts",
      isDE ? "Dedicated Support" : "Dedicated support",
      isDE ? "API Access" : "API access",
      isDE ? "Custom Branding" : "Custom branding",
      isDE ? "SLA: 99.9%" : "SLA: 99.9%",
      isDE ? "On-Premise Deployment" : "On-premise deployment",
    ],
    cta: isDE ? "Kontakt aufnehmen" : "Contact sales",
    popular: false,
  },
]

export default function RoastProPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const proFeatures = getProFeatures(isDE)
  const pricing = getPricing(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Roast Pro — Premium Features" : "Roast Pro — Premium Features"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Premium Security-Features für Teams und Enterprise. Gated Features für Conversion."
              : "Premium security features for teams and enterprise. Gated features for conversion."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Upgrade für unbegrenzte Roasts und erweiterte Analyse." : "→ Upgrade for unlimited roasts and advanced analysis."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Premium-Features dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "These premium features are for hardening your own systems. No attack tools."}
        </div>

        {/* Pro Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Pro Features" : "Pro Features"}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-gray-800 p-6 rounded-lg border ${
                    feature.popular ? "border-cyan-500" : "border-gray-700"
                  }`}
                >
                  <div className="bg-cyan-900 p-3 rounded-lg w-fit mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-gray-100 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                  {feature.popular && (
                    <div className="mt-3 bg-cyan-900 px-2 py-1 rounded inline-block">
                      <span className="text-xs text-cyan-300">{isDE ? "Beliebt" : "Popular"}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Preise" : "Pricing"}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan, index) => (
              <div
                key={index}
                className={`bg-gray-800 p-6 rounded-lg border ${
                  plan.popular ? "border-cyan-500" : "border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="bg-cyan-900 text-center py-2 rounded-t-lg -mt-6 -mx-6 mb-6">
                    <span className="text-sm font-semibold text-cyan-300">{isDE ? "Beliebt" : "Popular"}</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-1">{plan.price}</div>
                <div className="text-sm text-gray-400 mb-4">{plan.period}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-colors ${
                    plan.popular
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Why Upgrade? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Upgrade?" : "Why Upgrade?"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Unbegrenzte Roasts" : "Unlimited Roasts"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Roaste so viele Stacks wie du willst. Keine Limits für Pro-Nutzer. Perfekt für Teams und Unternehmen."
                  : "Roast as many stacks as you want. No limits for Pro users. Perfect for teams and enterprises."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Erweiterte Analyse" : "Advanced Analysis"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Deep-Dive Security-Analyse mit Detail-Reports und Recommendations. Finde Security-Probleme, die du sonst verpassen würdest."
                  : "Deep-dive security analysis with detailed reports and recommendations. Find security issues you would otherwise miss."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{isDE ? "Private Roasts" : "Private Roasts"}</h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Deine Roasts sind privat und werden nicht in der Leaderboard angezeigt. Perfekt für sensible Infrastruktur."
                  : "Your roasts are private and won't appear in the leaderboard. Perfect for sensitive infrastructure."}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Pro?" : "Ready for Pro?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Upgrade jetzt und entfalle die volle Power von Roast Pro."
                : "Upgrade now and unlock the full power of Roast Pro."}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {isDE ? "Jetzt Upgrade" : "Upgrade Now"}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "API Pricing" : "API Pricing"}</div>
              <div className="text-sm text-gray-300">{isDE ? "API-Zugang" : "API access"}</div>
            </Link>
            <Link href={`/${locale}/merch`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast Merch" : "Roast Merch"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Merchandise" : "Merchandise"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Hall of Fame" : "Hall of Fame"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Elite Stacks" : "Elite stacks"}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
