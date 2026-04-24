import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { ShieldCheck, Award, CheckCircle, FileText, ExternalLink, Building2 } from "lucide-react"
import Link from "next/link"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/certification"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "Roast Certification — Security Verified Badge | ClawGuru", "Roast Certification — Security Verified Badge | ClawGuru")
  const description = pick(isDE, "Security Certification Badge für Unternehmen. Authority durch verifizierte Security-Standards. Keine Mock-Daten.", "Security certification badge for companies. Authority through verified security standards. No mock data.")
  return {
    title,
    description,
    keywords: ["roast certification", "security verified", "security badge", "enterprise certification", "security authority"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getCertificationLevels = (isDE: boolean) => [
  {
    name: pick(isDE, "Security Verified — Bronze", "Security Verified — Bronze"),
    description: pick(isDE, "Basis-Zertifizierung für Unternehmen mit grundlegenden Security-Standards.", "Basic certification for companies with fundamental security standards."),
    requirements: [
      pick(isDE, "Durchschnittlicher Roast-Score ≥ 70", "Average roast score ≥ 70"),
      pick(isDE, "Keine kritischen Misconfigurations", "No critical misconfigurations"),
      pick(isDE, "Regelmäßige Security-Audits", "Regular security audits"),
    ],
    badgeColor: "from-amber-900/30 to-amber-800/30 border-amber-600",
    textColor: "text-amber-300",
  },
  {
    name: pick(isDE, "Security Verified — Silver", "Security Verified — Silver"),
    description: pick(isDE, "Fortgeschrittene Zertifizierung für Unternehmen mit starken Security-Standards.", "Advanced certification for companies with strong security standards."),
    requirements: [
      pick(isDE, "Durchschnittlicher Roast-Score ≥ 80", "Average roast score ≥ 80"),
      pick(isDE, "Keine kritischen oder hochriskanten Misconfigurations", "No critical or high-risk misconfigurations"),
      pick(isDE, "Automatisiertes Security-Testing", "Automated security testing"),
      pick(isDE, "Security-Team vorhanden", "Security team in place"),
    ],
    badgeColor: "from-gray-700/50 to-gray-600/50 border-gray-400",
    textColor: "text-gray-300",
  },
  {
    name: pick(isDE, "Security Verified — Gold", "Security Verified — Gold"),
    description: pick(isDE, "Premium-Zertifizierung für Unternehmen mit exzellenten Security-Standards.", "Premium certification for companies with excellent security standards."),
    requirements: [
      pick(isDE, "Durchschnittlicher Roast-Score ≥ 90", "Average roast score ≥ 90"),
      pick(isDE, "Keine kritischen, hochriskanten oder mittleren Misconfigurations", "No critical, high-risk, or medium-risk misconfigurations"),
      pick(isDE, "Automatisiertes Security-Testing in CI/CD", "Automated security testing in CI/CD"),
      pick(isDE, "Dedicated Security-Team", "Dedicated security team"),
      pick(isDE, "Security Training für alle Mitarbeiter", "Security training for all employees"),
    ],
    badgeColor: "from-yellow-900/30 to-yellow-800/30 border-yellow-500",
    textColor: "text-yellow-300",
  },
]

const getPricing = (isDE: boolean) => [
  {
    name: pick(isDE, "Bronze Certification", "Bronze Certification"),
    price: pick(isDE, "499€", "499€"),
    period: pick(isDE, "einmalig", "one-time"),
    features: [
      pick(isDE, "Security Verified Bronze Badge", "Security Verified Bronze Badge"),
      pick(isDE, "1 Jahr gültig", "Valid for 1 year"),
      pick(isDE, "Zertifizierungs-Check", "Certification check"),
      pick(isDE, "Badge-Datei für Website", "Badge file for website"),
    ],
    cta: pick(isDE, "Zertifizieren", "Get Certified"),
    popular: false,
  },
  {
    name: pick(isDE, "Silver Certification", "Silver Certification"),
    price: pick(isDE, "999€", "999€"),
    period: pick(isDE, "einmalig", "one-time"),
    features: [
      pick(isDE, "Security Verified Silver Badge", "Security Verified Silver Badge"),
      pick(isDE, "1 Jahr gültig", "Valid for 1 year"),
      pick(isDE, "Erweiterter Zertifizierungs-Check", "Extended certification check"),
      pick(isDE, "Badge-Datei für Website", "Badge file for website"),
      pick(isDE, "Consulting-Call (1 Stunde)", "Consulting call (1 hour)"),
    ],
    cta: pick(isDE, "Zertifizieren", "Get Certified"),
    popular: true,
  },
  {
    name: pick(isDE, "Gold Certification", "Gold Certification"),
    price: pick(isDE, "1999€", "1999€"),
    period: pick(isDE, "einmalig", "one-time"),
    features: [
      pick(isDE, "Security Verified Gold Badge", "Security Verified Gold Badge"),
      pick(isDE, "1 Jahr gültig", "Valid for 1 year"),
      pick(isDE, "Premium Zertifizierungs-Check", "Premium certification check"),
      pick(isDE, "Badge-Datei für Website", "Badge file for website"),
      pick(isDE, "Consulting-Call (3 Stunden)", "Consulting call (3 hours)"),
      pick(isDE, "Priority Support", "Priority support"),
    ],
    cta: pick(isDE, "Zertifizieren", "Get Certified"),
    popular: false,
  },
]

export default function CertificationPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const certificationLevels = getCertificationLevels(isDE)
  const pricing = getPricing(isDE)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {pick(isDE, "Roast Certification — Security Verified", "Roast Certification — Security Verified")}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {pick(isDE, "Security Certification Badge für Unternehmen. Authority durch verifizierte Security-Standards.", "Security certification badge for companies. Authority through verified security standards.")}
          </p>
          <p className="text-sm text-cyan-400 font-medium">
            {pick(isDE, "→ Zeige deinen Kunden, dass du Security ernst nimmst.", "→ Show your customers you take security seriously.")}
          </p>
        </div>

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Zertifizierung dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools.", "This certification is for hardening your own systems. No attack tools.")}
        </div>

        {/* Certification Levels */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Zertifizierungs-Level", "Certification Levels")}</h2>
          <div className="space-y-4">
            {certificationLevels.map((level, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${level.badgeColor} border rounded-lg p-6`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gray-900 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold ${level.textColor} mb-2`}>{level.name}</h3>
                    <p className="text-sm text-gray-300 mb-4">{level.description}</p>
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg">
                  <h4 className={`font-semibold ${level.textColor} mb-3`}>
                    {pick(isDE, "Anforderungen", "Requirements")}
                  </h4>
                  <ul className="space-y-2">
                    {level.requirements.map((requirement, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Zertifizierungs-Preise", "Certification Pricing")}</h2>
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
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
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

        {/* Why Certification? */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Warum Zertifizierung?", "Why Certification?")}</h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{pick(isDE, "Authority", "Authority")}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Zeige deinen Kunden und Partnern, dass du Security-Standards erfüllst. Das Security Verified Badge schafft Vertrauen.", "Show your customers and partners that you meet security standards. The Security Verified badge builds trust.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{pick(isDE, "B2B Revenue", "B2B Revenue")}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Enterprise-Kunden verlangen oft Security-Zertifizierungen. Mit dem Badge erfüllst du diese Anforderungen.", "Enterprise customers often require security certifications. With the badge, you meet these requirements.")}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">{pick(isDE, "Marketing", "Marketing")}</h3>
              </div>
              <p className="text-sm text-gray-300">
                {pick(isDE, "Nutze das Badge auf deiner Website, in Marketing-Materialien und in Sales-Calls.", "Use the badge on your website, in marketing materials, and in sales calls.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              {pick(isDE, "Bereit für Zertifizierung?", "Ready for Certification?")}
            </h3>
            <p className="text-sm text-cyan-200/70 mb-4">
              {pick(isDE, "Zertifiziere dein Unternehmen und zeige deinen Security-Standard.", "Certify your company and show your security standard.")}
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white transition-colors">
              {pick(isDE, "Jetzt zertifizieren", "Get Certified Now")}
            </button>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further resources")}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href={`/${locale}/roast-teams`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast Teams", "Roast Teams")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Enterprise Plan", "Enterprise plan")}</div>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Consulting", "Consulting")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Professional Services", "Professional services")}</div>
            </Link>
            <Link href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Roast My Moltbot", "Roast My Moltbot")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Roast starten", "Start the roast")}</div>
            </Link>
            <Link href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">{pick(isDE, "Security Check", "Security Check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Infrastruktur prüfen", "Check infrastructure")}</div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
