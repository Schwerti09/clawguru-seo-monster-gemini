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
    ? "Roast Consulting — Fix Your Stack | ClawGuru"
    : "Roast Consulting — Fix Your Stack | ClawGuru"
  const description = isDE
    ? "Professional Services für Security-Hardening. High-Ticket Consulting für Enterprise. Keine Mock-Daten."
    : "Professional services for security hardening. High-ticket consulting for enterprise. No mock data."
  return {
    title,
    description,
    keywords: ["roast consulting", "security consulting", "fix your stack", "professional services", "enterprise consulting"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getServices = (isDE: boolean) => [
  {
    icon: Shield,
    title: isDE ? "Security Audit" : "Security Audit",
    description: isDE
      ? "Umfassende Security-Audit deiner Infrastruktur. Identifiziere Schwachstellen und bekomme actionable Recommendations."
      : "Comprehensive security audit of your infrastructure. Identify vulnerabilities and get actionable recommendations.",
    duration: isDE ? "2-4 Wochen" : "2-4 weeks",
    price: isDE ? "5.000€" : "5.000€",
    popular: true,
  },
  {
    icon: Briefcase,
    title: isDE ? "Stack Hardening" : "Stack Hardening",
    description: isDE
      ? "Härte deinen Stack nach Best Practices. Cloud-Provider, Container, Database, Network."
      : "Harden your stack according to best practices. Cloud providers, containers, databases, networks.",
    duration: isDE ? "4-6 Wochen" : "4-6 weeks",
    price: isDE ? "8.000€" : "8.000€",
    popular: false,
  },
  {
    icon: Users,
    title: isDE ? "Team Training" : "Team Training",
    description: isDE
      ? "Schulung deines Teams in Security-Best Practices. Hands-on Workshops und Role-based Training."
      : "Train your team in security best practices. Hands-on workshops and role-based training.",
    duration: isDE ? "1-2 Wochen" : "1-2 weeks",
    price: isDE ? "3.000€" : "3.000€",
    popular: false,
  },
  {
    icon: Clock,
    title: isDE ? "24/7 Monitoring" : "24/7 Monitoring",
    description: isDE
      ? "Round-the-clock Security-Monitoring deiner Infrastruktur. Alerting, Incident Response, Remediation."
      : "Round-the-clock security monitoring of your infrastructure. Alerting, incident response, remediation.",
    duration: isDE ? "Laufend" : "Ongoing",
    price: isDE ? "2.000€/Monat" : "2.000€/month",
    popular: false,
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: isDE ? "Starter Package" : "Starter Package",
    price: isDE ? "5.000€" : "5.000€",
    period: isDE ? "einmalig" : "one-time",
    description: isDE ? "Für Startups und kleine Teams" : "For startups and small teams",
    features: [
      isDE ? "Security Audit (1 Woche)" : "Security audit (1 week)",
      isDE ? "Vulnerability Report" : "Vulnerability report",
      isDE ? "Prioritized Recommendations" : "Prioritized recommendations",
      isDE ? "1 Follow-up Call" : "1 follow-up call",
    ],
    cta: isDE ? "Buchen" : "Book Now",
    popular: false,
  },
  {
    name: isDE ? "Professional Package" : "Professional Package",
    price: isDE ? "15.000€" : "15.000€",
    period: isDE ? "einmalig" : "one-time",
    description: isDE ? "Für wachsende Unternehmen" : "For growing companies",
    features: [
      isDE ? "Security Audit (2 Wochen)" : "Security audit (2 weeks)",
      isDE ? "Stack Hardening (4 Wochen)" : "Stack hardening (4 weeks)",
      isDE ? "Vulnerability Report" : "Vulnerability report",
      isDE ? "Prioritized Recommendations" : "Prioritized recommendations",
      isDE ? "Team Training (1 Woche)" : "Team training (1 week)",
      isDE ? "4 Follow-up Calls" : "4 follow-up calls",
    ],
    cta: isDE ? "Buchen" : "Book Now",
    popular: true,
  },
  {
    name: isDE ? "Enterprise Package" : "Enterprise Package",
    price: isDE ? "Custom" : "Custom",
    period: isDE ? "auf Anfrage" : "on request",
    description: isDE ? "Für große Unternehmen" : "For large enterprises",
    features: [
      isDE ? "Security Audit (4 Wochen)" : "Security audit (4 weeks)",
      isDE ? "Stack Hardening (6 Wochen)" : "Stack hardening (6 weeks)",
      isDE ? "Team Training (2 Wochen)" : "Team training (2 weeks)",
      isDE ? "24/7 Monitoring (3 Monate)" : "24/7 monitoring (3 months)",
      isDE ? "Dedicated Consultant" : "Dedicated consultant",
      isDE ? "SLA: 99.9%" : "SLA: 99.9%",
    ],
    cta: isDE ? "Kontakt aufnehmen" : "Contact Sales",
    popular: false,
  },
]

export default function ConsultingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const services = getServices(isDE)
  const pricing = getPricing(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: isDE ? "ClawGuru Security Consulting — Stack Hardening für Enterprise" : "ClawGuru Security Consulting — Stack Hardening for Enterprise",
    description: isDE
      ? "Security-Audit, Stack-Hardening und Team-Training für DevOps- und SecOps-Teams. Fixed-Fee Packages ab 5.000€."
      : "Security audit, stack hardening, and team training for DevOps and SecOps teams. Fixed-fee packages from 5,000€.",
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
            {isDE ? "Security Consulting — Fix Your Stack" : "Security Consulting — Fix Your Stack"}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-3" />
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Professional Services für Security-Hardening. Fixed-Fee Packages ab 5.000€. Strategy Call kostenlos."
              : "Professional services for security hardening. Fixed-fee packages from 5,000€. Free strategy call."}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {isDE ? "→ Lass deine Infrastruktur von Experten härten." : "→ Have your infrastructure hardened by experts."}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Diese Consulting-Dienste dienen zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "These consulting services are for hardening your own systems. No attack tools."}
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

        {/* Why Consulting? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Warum Consulting?" : "Why Consulting?"}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Expertise" : "Expertise"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Unsere Consultants haben jahrelange Erfahrung mit Security-Hardening für Enterprise-Infrastruktur."
                  : "Our consultants have years of experience with security hardening for enterprise infrastructure."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Actionable Results" : "Actionable Results"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Keine theoretischen Berichte. Wir liefern actionable Recommendations, die du sofort umsetzen kannst."
                  : "No theoretical reports. We deliver actionable recommendations you can implement immediately."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{isDE ? "Team Empowerment" : "Team Empowerment"}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Wir schulen dein Team, damit du langfristig unabhängig bist und Security in die DNA deiner Organisation einbaust."
                  : "We train your team so you're self-sufficient in the long run and build security into your organization's DNA."}
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
              {isDE ? "Bereit für Consulting?" : "Ready for Consulting?"}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {isDE
                ? "Lass deine Infrastruktur von Experten härten und Security in deine DNA einbauen."
                : "Have your infrastructure hardened by experts and build security into your DNA."}
            </p>
            <BookingButton
              type="strategy"
              label={isDE ? "Kostenlosen Strategy Call buchen" : "Book a free strategy call"}
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
