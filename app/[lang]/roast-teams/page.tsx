import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Users, Shield, Zap, Lock, Check, ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roast-teams"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Teams — Enterprise Plan | ClawGuru", "Roast Teams — Enterprise Plan | ClawGuru")
  const description = pick(isDE, "Team-Roasts für Enterprise. B2B Revenue mit Team-Features. Keine Mock-Daten.", "Team roasts for enterprise. B2B revenue with team features. No mock data.")
  return {
    title,
    description,
    keywords: ["roast teams", "enterprise plan", "team security", "b2b security", "enterprise features"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getTeamFeatures = (isDE: boolean) => [
  {
    icon: Users,
    title: pick(isDE, "Team-Roasts", "Team Roasts"),
    description: pick(isDE, "Roaste gemeinsam mit deinem Team. Kolaborative Security-Analyse für bessere Ergebnisse.", "Roast together with your team. Collaborative security analysis for better results."),
    popular: true,
  },
  {
    icon: Shield,
    title: pick(isDE, "Team Dashboard", "Team Dashboard"),
    description: pick(isDE, "Zentrales Dashboard für alle Team-Roasts. Übersicht über Security-Status des gesamten Teams.", "Central dashboard for all team roasts. Overview of the security status of the entire team."),
    popular: false,
  },
  {
    icon: Zap,
    title: pick(isDE, "Bulk Roasts", "Bulk Roasts"),
    description: pick(isDE, "Roaste mehrere Stacks gleichzeitig. Perfekt für Migrationen und Audits.", "Roast multiple stacks at once. Perfect for migrations and audits."),
    popular: false,
  },
  {
    icon: Lock,
    title: pick(isDE, "Team Privacy", "Team Privacy"),
    description: pick(isDE, "Deine Team-Roasts sind privat und werden nur für dein Team sichtbar.", "Your team roasts are private and only visible to your team."),
    popular: false,
  },
  {
    icon: Building2,
    title: pick(isDE, "SSO Integration", "SSO Integration"),
    description: pick(isDE, "Single Sign-On mit SAML oder OAuth. Nahtlose Integration in dein Unternehmen.", "Single sign-on with SAML or OAuth. Seamless integration into your company."),
    popular: false,
  },
  {
    icon: Check,
    title: pick(isDE, "Dedicated Support", "Dedicated Support"),
    description: pick(isDE, "Dedicated Support für Enterprise-Kunden. 24/7 Priority Support.", "Dedicated support for enterprise customers. 24/7 priority support."),
    popular: false,
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: pick(isDE, "Team Starter", "Team Starter"),
    price: pick(isDE, "99€", "99€"),
    period: pick(isDE, "pro Monat", "per month"),
    description: pick(isDE, "Für kleine Teams (5 Nutzer)", "For small teams (5 users)"),
    features: [
      pick(isDE, "5 Team-Mitglieder", "5 team members"),
      pick(isDE, "Unbegrenzte Team-Roasts", "Unlimited team roasts"),
      pick(isDE, "Team Dashboard", "Team dashboard"),
      pick(isDE, "Bulk Roasts (10/Stunde)", "Bulk roasts (10/hour)"),
      pick(isDE, "Email Support", "Email support"),
    ],
    cta: pick(isDE, "Starten", "Get Started"),
    popular: false,
  },
  {
    name: pick(isDE, "Team Pro", "Team Pro"),
    price: pick(isDE, "249€", "249€"),
    period: pick(isDE, "pro Monat", "per month"),
    description: pick(isDE, "Für wachsende Teams (20 Nutzer)", "For growing teams (20 users)"),
    features: [
      pick(isDE, "20 Team-Mitglieder", "20 team members"),
      pick(isDE, "Unbegrenzte Team-Roasts", "Unlimited team roasts"),
      pick(isDE, "Team Dashboard", "Team dashboard"),
      pick(isDE, "Bulk Roasts (50/Stunde)", "Bulk roasts (50/hour)"),
      pick(isDE, "Priority Support", "Priority support"),
      pick(isDE, "SSO Integration", "SSO integration"),
    ],
    cta: pick(isDE, "Starten", "Get Started"),
    popular: true,
  },
  {
    name: pick(isDE, "Enterprise", "Enterprise"),
    price: pick(isDE, "Custom", "Custom"),
    period: pick(isDE, "auf Anfrage", "on request"),
    description: pick(isDE, "Für große Unternehmen (unbegrenzt)", "For large enterprises (unlimited)"),
    features: [
      pick(isDE, "Unbegrenzte Team-Mitglieder", "Unlimited team members"),
      pick(isDE, "Unbegrenzte Team-Roasts", "Unlimited team roasts"),
      pick(isDE, "Team Dashboard", "Team dashboard"),
      pick(isDE, "Unbegrenzte Bulk Roasts", "Unlimited bulk roasts"),
      pick(isDE, "Dedicated Support", "Dedicated support"),
      pick(isDE, "SSO Integration", "SSO integration"),
      pick(isDE, "SLA: 99.9%", "SLA: 99.9%"),
      pick(isDE, "On-Premise Deployment", "On-premise deployment"),
    ],
    cta: pick(isDE, "Kontakt aufnehmen", "Contact sales"),
    popular: false,
  },
]

export default function RoastTeamsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const teamFeatures = getTeamFeatures(isDE)
  const pricing = getPricing(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Teams — Enterprise Plan", "Roast Teams — Enterprise Plan")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Team-Roasts für Enterprise. B2B Revenue mit Team-Features.", "Team roasts for enterprise. B2B revenue with team features.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Kolaborative Security-Analyse für dein Team.", "→ Collaborative security analysis for your team.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Team-Features dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "These team features are for hardening your own systems. No attack tools.")}
        </div>

        {/* Team Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Team Features", "Team Features")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamFeatures.map((feature, index) => {
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Team Pricing", "Team Pricing")}</h2>
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
                <div className="text-sm text-gray-400 mb-2">{plan.period}</div>
                <div className="text-sm text-gray-300 mb-4">{plan.description}</div>
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

        {/* Why Teams? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Warum Roast Teams?", "Why Roast Teams?")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Kolaborative Security", "Collaborative Security")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Roaste gemeinsam mit deinem Team. Kolaborative Security-Analyse für bessere Ergebnisse und schnelleres Lernen.", "Roast together with your team. Collaborative security analysis for better results and faster learning.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Zentrales Dashboard", "Central Dashboard")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Zentrales Dashboard für alle Team-Roasts. Übersicht über Security-Status des gesamten Teams auf einen Blick.", "Central dashboard for all team roasts. Overview of the security status of the entire team at a glance.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">{pick(isDE, "Bulk Roasts", "Bulk Roasts")}</h3>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Roaste mehrere Stacks gleichzeitig. Perfekt für Migrationen, Audits und Compliance-Checks.", "Roast multiple stacks at once. Perfect for migrations, audits, and compliance checks.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für Teams?", "Ready for Teams?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Upgrade jetzt und entfalle die volle Power von Roast Teams.", "Upgrade now and unlock the full power of Roast Teams.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Jetzt starten", "Get Started Now")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/roast-pro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast Pro", "Roast Pro")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Premium Features", "Premium features")}</div>
            </Link>
            <Link href={`/${locale}/api-pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "API Pricing", "API Pricing")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "API-Zugang", "API access")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Consulting", "Consulting")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Professional Services", "Professional services")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
