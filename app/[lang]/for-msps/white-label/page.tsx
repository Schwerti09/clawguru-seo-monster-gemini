import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Palette, Users, TrendingUp, Check, X, ArrowRight, Mail } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import BookingButton from "@/components/booking/BookingButton"
import RoiCalculator from "@/components/roi/RoiCalculator"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"
import { pick } from "@/lib/i18n-pick"
import { RUNBOOK_COUNT_SHORT_EN } from "@/lib/stats"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/for-msps/white-label"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = pick(isDE, "White-Label MSP Partnership — Starter, Pro, Agency | ClawGuru", "White-Label MSP Partnership — Starter, Pro, Agency | ClawGuru")
  const description = pick(isDE, "Vollständig gebrandete Security-Platform für MSPs. 3 Pricing-Tiers: Starter (€990/mo), Pro (€2.490/mo), Agency (Custom). Revenue-Share ab 30%, eigene Domain, Branded Trust-Pages.", "Fully branded security platform for MSPs. 3 pricing tiers: Starter (€990/mo), Pro (€2,490/mo), Agency (Custom). Revenue share from 30%, your own domain, branded trust pages.")
  return {
    title,
    description,
    keywords: ["msp white label", "white label security", "msp partnership", "reseller program", "managed security services", "branded security platform"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPricingTiers = (isDE: boolean) => [
  {
    name: pick(isDE, "Starter", "Starter"),
    subtitle: pick(isDE, "Reseller", "Reseller"),
    price: "€990",
    period: pick(isDE, "/Monat", "/month"),
    limit: pick(isDE, "bis 25 Clients", "up to 25 clients"),
    badge: null,
    features: [
      pick(isDE, `Alle ${RUNBOOK_COUNT_SHORT_EN}+ Runbooks`, `All ${RUNBOOK_COUNT_SHORT_EN}+ runbooks`),
      pick(isDE, "Basis-Branding (Logo + Farbe)", "Basic branding (logo + color)"),
      pick(isDE, "Multi-Client-Dashboard", "Multi-client dashboard"),
      pick(isDE, "Email-Support (48h)", "Email support (48h)"),
      pick(isDE, "Standard-Trust-Pages", "Standard trust pages"),
      pick(isDE, "API-Access (Read-only)", "API access (read-only)"),
    ],
    excluded: [
      pick(isDE, "Eigene Domain", "Your own domain"),
      pick(isDE, "Branded Trust-Pages", "Branded trust pages"),
      pick(isDE, "Custom-Runbooks", "Custom runbooks"),
      pick(isDE, "SSO/SAML", "SSO/SAML"),
      pick(isDE, "Revenue-Share", "Revenue share"),
    ],
  },
  {
    name: pick(isDE, "Pro", "Pro"),
    subtitle: pick(isDE, "White-Label", "White-Label"),
    price: "€2.490",
    period: pick(isDE, "/Monat", "/month"),
    limit: pick(isDE, "bis 100 Clients", "up to 100 clients"),
    badge: pick(isDE, "BELIEBT", "POPULAR"),
    features: [
      pick(isDE, `Alle ${RUNBOOK_COUNT_SHORT_EN}+ Runbooks`, `All ${RUNBOOK_COUNT_SHORT_EN}+ runbooks`),
      pick(isDE, "Full-Branding (Logo + Farbe + Domain)", "Full branding (logo + color + domain)"),
      pick(isDE, "Multi-Client-Dashboard", "Multi-client dashboard"),
      pick(isDE, "Priority-Support (24h)", "Priority support (24h)"),
      pick(isDE, "Branded Trust-Pages", "Branded trust pages"),
      pick(isDE, "API-Access (Read/Write)", "API access (read/write)"),
      pick(isDE, "SSO/SAML Integration", "SSO/SAML integration"),
      pick(isDE, "Custom-Runbooks (5/mo)", "Custom runbooks (5/mo)"),
      pick(isDE, "30% Revenue-Share", "30% revenue share"),
    ],
    excluded: [
      pick(isDE, "Dedicated Partner Manager", "Dedicated partner manager"),
      pick(isDE, "Unlimited Custom-Runbooks", "Unlimited custom runbooks"),
      pick(isDE, "White-Label API", "White-label API"),
    ],
  },
  {
    name: pick(isDE, "Agency", "Agency"),
    subtitle: pick(isDE, "Full Resell", "Full Resell"),
    price: pick(isDE, "Custom", "Custom"),
    period: pick(isDE, "Revenue-Share", "Revenue-share"),
    limit: pick(isDE, "unlimited Clients", "unlimited clients"),
    badge: pick(isDE, "ENTERPRISE", "ENTERPRISE"),
    features: [
      pick(isDE, `Alle ${RUNBOOK_COUNT_SHORT_EN}+ Runbooks`, `All ${RUNBOOK_COUNT_SHORT_EN}+ runbooks`),
      pick(isDE, "Full-White-Label (eigene Domain + Brand)", "Full white-label (your domain + brand)"),
      pick(isDE, "Multi-Client-Dashboard", "Multi-client dashboard"),
      pick(isDE, "Dedicated Partner Manager", "Dedicated partner manager"),
      pick(isDE, "Branded Trust-Pages", "Branded trust pages"),
      pick(isDE, "White-Label API", "White-label API"),
      pick(isDE, "SSO/SAML + SCIM", "SSO/SAML + SCIM"),
      pick(isDE, "Unlimited Custom-Runbooks", "Unlimited custom runbooks"),
      pick(isDE, "40% Revenue-Share", "40% revenue share"),
      pick(isDE, "SLA-Garantie (99.9%)", "SLA guarantee (99.9%)"),
    ],
    excluded: [],
  },
]

const getComparisonData = (isDE: boolean) => [
  {
    feature: pick(isDE, "Eigene Domain", "Your own domain"),
    selfBranded: false,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, "Full-Branding (Logo + Farbe)", "Full branding (logo + color)"),
    selfBranded: false,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, "Branded Trust-Pages", "Branded trust pages"),
    selfBranded: false,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, `${RUNBOOK_COUNT_SHORT_EN}+ Runbooks`, `${RUNBOOK_COUNT_SHORT_EN}+ runbooks`),
    selfBranded: true,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, "Multi-Client-Dashboard", "Multi-client dashboard"),
    selfBranded: true,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, "Custom-Runbooks", "Custom runbooks"),
    selfBranded: false,
    whiteLabel: pick(isDE, "5/mo", "5/mo"),
    fullResell: pick(isDE, "Unlimited", "Unlimited"),
  },
  {
    feature: pick(isDE, "API-Access", "API access"),
    selfBranded: pick(isDE, "Read-only", "Read-only"),
    whiteLabel: pick(isDE, "Read/Write", "Read/Write"),
    fullResell: pick(isDE, "White-Label", "White-label"),
  },
  {
    feature: pick(isDE, "SSO/SAML", "SSO/SAML"),
    selfBranded: false,
    whiteLabel: true,
    fullResell: true,
  },
  {
    feature: pick(isDE, "Revenue-Share", "Revenue share"),
    selfBranded: false,
    whiteLabel: pick(isDE, "30%", "30%"),
    fullResell: pick(isDE, "40%", "40%"),
  },
  {
    feature: pick(isDE, "Dedicated Partner Manager", "Dedicated partner manager"),
    selfBranded: false,
    whiteLabel: false,
    fullResell: true,
  },
]

export default function WhiteLabelPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pricingTiers = getPricingTiers(isDE)
  const comparisonData = getComparisonData(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: pick(isDE, "White-Label MSP Partnership — Starter, Pro, Agency Pricing", "White-Label MSP Partnership — Starter, Pro, Agency Pricing"),
    description: pick(isDE, "Vollständig gebrandete Security-Platform für MSPs. 3 Pricing-Tiers: Starter (€990/mo), Pro (€2.490/mo), Agency (Custom). Revenue-Share ab 30%, eigene Domain, Branded Trust-Pages.", "Fully branded security platform for MSPs. 3 pricing tiers: Starter (€990/mo), Pro (€2,490/mo), Agency (Custom). Revenue share from 30%, your own domain, branded trust pages."),
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
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li><Link href={`/${locale}/for-msps`} className="hover:text-cyan-400">{pick(isDE, "Für MSPs", "For MSPs")}</Link></li>
            <li>/</li>
            <li className="text-gray-300">{pick(isDE, "White-Label", "White-Label")}</li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300">
            {pick(isDE, "Partnership Pricing", "Partnership Pricing")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {pick(isDE, "White-Label MSP Partnership — Starter, Pro, Agency", "White-Label MSP Partnership — Starter, Pro, Agency")}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {pick(isDE, "Vollständig gebrandete Security-Platform unter deiner Marke. 3 Pricing-Tiers für jeden Wachstums-Stadium. Revenue-Share statt Seat-Limits.", "Fully branded security platform under your brand. 3 pricing tiers for every growth stage. Revenue share instead of seat limits.")}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>✓ {pick(isDE, "Keine Seat-Limits", "No seat limits")}</span>
            <span>✓ {pick(isDE, "Revenue-Share ab 30%", "30%+ revenue share")}</span>
            <span>✓ {pick(isDE, "EU-Hosting, DSGVO", "EU-hosted, GDPR")}</span>
            <span>✓ {pick(isDE, "Onboarding in 14 Tagen", "Onboarding in 14 days")}</span>
          </div>
        </section>

        {/* PRICING TIERS */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {pick(isDE, "Pricing Tiers", "Pricing Tiers")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Wähle deinen Wachstums-Stadium", "Choose your growth stage")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`bg-gray-900 border rounded-2xl p-8 relative ${
                  tier.badge
                    ? "border-2 border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-cyan-900/20"
                    : "border-gray-800"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-6 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {tier.badge}
                  </div>
                )}
                <div className="text-sm text-purple-400 font-semibold mb-2">{tier.name}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{tier.subtitle}</h3>
                <div className="text-4xl font-black text-purple-300 mb-1">{tier.price}</div>
                <div className="text-xs text-gray-400 mb-4">{tier.period} · {tier.limit}</div>
                
                <div className="space-y-2 text-sm text-gray-300 mb-6">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {tier.excluded.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-gray-500">
                      <X className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </div>

                <BookingButton
                  type="demo"
                  label={isDE ? `${tier.name} Demo` : `${tier.name} demo`}
                  locale={locale}
                  source={`for_msps_whitelabel_${tier.name.toLowerCase()}`}
                  variant={tier.badge ? "primary" : "secondary"}
                  className="w-full justify-center"
                  subject={isDE ? `${tier.name} White-Label Partnership` : `${tier.name} white-label partnership`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {pick(isDE, "Vergleich", "Comparison")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Self-Branded vs White-Label vs Full Resell", "Self-Branded vs White-Label vs Full Resell")}
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Feature", "Feature")}</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">{pick(isDE, "Self-Branded", "Self-Branded")}</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-purple-300 uppercase">{pick(isDE, "White-Label", "White-Label")}</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-cyan-300 uppercase">{pick(isDE, "Full Resell", "Full Resell")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {comparisonData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-800/50"}>
                    <td className="px-6 py-4 text-sm text-gray-300">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      {typeof row.selfBranded === "boolean" ? (
                        row.selfBranded ? (
                          <Check className="h-5 w-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-400">{row.selfBranded}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {typeof row.whiteLabel === "boolean" ? (
                        row.whiteLabel ? (
                          <Check className="h-5 w-5 text-purple-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-purple-300 font-semibold">{row.whiteLabel}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      {typeof row.fullResell === "boolean" ? (
                        row.fullResell ? (
                          <Check className="h-5 w-5 text-cyan-400 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-red-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-cyan-300 font-semibold">{row.fullResell}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ROI CALCULATOR */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {pick(isDE, "ROI Calculator", "ROI Calculator")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Rechne deinen MSP-Umsatz", "Calculate your MSP revenue")}
          </h2>
          <RoiCalculator locale={locale} source="for_msps_whitelabel_roi" />
        </section>

        {/* LEAD FORM */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {pick(isDE, "Partnership Anfrage", "Partnership inquiry")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Starte deine Partnership-Anfrage", "Start your partnership inquiry")}
          </h2>
          <div className="bg-gray-900 border border-purple-900/40 rounded-2xl p-8">
            <p className="text-gray-300 mb-6">
              {pick(isDE, "Fülle das Formular aus — wir melden uns innerhalb von 24h mit einem Demo-Call.", "Fill out the form — we'll get back to you within 24h with a demo call.")}
            </p>
            <a
              href={`mailto:msp-partnership@clawguru.org?subject=${encodeURIComponent(pick(isDE, "MSP White-Label Partnership Anfrage", "MSP White-Label Partnership Inquiry"))}&body=${encodeURIComponent(
                pick(isDE, `Name:\nFirma:\nWebsite:\nAktuelle Kundenzahl:\nZiel Kundenzahl (12 Monate):\nBekannter Umsatz pro Kunde/Monat:\nWelche Tier interessiert dich (Starter/Pro/Agency)?\nNachricht:`, `Name:\nCompany:\nWebsite:\nCurrent client count:\nTarget client count (12 months):\nKnown revenue per client/month:\nWhich tier interests you (Starter/Pro/Agency)?\nMessage:`)
              )}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 font-bold text-white transition-all"
            >
              <Mail className="h-4 w-4" />
              {pick(isDE, "Partnership-Anfrage senden", "Send partnership inquiry")}
            </a>
            <div className="mt-4 text-xs text-gray-500">
              {pick(isDE, "Oder buche direkt einen Demo-Call:", "Or book a demo call directly:")}
              <div className="mt-2">
                <BookingButton
                  type="demo"
                  label={pick(isDE, "Demo-Call buchen", "Book demo call")}
                  locale={locale}
                  source="for_msps_whitelabel_form"
                  variant="secondary"
                  className="text-sm"
                  subject={pick(isDE, "MSP White-Label Demo", "MSP white-label demo")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CROSS-LINKS */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {pick(isDE, "Weitere Ressourcen", "Further resources")}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {pick(isDE, "Erfahre mehr über MSP-Security", "Learn more about MSP security")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href={`/${locale}/for-msps`} className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-purple-400" />
                <h3 className="font-bold text-gray-100">{pick(isDE, "Für MSPs — Übersicht", "For MSPs — Overview")}</h3>
              </div>
              <p className="text-sm text-gray-400">{pick(isDE, "Warum MSPs auf ClawGuru setzen", "Why MSPs choose ClawGuru")}</p>
            </Link>
            <Link href={`/${locale}/consulting`} className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-purple-400" />
                <h3 className="font-bold text-gray-100">{pick(isDE, "Enterprise Consulting", "Enterprise Consulting")}</h3>
              </div>
              <p className="text-sm text-gray-400">{pick(isDE, "High-Ticket Security-Consulting", "High-ticket security consulting")}</p>
            </Link>
            <Link href={`/${locale}/pricing`} className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-purple-400" />
                <h3 className="font-bold text-gray-100">{pick(isDE, "Team Pricing", "Team Pricing")}</h3>
              </div>
              <p className="text-sm text-gray-400">{pick(isDE, "Pro + Team Abos für interne Teams", "Pro + Team subscriptions for internal teams")}</p>
            </Link>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
