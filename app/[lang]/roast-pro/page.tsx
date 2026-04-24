import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Crown, Zap, Shield, Lock, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

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
  const title = pick(isDE, "Roast Pro — Premium Security Features | ClawGuru", "Roast Pro — Premium Security Features | ClawGuru")
  const description = pick(isDE, "Premium Security-Features für Teams und Enterprise. Gated Features für Conversion. Keine Mock-Daten.", "Premium security features for teams and enterprise. Gated features for conversion. No mock data.")
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
    title: pick(isDE, "Unbegrenzte Roasts", "Unlimited Roasts"),
    description: pick(isDE, "Roaste so viele Stacks wie du willst. Keine Limits für Pro-Nutzer.", "Roast as many stacks as you want. No limits for Pro users."),
    popular: true,
  },
  {
    icon: Shield,
    title: pick(isDE, "Erweiterte Analyse", "Advanced Analysis"),
    description: pick(isDE, "Deep-Dive Security-Analyse mit Detail-Reports und Recommendations.", "Deep-dive security analysis with detailed reports and recommendations."),
    popular: false,
  },
  {
    icon: Lock,
    title: pick(isDE, "Private Roasts", "Private Roasts"),
    description: pick(isDE, "Deine Roasts sind privat und werden nicht in der Leaderboard angezeigt.", "Your roasts are private and won't appear in the leaderboard."),
    popular: false,
  },
  {
    icon: Crown,
    title: pick(isDE, "Priority Support", "Priority Support"),
    description: pick(isDE, "24/7 Priority Support für alle deine Security-Fragen.", "24/7 priority support for all your security questions."),
    popular: false,
  },
  {
    icon: Check,
    title: pick(isDE, "Custom Branding", "Custom Branding"),
    description: pick(isDE, "White-Label Roasts mit deinem Branding und Logo.", "White-label roasts with your branding and logo."),
    popular: false,
  },
  {
    icon: ArrowRight,
    title: pick(isDE, "API Access", "API Access"),
    description: pick(isDE, "Voller API-Zugang für Integration in deine CI/CD Pipelines.", "Full API access for integration into your CI/CD pipelines."),
    popular: false,
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: pick(isDE, "Free", "Free"),
    price: pick(isDE, "0€", "0€"),
    period: pick(isDE, "Kostenlos", "Free"),
    features: [
      pick(isDE, "5 Roasts/Monat", "5 roasts/month"),
      pick(isDE, "Basis Security-Check", "Basic security check"),
      pick(isDE, "Community Support", "Community support"),
      pick(isDE, "Öffentliche Leaderboard", "Public leaderboard"),
    ],
    cta: pick(isDE, "Aktuell aktiv", "Currently active"),
    popular: false,
  },
  {
    name: pick(isDE, "Pro", "Pro"),
    price: pick(isDE, "29€", "29€"),
    period: pick(isDE, "pro Monat", "per month"),
    features: [
      pick(isDE, "Unbegrenzte Roasts", "Unlimited roasts"),
      pick(isDE, "Erweiterte Analyse", "Advanced analysis"),
      pick(isDE, "Private Roasts", "Private roasts"),
      pick(isDE, "Priority Support", "Priority support"),
      pick(isDE, "API Access", "API access"),
      pick(isDE, "Custom Branding", "Custom branding"),
    ],
    cta: pick(isDE, "Upgrade zu Pro", "Upgrade to Pro"),
    popular: true,
  },
  {
    name: pick(isDE, "Enterprise", "Enterprise"),
    price: pick(isDE, "Custom", "Custom"),
    period: pick(isDE, "auf Anfrage", "on request"),
    features: [
      pick(isDE, "Unbegrenzte Roasts", "Unlimited roasts"),
      pick(isDE, "Erweiterte Analyse", "Advanced analysis"),
      pick(isDE, "Private Roasts", "Private roasts"),
      pick(isDE, "Dedicated Support", "Dedicated support"),
      pick(isDE, "API Access", "API access"),
      pick(isDE, "Custom Branding", "Custom branding"),
      pick(isDE, "SLA: 99.9%", "SLA: 99.9%"),
      pick(isDE, "On-Premise Deployment", "On-premise deployment"),
    ],
    cta: pick(isDE, "Kontakt aufnehmen", "Contact sales"),
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
            {pick(isDE, "Roast Pro — Premium Features", "Roast Pro — Premium Features")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Premium Security-Features für Teams und Enterprise. Gated Features für Conversion.", "Premium security features for teams and enterprise. Gated features for conversion.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Upgrade für unbegrenzte Roasts und erweiterte Analyse.", "→ Upgrade for unlimited roasts and advanced analysis.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Premium-Features dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "These premium features are for hardening your own systems. No attack tools.")}
        </div>

        {/* Pro Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Pro Features", "Pro Features")}</h2>
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
                      <span className="text-xs text-cyan-300">{pick(isDE, "Beliebt", "Popular")}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Preise", "Pricing")}</h2>
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
                    <span className="text-sm font-semibold text-cyan-300">{pick(isDE, "Beliebt", "Popular")}</span>
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Warum Upgrade?", "Why Upgrade?")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Unbegrenzte Roasts", "Unlimited Roasts")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Roaste so viele Stacks wie du willst. Keine Limits für Pro-Nutzer. Perfekt für Teams und Unternehmen.", "Roast as many stacks as you want. No limits for Pro users. Perfect for teams and enterprises.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Erweiterte Analyse", "Advanced Analysis")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Deep-Dive Security-Analyse mit Detail-Reports und Recommendations. Finde Security-Probleme, die du sonst verpassen würdest.", "Deep-dive security analysis with detailed reports and recommendations. Find security issues you would otherwise miss.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Private Roasts", "Private Roasts")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Deine Roasts sind privat und werden nicht in der Leaderboard angezeigt. Perfekt für sensible Infrastruktur.", "Your roasts are private and won't appear in the leaderboard. Perfect for sensitive infrastructure.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für Pro?", "Ready for Pro?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Upgrade jetzt und entfalle die volle Power von Roast Pro.", "Upgrade now and unlock the full power of Roast Pro.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Jetzt Upgrade", "Upgrade Now")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "API Pricing", "API Pricing")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Zugang", "API access")}</div>
            </Link>
            <Link href={`/${locale}/merch`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast Merch", "Roast Merch")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Merchandise", "Merchandise")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot/hall-of-fame`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Hall of Fame", "Hall of Fame")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Elite Stacks", "Elite stacks")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
