import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { Briefcase, Users, Clock, Check, Shield } from "lucide-react"
import Link from "next/link"
import BookingButton from "@/components/booking/BookingButton"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/consulting"
const PUBLISHED = "2025-11-15"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "Autonomous Security Ops — ClawGuru"
    : "Autonomous Security Ops — ClawGuru"
  const description = isDE
    ? "Automatisiertes Security-Operating-System für Self-Hosted Stacks. KI-gestützte Priorisierung, klare Fix-Pläne, transparente Preise."
    : "Automated security operating system for self-hosted stacks. AI-driven prioritization, clear fix plans, transparent pricing."
  return {
    title,
    description,
    keywords: ["autonomous security ops", "security autopilot", "self-hosted security", "ai remediation", "clawguru"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getServices = (isDE: boolean) => [
  {
    icon: Shield,
    title: isDE ? "Autopilot Risk Scan" : "Autopilot Risk Scan",
    description: isDE
      ? "Kontinuierliche Scans, priorisierte Risiken und klare Handlungsempfehlungen statt einmaliger PDF-Berichte."
      : "Continuous scans, prioritized risks, and clear action plans instead of one-off PDF reports.",
    duration: isDE ? "laufend" : "continuous",
    price: isDE ? "ab 29€/Monat" : "from €29/month",
    popular: true,
  },
  {
    icon: Briefcase,
    title: isDE ? "AI Remediation Planner" : "AI Remediation Planner",
    description: isDE
      ? "LLM-gestützte Fix-Pläne mit Infrastrukturkontext und Runbook-Mapping für direkte Umsetzung."
      : "LLM-powered remediation plans with infrastructure context and runbook mapping for direct execution.",
    duration: isDE ? "in Minuten statt Wochen" : "minutes instead of weeks",
    price: isDE ? "im Pro/Scale enthalten" : "included in Pro/Scale",
    popular: false,
  },
  {
    icon: Users,
    title: isDE ? "Proof-of-Fix Reports" : "Proof-of-Fix Reports",
    description: isDE
      ? "Automatisch erzeugte Evidenz pro Maßnahme: was gefunden wurde, was behoben wurde, welcher Rest-Risiko-Score bleibt."
      : "Automatically generated evidence per action: what was found, what was fixed, and what residual risk remains.",
    duration: isDE ? "bei jedem Lauf" : "on every run",
    price: isDE ? "ab Pro" : "from Pro",
    popular: false,
  },
  {
    icon: Clock,
    title: isDE ? "Human Escalation (optional)" : "Human Escalation (optional)",
    description: isDE
      ? "Nur wenn nötig: klar abgegrenzte Expert-Eingriffe für Sonderfälle, ohne dauerhaftes High-Ticket-Beratermodell."
      : "Only when needed: tightly scoped expert intervention for edge cases, without a permanent high-ticket consultant model.",
    duration: isDE ? "fallbasiert" : "case-based",
    price: isDE ? "ab 490€ pro Fall" : "from €490 per case",
    popular: false,
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: isDE ? "Autopilot Starter" : "Autopilot Starter",
    price: isDE ? "29€" : "€29",
    period: isDE ? "pro Monat" : "per month",
    description: isDE ? "Für Solo-Founder und kleine technische Setups" : "For solo founders and small technical setups",
    features: [
      isDE ? "Kontinuierliche Risikoscans" : "Continuous risk scans",
      isDE ? "Priorisierte Top-Risiken" : "Prioritized top risks",
      isDE ? "Wöchentlicher Risk Digest" : "Weekly risk digest",
      isDE ? "Runbook-Empfehlungen" : "Runbook recommendations",
    ],
    cta: isDE ? "Starter aktivieren" : "Start Starter",
    popular: false,
  },
  {
    name: isDE ? "Autopilot Pro" : "Autopilot Pro",
    price: isDE ? "99€" : "€99",
    period: isDE ? "pro Monat" : "per month",
    description: isDE ? "Für produktive Stacks mit höherer Change-Frequenz" : "For production stacks with higher change velocity",
    features: [
      isDE ? "Alles aus Starter" : "Everything in Starter",
      isDE ? "AI Remediation Planner" : "AI remediation planner",
      isDE ? "Proof-of-Fix Reporting" : "Proof-of-fix reporting",
      isDE ? "API-Exports für Automationen" : "API exports for automation",
      isDE ? "Drift- und Prioritäts-Updates" : "Drift and priority updates",
    ],
    cta: isDE ? "Pro aktivieren" : "Start Pro",
    popular: true,
  },
  {
    name: isDE ? "Autopilot Scale" : "Autopilot Scale",
    price: isDE ? "249€" : "€249",
    period: isDE ? "pro Monat" : "per month",
    description: isDE ? "Für Multi-Workspace Teams mit Governance-Anforderungen" : "For multi-workspace teams with governance needs",
    features: [
      isDE ? "Alles aus Pro" : "Everything in Pro",
      isDE ? "Multi-Workspace + Rollen" : "Multi-workspace + roles",
      isDE ? "Team Dashboards + Kollaboration" : "Team dashboards + collaboration",
      isDE ? "Policy Controls + Integrationen" : "Policy controls + integrations",
      isDE ? "Priorisierte Support-Slots" : "Prioritized support slots",
    ],
    cta: isDE ? "Scale anfragen" : "Talk to sales",
    popular: false,
  },
]

export default function ConsultingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const services = getServices(isDE)
  const pricing = getPricing(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: isDE ? "ClawGuru Autonomous Security Ops — KI-gestützte Security-Automation" : "ClawGuru Autonomous Security Ops — AI-powered security automation",
    description: isDE
      ? "Automatisierte Risikoscans, AI-Remediation und Proof-of-Fix für Self-Hosted Infrastruktur. Monatliche Pläne ab 29€."
      : "Automated risk scans, AI remediation, and proof-of-fix for self-hosted infrastructure. Monthly plans from €29.",
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "Autonomous Security Ops — Fix Your Stack" : "Autonomous Security Ops — Fix Your Stack"}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-3" />
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Automatisiertes Security-Operating-System für Self-Hosted Infrastruktur. KI-gestützte Priorisierung, klare Fix-Pläne, monatliche Preise ab 29€."
              : "Automated security operating system for self-hosted infrastructure. AI-driven prioritization, clear fix plans, monthly pricing from €29."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Von manueller Beratung zu automatisierter Security-Delivery mit messbarem Output." : "→ Move from manual consulting to automated security delivery with measurable output."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Notice</strong>: {isDE
            ? "Diese Seite beschreibt ein automatisiertes Defense-Produkt. Keine Angriffstools, keine Offensiv-Services."
            : "This page describes an automated defensive product. No attack tooling, no offensive services."}
        </div>

        {/* Services */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Services" : "Services"}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className={`bg-gray-800 p-6 rounded-lg border ${
                    service.popular ? "border-cyan-500" : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-cyan-900 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-100 mb-1">{service.title}</h3>
                      <div className="text-sm text-gray-400">{service.duration}</div>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400">{service.price}</div>
                  </div>
                  <p className="text-sm text-gray-300">{service.description}</p>
                  {service.popular && (
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Pricing" : "Pricing"}</h2>
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
                <div className="flex justify-center">
                  <BookingButton
                    type={index === 2 ? "demo" : index === 1 ? "audit" : "strategy"}
                    label={plan.cta}
                    locale={locale}
                    source={`consulting_pricing_${plan.name.toLowerCase().replace(/\s+/g, "_")}`}
                    variant={plan.popular ? "primary" : "secondary"}
                    subject={`${plan.name} ${isDE ? "Anfrage" : "inquiry"}`}
                    className="w-full justify-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Autonomous Ops? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Autonomous Ops?" : "Why Autonomous Ops?"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Always-on statt einmalig" : "Always-on instead of one-off"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Risiken ändern sich täglich. Deshalb überwacht und priorisiert der Autopilot kontinuierlich statt punktuell."
                  : "Risks shift daily. The autopilot continuously monitors and prioritizes instead of giving point-in-time advice."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Proof statt Versprechen" : "Proof instead of promises"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Jede empfohlene Maßnahme wird mit Evidenz und Rest-Risiko dokumentiert, damit Entscheidungen nachvollziehbar bleiben."
                  : "Every recommended action ships with evidence and residual-risk context so decisions stay auditable."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Skaliert ohne Beratungs-Team" : "Scales without a consulting team"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Das Modell ist auf Automatisierung ausgelegt: niedriger Einstieg, klare Upgrades, optionaler Expert-Support nur bei Sonderfällen."
                  : "The model is built for automation: low-friction entry, clear upgrades, and optional expert support only for edge cases."}
              </p>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS (Round 12 — Enterprise Lead Capture) */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Compliance & Vertrauen" : "Compliance & Trust"}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🇪🇺</div>
              <div className="font-bold text-gray-100 text-sm">EU-Hosting</div>
              <div className="text-xs text-gray-400 mt-1">{isDE ? "Frankfurt, DSGVO-konform" : "Frankfurt, GDPR-compliant"}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🔐</div>
              <div className="font-bold text-gray-100 text-sm">ISO 27001</div>
              <div className="text-xs text-gray-400 mt-1">{isDE ? "Audit in Vorbereitung 2026" : "Audit in preparation 2026"}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-bold text-gray-100 text-sm">SOC 2 Type II</div>
              <div className="text-xs text-gray-400 mt-1">{isDE ? "Roadmap 2026 Q3" : "Roadmap 2026 Q3"}</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🏦</div>
              <div className="font-bold text-gray-100 text-sm">NIS2-Ready</div>
              <div className="text-xs text-gray-400 mt-1">{isDE ? "Technische Controls" : "Technical controls"}</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">
                  {isDE ? "Vertraut von Self-Hosted-Teams und Enterprise-Kunden" : "Trusted by self-hosted teams and enterprise customers"}
                </div>
                <div className="text-xs text-gray-500">
                  {isDE ? "4.200+ Runbooks · 147 Academy Pro Absolventen · EU-Hosting" : "4,200+ runbooks · 147 Academy Pro graduates · EU-hosted"}
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <Link href={`/${locale}/case-studies`} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  {isDE ? "Case Studies →" : "Case Studies →"}
                </Link>
                <Link href={`/${locale}/trust-security`} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                  {isDE ? "Trust Center →" : "Trust Center →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {isDE ? "Bereit für Autonomous Security Ops?" : "Ready for Autonomous Security Ops?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Starte mit einem automatisierten Security-Baseline-Setup und skaliere über klare Product-Tiers."
                : "Start with an automated security baseline and scale through clear product tiers."}
            </p>
            <BookingButton
              type="strategy"
              label={isDE ? "Autopilot-Setup starten" : "Start autopilot setup"}
              locale={locale}
              source="consulting_bottom_cta"
              variant="primary"
            />
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/for-msps/white-label`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "White-Label MSP" : "White-Label MSP"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Partnership für MSPs" : "Partnership for MSPs"}</div>
            </Link>
            <Link href={`/${locale}/certification`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Certification" : "Certification"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Security Verified Badge" : "Security verified badge"}</div>
            </Link>
            <Link href={`/${locale}/roast-teams`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast Teams" : "Roast Teams"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Enterprise Plan" : "Enterprise plan"}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Roast starten" : "Start the roast"}</div>
            </Link>
            <Link href={`/${locale}/check`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{isDE ? "Security Check" : "Security Check"}</div>
              <div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div>
            </Link>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
