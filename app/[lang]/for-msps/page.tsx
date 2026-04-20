import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Zap, Palette, Users, TrendingUp, Check, AlertTriangle } from "lucide-react"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import BookingButton from "@/components/booking/BookingButton"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/for-msps"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = isDE
    ? "White-Label Security Platform für MSPs | ClawGuru"
    : "White-Label Security Platform for MSPs | ClawGuru"
  const description = isDE
    ? "Verkaufe Security an deine Kunden unter deiner Marke. 4.2M+ Runbooks, Branded Trust-Pages, Multi-Client-Dashboard. Revenue-Share ab 30%."
    : "Sell security to your clients under your brand. 4.2M+ runbooks, branded trust pages, multi-client dashboard. Revenue share from 30%."
  return {
    title,
    description,
    keywords: ["msp security", "white label security", "managed security services", "msp platform", "reseller security", "branded security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const getPains = (isDE: boolean) => [
  {
    icon: AlertTriangle,
    title: isDE ? "Build-vs-Buy-Dilemma" : "Build-vs-buy dilemma",
    desc: isDE
      ? "Security-Content selbst bauen kostet 2 FTE × 12 Monate = €400k. Jede Tool-Subscription pro Kunde frisst Marge."
      : "Building security content yourself costs 2 FTE × 12 months = €400k. Every per-client tool subscription eats margin.",
  },
  {
    icon: Users,
    title: isDE ? "Kein Upsell nach Setup" : "No upsell after setup",
    desc: isDE
      ? "Nach Initial-Onboarding sinkt ARPU. Recurring Security-Services = der höchste LTV-Multiplier — aber kein Team-Know-how dafür."
      : "After initial onboarding, ARPU drops. Recurring security services = the highest LTV multiplier — but no in-house know-how.",
  },
  {
    icon: Palette,
    title: isDE ? "White-Label-Tools sind teuer oder rudimentär" : "White-label tools are expensive or rudimentary",
    desc: isDE
      ? "Enterprise-Grade Plattformen starten bei €50k/Jahr. Günstige Tools sehen aus wie aus 2015 und beschädigen deine Marke."
      : "Enterprise-grade platforms start at €50k/year. Cheap tools look like 2015 and damage your brand.",
  },
  {
    icon: TrendingUp,
    title: isDE ? "Compliance-Druck bei Kunden wächst" : "Client compliance pressure is growing",
    desc: isDE
      ? "NIS2, DORA, ISO 27001, CRA — Kunden fragen jetzt. Wer keine Antwort hat, verliert den Account."
      : "NIS2, DORA, ISO 27001, CRA — clients are asking now. No answer = lost account.",
  },
]

const getSolutions = (isDE: boolean) => [
  {
    icon: Palette,
    title: isDE ? "Volle Markenkontrolle" : "Full brand control",
    desc: isDE
      ? "Eigenes Logo, Domain, Farbpalette. Deine Kunden sehen deine Marke — nie ClawGuru. Trust-Pages, Reports, Runbooks alles gebrandet."
      : "Your logo, domain, color palette. Clients see your brand — never ClawGuru. Trust pages, reports, runbooks all branded.",
  },
  {
    icon: Shield,
    title: isDE ? "4.2M+ Runbooks sofort verfügbar" : "4.2M+ runbooks available instantly",
    desc: isDE
      ? "Keine Inhalte erstellen — sofort skalieren. Expert-reviewed. Täglich aktualisiert. Du verkaufst, wir pflegen."
      : "No content to create — scale immediately. Expert-reviewed. Daily updates. You sell, we maintain.",
  },
  {
    icon: Users,
    title: isDE ? "Multi-Client-Dashboard" : "Multi-client dashboard",
    desc: isDE
      ? "Alle Kunden in einer Console. Claw Score pro Kunde, Trend-Charts, Risk-Priorisierung, Incident-Tickets direkt an dich."
      : "All clients in one console. Claw score per client, trend charts, risk prioritization, incident tickets routed to you.",
  },
  {
    icon: TrendingUp,
    title: isDE ? "Revenue-Share ab 30%" : "30%+ revenue share",
    desc: isDE
      ? "Du setzt eigene Preise gegenüber deinen Kunden. Wir nehmen einen festen Anteil am End-Umsatz — du skalierst free and clear."
      : "You set your own client prices. We take a fixed share of end revenue — you scale free and clear.",
  },
]

const getProof = (isDE: boolean) => [
  { metric: "30%+", label: isDE ? "Revenue-Share für dich" : "Revenue share to you" },
  { metric: "14d", label: isDE ? "White-Label-Onboarding" : "White-label onboarding" },
  { metric: "4.2M+", label: isDE ? "Runbooks (täglich gepflegt)" : "Runbooks (daily updated)" },
  { metric: "∞", label: isDE ? "Kunden, keine Seat-Limits" : "Clients, no seat limits" },
]

export default function ForMspsPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pains = getPains(isDE)
  const solutions = getSolutions(isDE)
  const proof = getProof(isDE)

  const articleSchema = buildAuthoredArticleSchema({
    headline: isDE
      ? "White-Label Security Platform für MSPs"
      : "White-Label Security Platform for MSPs",
    description: isDE
      ? "Verkaufe Security unter deiner Marke. 4.2M+ Runbooks, Branded Trust-Pages, Multi-Client-Dashboard, Revenue-Share ab 30%."
      : "Sell security under your brand. 4.2M+ runbooks, branded trust pages, multi-client dashboard, revenue share from 30%.",
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
            <li className="text-gray-300">{isDE ? "Für MSPs" : "For MSPs"}</li>
          </ol>
        </nav>

        {/* HERO */}
        <section className="mb-14">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-300">
            {isDE ? "Vertikal: MSPs & Reseller" : "Vertical: MSPs & Resellers"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {isDE
              ? "Verkaufe Security unter deiner Marke — ohne Content selbst zu bauen"
              : "Sell security under your brand — without building content yourself"}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            {isDE
              ? "4.2M+ Expert-Reviewed Runbooks, Multi-Client-Dashboard, Branded Trust-Pages. Revenue-Share statt Seat-Limit. Onboarding in 14 Tagen."
              : "4.2M+ expert-reviewed runbooks, multi-client dashboard, branded trust pages. Revenue share instead of seat limits. Onboarding in 14 days."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <BookingButton
              type="demo"
              label={isDE ? "White-Label-Demo buchen" : "Book white-label demo"}
              locale={locale}
              source="for_msps_hero_primary"
              variant="primary"
              subject={isDE ? "MSP White-Label Demo" : "MSP white-label demo"}
            />
            <Link
              href={`/${locale}/partners-apply`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/15 hover:border-cyan-400/40 font-bold text-gray-200 transition-all"
            >
              <Users className="h-4 w-4" aria-hidden />
              {isDE ? "Partnerprogramm anzeigen" : "View partner program"}
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>✓ {isDE ? "Keine Seat-Limits" : "No seat limits"}</span>
            <span>✓ {isDE ? "Revenue-Share ab 30%" : "30%+ revenue share"}</span>
            <span>✓ {isDE ? "EU-Hosting, DSGVO" : "EU-hosted, GDPR"}</span>
          </div>
        </section>

        {/* PROOF */}
        <section className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {proof.map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-700/30 rounded-lg p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-purple-300">{p.metric}</div>
              <div className="text-xs text-gray-400 mt-1">{p.label}</div>
            </div>
          ))}
        </section>

        {/* PROBLEM */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-red-400">
            {isDE ? "MSP-Realität heute" : "MSP reality today"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "Warum Margen sinken" : "Why margins are shrinking"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pains.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="bg-gray-900 border border-red-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-red-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-red-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-2">{p.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SOLUTION */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {isDE ? "Mit ClawGuru White-Label" : "With ClawGuru white-label"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "Scale ohne Content-Team" : "Scale without a content team"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {solutions.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="bg-gray-900 border border-purple-900/40 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 bg-purple-900/30 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-purple-400" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-100 mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* PRICING */}
        <section className="mb-14">
          <div className="text-xs font-mono uppercase tracking-widest mb-2 text-purple-400">
            {isDE ? "Pricing-Modell" : "Pricing model"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">
            {isDE ? "White-Label Partnership" : "White-Label Partnership"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="text-sm text-purple-400 font-semibold mb-2">{isDE ? "Starter" : "Starter"}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {isDE ? "Reseller" : "Reseller"}
              </h3>
              <div className="text-4xl font-black text-purple-300 mb-1">€990</div>
              <div className="text-xs text-gray-400 mb-4">{isDE ? "/Monat · bis 25 Clients" : "/month · up to 25 clients"}</div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Alle 4.2M Runbooks" : "All 4.2M runbooks"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Basis-Branding (Logo + Farbe)" : "Basic branding (logo + color)"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Multi-Client-Dashboard" : "Multi-client dashboard"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Email-Support" : "Email support"}</li>
              </ul>
              <BookingButton
                type="demo"
                label={isDE ? "Starter Demo" : "Starter demo"}
                locale={locale}
                source="for_msps_pricing_starter"
                variant="secondary"
                className="w-full justify-center"
              />
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border-2 border-purple-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-6 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {isDE ? "BELIEBT" : "POPULAR"}
              </div>
              <div className="text-sm text-purple-300 font-semibold mb-2">{isDE ? "Growth" : "Growth"}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {isDE ? "Full White-Label" : "Full White-Label"}
              </h3>
              <div className="text-4xl font-black text-purple-300 mb-1">{isDE ? "Custom" : "Custom"}</div>
              <div className="text-xs text-gray-400 mb-4">{isDE ? "Revenue-Share-Modell · unlimited Clients" : "Revenue-share model · unlimited clients"}</div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Eigene Domain + Full-Branding" : "Your own domain + full branding"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Branded Trust-Pages für deine Kunden" : "Branded trust pages for your clients"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Custom-Runbooks auf Anfrage" : "Custom runbooks on request"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "API-Access + SSO" : "API access + SSO"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "Dedicated Partner Manager" : "Dedicated partner manager"}</li>
                <li className="flex items-start gap-2"><Check className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />{isDE ? "30%+ Revenue-Share" : "30%+ revenue share"}</li>
              </ul>
              <BookingButton
                type="demo"
                label={isDE ? "Partnership Call buchen" : "Book partnership call"}
                locale={locale}
                source="for_msps_pricing_growth"
                variant="primary"
                className="w-full justify-center"
              />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mb-14">
          <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-700/50 rounded-2xl p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">
              {isDE ? "Bereit für dein eigenes Security-Angebot?" : "Ready to launch your own security offering?"}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {isDE
                ? "30-min Demo zeigt dir Dashboard, Branding und Revenue-Share-Struktur konkret."
                : "30-min demo walks you through dashboard, branding, and revenue-share structure."}
            </p>
            <div className="flex justify-center">
              <BookingButton
                type="demo"
                label={isDE ? "White-Label-Demo buchen" : "Book white-label demo"}
                locale={locale}
                source="for_msps_final_cta"
                variant="primary"
              />
            </div>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
