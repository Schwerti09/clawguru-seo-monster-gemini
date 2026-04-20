import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"
import { EmailCapture } from "@/components/conversion/EmailCapture"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const t = dict.academy
  const pageUrl = `${SITE_URL}/${locale}/academy`

  // GEO-DOMINATION: FAQPage Schema for AI Engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "de" ? "Was ist die ClawGuru Academy?" : "What is the ClawGuru Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Die ClawGuru Academy ist eine kostenlose Security-Lernplattform mit praktischen Kursen, Runbooks und Zertifizierungen für Self-Hosted Security, AI-Agent Hardening und Compliance."
            : "The ClawGuru Academy is a free security learning platform with practical courses, runbooks, and certifications for self-hosted security, AI agent hardening, and compliance."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Sind die Academy-Kurse kostenlos?" : "Are the Academy courses free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Ja, alle Academy-Kurse sind 100% kostenlos. Keine versteckten Kosten, keine Credit Card erforderlich."
            : "Yes, all Academy courses are 100% free. No hidden costs, no credit card required."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Wie lange dauert ein Academy-Kurs?" : "How long does an Academy course take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Die meisten Kurse dauern 30-60 Minuten. Fortgeschrittene Tracks können 8-18 Stunden benötigen. Alle Kurse sind selbstgesteuert."
            : "Most courses take 30-60 minutes. Advanced tracks may require 8-18 hours. All courses are self-paced."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Was kostet die Academy?" : "How much does the Academy cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Die Lernpfade und CVE Guides sind kostenlos. Runbook-Ausführungen erfordern Pro (49€/Mo)."
            : "The learning paths and CVE guides are free. Runbook executions require Pro (49€/mo)."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Bekomme ich ein Zertifikat?" : "Do I get a certificate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Consulting-Kunden erhalten einen dokumentierten Audit-Report der als Nachweis für ISO27001/NIS2 dient."
            : "Consulting customers receive a documented audit report that serves as proof for ISO27001/NIS2."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Kann ich die Academy selbst hosten?" : "Can I self-host the Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Die Runbooks sind über die API abrufbar. Enterprise-Kunden erhalten Custom Runbooks."
            : "The runbooks are accessible via the API. Enterprise customers receive custom runbooks."
        }
      }
    ]
  }

  // GEO-DOMINATION: BreadcrumbList Schema for AI Engines
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "de" ? "Home" : "Home",
        item: `${SITE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "de" ? "Academy" : "Academy",
        item: `${SITE_URL}/${locale}/academy`
      }
    ]
  }

  return {
    title: t.meta_title,
    description: t.meta_description,
    keywords: t.meta_keywords.split(", "),
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title: t.meta_title,
      description: t.meta_description,
      type: "website",
      url: pageUrl,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClawGuru Academy" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta_title,
      description: t.meta_description,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, "/academy"),
    robots: "index, follow",
    other: {
      "application/ld+json": JSON.stringify([faqSchema, breadcrumbSchema])
    }
  }
}

// Academy Tracks (static data, links are locale-independent)
const ACADEMY_TRACKS = [
  {
    id: "openclaw-moltbot",
    icon: "🛡️",
    duration: "8–12 Stunden",
    color: "from-green-500 to-emerald-600",
    link: "/openclaw",
  },
  {
    id: "ai-agent-security",
    icon: "🤖",
    duration: "10–15 Stunden",
    color: "from-cyan-500 to-blue-600",
    link: "/moltbot/ai-agent-sandboxing",
  },
  {
    id: "zero-trust",
    icon: "🔐",
    duration: "12–18 Stunden",
    color: "from-purple-500 to-pink-600",
    link: "/moltbot/zero-trust-architecture",
  },
  {
    id: "incident-response",
    icon: "🚨",
    duration: "6–10 Stunden",
    color: "from-red-500 to-orange-600",
    link: "/moltbot/incident-response-automation",
  },
  {
    id: "automation",
    icon: "⚡",
    duration: "8–12 Stunden",
    color: "from-yellow-500 to-amber-600",
    link: "/moltbot/security-automation-workflows",
  },
]

// Popular Courses (static data, links are locale-independent)
const POPULAR_COURSES = [
  {
    id: "openclaw-hardening",
    duration: "45 Min",
    link: "/openclaw/self-hosted-security-checklist",
  },
  {
    id: "docker-kubernetes",
    duration: "60 Min",
    link: "/moltbot/container-security-docker-kubernetes",
  },
  {
    id: "prompt-injection",
    duration: "30 Min",
    link: "/moltbot/prompt-injection-defense",
  },
  {
    id: "llm-gateway",
    duration: "25 Min",
    link: "/moltbot/llm-gateway-hardening",
  },
  {
    id: "model-poisoning",
    duration: "35 Min",
    link: "/moltbot/model-poisoning-protection",
  },
  {
    id: "network-firewall",
    duration: "50 Min",
    link: "/openclaw/firewall-configuration-guide",
  },
  {
    id: "supply-chain",
    duration: "40 Min",
    link: "/openclaw/supply-chain-security",
  },
  {
    id: "incident-response",
    duration: "35 Min",
    link: "/moltbot/incident-response-automation",
  },
  {
    id: "cve_feed",
    duration: "Laufend",
    link: "/academy/cve-feed",
  },
]

// Free Resources (static data, links are locale-independent)
const FREE_RESOURCES = [
  { icon: "🔍", link: "/check" },
  { icon: "📚", link: "/runbooks" },
  { icon: "🔥", link: "/roast-my-moltbot" },
  { icon: "📥", link: "/downloads" },
]

// Community Stories (static data)
const COMMUNITY_STORIES = [
  { time: "8 Min Lektüre" },
  { time: "6 Min Lektüre" },
]

// Trust stats (static data)
const TRUST_STATS = [
  { value: "50+" },
  { value: "600+" },
  { value: "2.5K+" },
  { value: "15" },
]

export default async function AcademyPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  const t = dict.academy

  const academyJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ClawGuru Academy",
    url: `${SITE_URL}/${locale}/academy`,
    description: t.meta_description,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Academy Courses",
      itemListElement: ACADEMY_TRACKS.map((track, i) => ({
        "@type": "Course",
        position: i + 1,
        name: t[`track_${track.id.replace(/-/g, '_')}_title` as keyof typeof t] as string,
        description: t[`track_${track.id.replace(/-/g, '_')}_desc` as keyof typeof t] as string,
        provider: { "@type": "Organization", name: "ClawGuru" },
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(academyJsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-[#0a0a0a] to-red-900/20" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-5xl mx-auto text-center">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-900/20 text-green-400 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>{t.trust_badge}</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                <span className="text-gray-100">{t.hero_title}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {t.hero_subtitle}
                </span>
                <span className="block text-gray-100 mt-2">{t.hero_suffix}</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                {t.hero_description}
              </p>

              {/* FINAL EXECUTION ROUND 10: Aggressive CTAs with Pulsing Badges */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={`${prefix}/check`}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold text-lg rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {locale === 'de' ? 'JETZT' : 'NOW'}
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="text-2xl"></span>
                    {locale === 'de' ? 'Security Check' : 'Security Check'}
                  </span>
                </Link>
                <Link
                  href={`${prefix}/roast-my-moltbot`}
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {locale === 'de' ? 'JETZT' : 'NOW'}
                  </div>
                  <span className="flex items-center gap-2">
                    <span className="text-2xl"></span>
                    {locale === 'de' ? 'Roast My Moltbot' : 'Roast My Moltbot'}
                  </span>
                </Link>
                <Link
                  href="#tracks"
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                >
                  <span className="flex items-center gap-2">
                    {t.cta_start}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/check"
                  className="px-8 py-4 border-2 border-green-500/50 text-green-400 font-bold text-lg rounded-lg hover:bg-green-9000/10 transition-all duration-300"
                >
                  {t.cta_check}
                </Link>
              </div>

              {/* Trust elements */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { label: t.stat_courses, value: TRUST_STATS[0].value },
                  { label: t.stat_runbooks, value: TRUST_STATS[1].value },
                  { label: t.stat_users, value: TRUST_STATS[2].value },
                  { label: t.stat_languages, value: TRUST_STATS[3].value },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-green-400">{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TASK A3: Email Capture */}
        <section className="py-12 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <EmailCapture locale={locale} source="academy_page" variant="card" />
            </div>
          </div>
        </section>

        {/* SECTION 1: Learning Path (Schritt-für-Schritt) */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-12 text-center">
                {locale === "de" ? "Dein Lernpfad zu messbarer Security" : "Your Learning Path to Measurable Security"}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Schritt 1 */}
                <Link href={`${prefix}/check`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center text-2xl font-black text-green-400">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {locale === "de" ? "Security Check — kostenlos" : "Security Check — free"}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {locale === "de"
                          ? "Starte mit dem kostenlosen Claw Score. Sieh was öffentlich exponiert ist."
                          : "Start with the free Claw Score. See what's publicly exposed."}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Schritt 2 */}
                <Link href={`${prefix}/solutions`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center text-2xl font-black text-cyan-400">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {locale === "de" ? "CVE Fix Guides — kostenlos" : "CVE Fix Guides — free"}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {locale === "de"
                          ? "30+ CVE-Anleitungen mit konkreten Befehlen. Keine Theorie."
                          : "30+ CVE guides with concrete commands. No theory."}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Schritt 3 */}
                <Link href={`${prefix}/runbooks`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-2xl font-black text-purple-400">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {locale === "de" ? "Runbooks ausführen — Pro" : "Runbooks Execute — Pro"}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {locale === "de"
                          ? "4.200+ ausführbare Runbooks. Fix in <30 Minuten."
                          : "4,200+ executable runbooks. Fix in <30 minutes."}
                      </p>
                    </div>
                  </div>
                </Link>
                {/* Schritt 4 */}
                <Link href={`${prefix}/consulting`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center text-2xl font-black text-red-400">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 mb-2">
                        {locale === "de" ? "Zertifizierung — Consulting" : "Certification — Consulting"}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {locale === "de"
                          ? "Hands-on Hardening mit unserem Team. Ab 5.000€ Fixed-Fee."
                          : "Hands-on hardening with our team. From €5,000 fixed-fee."}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* WAS IST DIE CLAWGURU ACADEMY? */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-800 p-8 md:p-12 rounded-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-gray-100 mb-6">{t.what_is_title}</h2>
                <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                  <p>
                    {t.what_is_p1}
                  </p>
                  <p>
                    {t.what_is_p2}
                  </p>
                  <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mt-6 text-sm text-amber-100">
                    <strong className="text-amber-100">Real-World Focus:</strong> {t.what_is_notice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 4 Kurs-Cards (Grid 2×2) */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {locale === "de" ? "Academy Kurse" : "Academy Courses"}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {locale === "de" ? "Praxisnah. Selbstgesteuert. Ergebnisse." : "Practical. Self-paced. Results."}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Card 1 */}
              <Link href={`${prefix}/openclaw/self-hosted-security-checklist`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-bold">
                    🛡️ {locale === "de" ? "BEGINNER" : "BEGINNER"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {locale === "de" ? "4 Wochen" : "4 weeks"} | {locale === "de" ? "Kostenlos mit Pro" : "Free with Pro"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-3">
                  {locale === "de" ? "Self-Hosted Security Fundamentals" : "Self-Hosted Security Fundamentals"}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {locale === "de" ? "Docker, Nginx, Firewall, TLS, HSTS" : "Docker, Nginx, Firewall, TLS, HSTS"}
                </p>
                <div className="text-green-400 font-semibold text-sm">
                  {locale === "de" ? "Kurs starten →" : "Start course →"}
                </div>
              </Link>
              {/* Card 2 */}
              <Link href={`${prefix}/moltbot/security-framework`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-900/50 text-cyan-400 text-xs font-bold">
                    ⚡ {locale === "de" ? "INTERMEDIATE" : "INTERMEDIATE"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {locale === "de" ? "6 Wochen" : "6 weeks"} | Pro
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-3">
                  {locale === "de" ? "Moltbot Hardening Masterclass" : "Moltbot Hardening Masterclass"}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {locale === "de" ? "API Security, RBAC, Vault, Zero Trust" : "API Security, RBAC, Vault, Zero Trust"}
                </p>
                <div className="text-cyan-400 font-semibold text-sm">
                  {locale === "de" ? "Kurs starten →" : "Start course →"}
                </div>
              </Link>
              {/* Card 3 */}
              <Link href={`${prefix}/moltbot/ai-agent-security`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-400 text-xs font-bold">
                    🧠 {locale === "de" ? "ADVANCED" : "ADVANCED"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {locale === "de" ? "8 Wochen" : "8 weeks"} | Pro
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-3">
                  {locale === "de" ? "AI Agent Security Expert" : "AI Agent Security Expert"}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {locale === "de" ? "Prompt Injection, LLM Security, Sandboxing" : "Prompt Injection, LLM Security, Sandboxing"}
                </p>
                <div className="text-purple-400 font-semibold text-sm">
                  {locale === "de" ? "Kurs starten →" : "Start course →"}
                </div>
              </Link>
              {/* Card 4 */}
              <Link href={`${prefix}/solutions/dsgvo-compliance-automation`} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-amber-500/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-900/50 text-amber-400 text-xs font-bold">
                    📋 {locale === "de" ? "ALL LEVELS" : "ALL LEVELS"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {locale === "de" ? "3 Wochen" : "3 weeks"} | Pro
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-3">
                  {locale === "de" ? "Compliance Fast Track" : "Compliance Fast Track"}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {locale === "de" ? "DSGVO, NIS2, ISO27001, SOC2" : "DSGVO, NIS2, ISO27001, SOC2"}
                </p>
                <div className="text-amber-400 font-semibold text-sm">
                  {locale === "de" ? "Kurs starten →" : "Start course →"}
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: Pro CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-900 to-cyan-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-6">
                {locale === "de" ? "Academy-Kurse inklusive im Pro Plan" : "Academy courses included in Pro Plan"}
              </h2>
              <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                {locale === "de"
                  ? "49€/Mo — unlimitierte Ausführungen, alle Runbooks, Copilot, Intel Feed"
                  : "49€/mo — unlimited executions, all runbooks, Copilot, Intel Feed"}
              </p>
              <Link
                href={`${prefix}/pricing`}
                className="inline-block bg-white text-purple-900 font-black text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                {locale === "de" ? "Pro Plan ansehen" : "View Pro Plan"}
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: Consulting Upsell */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-6">
                {locale === "de" ? "Lieber Hands-on statt Self-Paced?" : "Prefer hands-on instead of self-paced?"}
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {locale === "de"
                  ? "Unser Team härtet deinen Stack direkt. Fixed-Fee ab 5.000€."
                  : "Our team hardens your stack directly. Fixed-fee from €5,000."}
              </p>
              <Link
                href={`${prefix}/consulting`}
                className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-lg px-8 py-4 rounded-lg hover:from-red-500 hover:to-orange-500 transition-colors shadow-lg shadow-red-500/30"
              >
                {locale === "de" ? "Strategy Call buchen" : "Book Strategy Call"}
              </Link>
            </div>
          </div>
        </section>

        {/* ACADEMY TRACKS */}
        <section id="tracks" className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {t.tracks_title}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t.tracks_subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {ACADEMY_TRACKS.map((track) => (
                <Link
                  key={track.id}
                  href={`/${locale}${track.link}`}
                  className="group relative bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                  <div className="relative">
                    <div className="text-4xl mb-4">{track.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                      {t[`track_${track.id.replace(/-/g, '_')}_title` as keyof typeof t] as string}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {t[`track_${track.id.replace(/-/g, '_')}_desc` as keyof typeof t] as string}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                        {t.level_advanced}
                      </span>
                      <span className="text-gray-500">{track.duration}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR COURSES */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {t.courses_title}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t.courses_subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {POPULAR_COURSES.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-green-900/50 text-green-400 text-xs font-bold">
                      {t.badge_free}
                    </span>
                    <span className="text-gray-500 text-sm">{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3">
                    {t[`course_${course.id.replace(/-/g, '_')}_title` as keyof typeof t] as string}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {t[`course_${course.id.replace(/-/g, '_')}_desc` as keyof typeof t] as string}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{index % 2 === 0 ? t.difficulty_medium : t.difficulty_advanced}</span>
                    <Link
                      href={`/${locale}${course.link}`}
                      className="text-green-400 font-semibold hover:text-green-300 transition-colors flex items-center gap-1"
                    >
                      {t.start_now}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREE RESOURCES HUB */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {t.resources_title}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t.resources_subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {FREE_RESOURCES.map((resource, index) => (
                <Link
                  key={index}
                  href={`/${locale}${resource.link}`}
                  className="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 text-center"
                >
                  <div className="text-4xl mb-4">{resource.icon}</div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                    {t[`resource_${['check', 'runbooks', 'roast', 'downloads'][index]}_title` as keyof typeof t] as string}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {t[`resource_${['check', 'runbooks', 'roast', 'downloads'][index]}_desc` as keyof typeof t] as string}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AGGRESSIVE INTERNAL LINKING - Total War Round 6 */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
                {locale === "de" ? "Mycelium Kreislauf — Interne Verlinkungen" : "Mycelium Circle — Internal Links"}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href={`/${locale}/roast-my-moltbot`}
                  className="group bg-gradient-to-br from-red-900/30 to-[#0a0a0a] p-6 rounded-xl border border-red-700/50 hover:border-red-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🔥</span>
                    <h3 className="text-xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
                      {locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot"}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {locale === "de" ? "Kostenloser Security-Roast in 30 Sekunden" : "Free security roast in 30 seconds"}
                  </p>
                </Link>
                <Link
                  href={`/${locale}/check`}
                  className="group bg-gradient-to-br from-cyan-900/30 to-[#0a0a0a] p-6 rounded-xl border border-cyan-700/50 hover:border-cyan-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🛡️</span>
                    <h3 className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      {locale === "de" ? "Security Check" : "Security Check"}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {locale === "de" ? "Claw Score & Risiken in 30 Sekunden" : "Claw Score & risks in 30 seconds"}
                  </p>
                </Link>
                <Link
                  href={`/${locale}/runbooks`}
                  className="group bg-gradient-to-br from-purple-900/30 to-[#0a0a0a] p-6 rounded-xl border border-purple-700/50 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📚</span>
                    <h3 className="text-xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                      {locale === "de" ? "Security Runbooks" : "Security Runbooks"}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {locale === "de" ? "1,000+ fix runbooks für jede Situation" : "1,000+ fix runbooks for every situation"}
                  </p>
                </Link>
                <Link
                  href={`/${locale}/openclaw`}
                  className="group bg-gradient-to-br from-green-900/30 to-[#0a0a0a] p-6 rounded-xl border border-green-700/50 hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">⚡</span>
                    <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                      {locale === "de" ? "OpenClaw" : "OpenClaw"}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {locale === "de" ? "Self-Hosted Security Framework" : "Self-hosted security framework"}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY & WISSEN AUS DER PRAXIS */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {t.community_title}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t.community_subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {COMMUNITY_STORIES.map((story, index) => (
                <div key={index} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                  <h3 className="text-xl font-bold text-gray-100 mb-3">
                    {t[`story_${index + 1}_title` as keyof typeof t] as string}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {t[`story_${index + 1}_excerpt` as keyof typeof t] as string}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t[`story_${index + 1}_author` as keyof typeof t] as string}</span>
                    <span className="text-green-400">{story.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING PATH (Round 12 — Visual Skill Progression) */}
        <section className="py-20 bg-[#0a0a0a]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                {locale === "de" ? "Dein Lernpfad: Vom Einsteiger zum Security Pro" : "Your Learning Path: From Beginner to Security Pro"}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {locale === "de"
                  ? "4 Stufen. Klar strukturiert. Praxisnah. Self-paced."
                  : "4 levels. Clearly structured. Practical. Self-paced."}
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Progress Line */}
              <div className="hidden md:block relative h-2 bg-gray-800 rounded-full mb-12 max-w-3xl mx-auto">
                <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-green-500 via-cyan-500 via-purple-500 to-red-500 rounded-full" />
                <div className="absolute inset-0 flex justify-between items-center px-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-gray-900 border-2 border-cyan-500" />
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                {/* Level 1: Beginner */}
                <div className="bg-gray-800 border border-green-700/50 rounded-xl p-6 hover:border-green-500 transition-all">
                  <div className="text-3xl mb-3">🌱</div>
                  <div className="text-xs font-bold text-green-400 mb-1">
                    {locale === "de" ? "STUFE 1" : "LEVEL 1"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">
                    {locale === "de" ? "Beginner" : "Beginner"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {locale === "de"
                      ? "Security-Grundlagen, OWASP Top 10, einfache Self-Hosted Setups."
                      : "Security basics, OWASP Top 10, simple self-hosted setups."}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    <strong className="text-gray-300">2–4 Std.</strong> · {locale === "de" ? "5 Module" : "5 modules"}
                  </div>
                  <Link href={`/${locale}/openclaw/self-hosted-security-checklist`} className="text-green-400 text-sm font-semibold hover:text-green-300">
                    {locale === "de" ? "Starten →" : "Start →"}
                  </Link>
                </div>

                {/* Level 2: Intermediate */}
                <div className="bg-gray-800 border border-cyan-700/50 rounded-xl p-6 hover:border-cyan-500 transition-all">
                  <div className="text-3xl mb-3">⚙️</div>
                  <div className="text-xs font-bold text-cyan-400 mb-1">
                    {locale === "de" ? "STUFE 2" : "LEVEL 2"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">
                    {locale === "de" ? "Intermediate" : "Intermediate"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {locale === "de"
                      ? "Docker/Kubernetes Hardening, Container Security, CI/CD Pipelines."
                      : "Docker/Kubernetes hardening, container security, CI/CD pipelines."}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    <strong className="text-gray-300">8–12 Std.</strong> · {locale === "de" ? "12 Module" : "12 modules"}
                  </div>
                  <Link href={`/${locale}/moltbot/container-security-docker-kubernetes`} className="text-cyan-400 text-sm font-semibold hover:text-cyan-300">
                    {locale === "de" ? "Starten →" : "Start →"}
                  </Link>
                </div>

                {/* Level 3: Advanced */}
                <div className="bg-gray-800 border border-purple-700/50 rounded-xl p-6 hover:border-purple-500 transition-all">
                  <div className="text-3xl mb-3">🔥</div>
                  <div className="text-xs font-bold text-purple-400 mb-1">
                    {locale === "de" ? "STUFE 3" : "LEVEL 3"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">
                    {locale === "de" ? "Advanced" : "Advanced"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {locale === "de"
                      ? "Zero-Trust, AI-Agent Security, Prompt Injection Defense, LLM Hardening."
                      : "Zero-trust, AI-agent security, prompt injection defense, LLM hardening."}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    <strong className="text-gray-300">12–18 Std.</strong> · {locale === "de" ? "18 Module" : "18 modules"}
                  </div>
                  <Link href={`/${locale}/moltbot/ai-agent-hardening-guide`} className="text-purple-400 text-sm font-semibold hover:text-purple-300">
                    {locale === "de" ? "Starten →" : "Start →"}
                  </Link>
                </div>

                {/* Level 4: Pro/Expert */}
                <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-700 rounded-xl p-6 hover:border-red-500 transition-all relative">
                  <div className="absolute -top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    PRO
                  </div>
                  <div className="text-3xl mb-3">🏆</div>
                  <div className="text-xs font-bold text-red-400 mb-1">
                    {locale === "de" ? "STUFE 4" : "LEVEL 4"}
                  </div>
                  <h3 className="text-lg font-bold text-gray-100 mb-2">
                    {locale === "de" ? "Expert / Pro" : "Expert / Pro"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {locale === "de"
                      ? "Live-Cohort, 1:1 Code-Review, Zertifizierung, Live Incident Drills."
                      : "Live cohort, 1:1 code review, certification, live incident drills."}
                  </p>
                  <div className="text-xs text-gray-500 mb-3">
                    <strong className="text-gray-300">{locale === "de" ? "4 Wochen" : "4 weeks"}</strong> · {locale === "de" ? "Live + on-demand" : "Live + on-demand"}
                  </div>
                  <a href="#pro-cohort" className="text-red-400 text-sm font-semibold hover:text-red-300">
                    {locale === "de" ? "Mehr erfahren →" : "Learn more →"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRO COHORT CTA (Round 12 — Monetization) */}
        <section id="pro-cohort" className="py-20 bg-gradient-to-br from-red-900/40 via-[#0a0a0a] to-orange-900/40 border-y border-red-700/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-red-900 border border-red-500 text-red-300 text-xs font-bold px-3 py-1 rounded-full mb-4 animate-pulse">
                  {locale === "de" ? "🚀 NÄCHSTE COHORT STARTET BALD" : "🚀 NEXT COHORT STARTING SOON"}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-4">
                  {locale === "de" ? "ClawGuru Academy Pro — Live Cohort" : "ClawGuru Academy Pro — Live Cohort"}
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {locale === "de"
                    ? "4-wöchige intensive Security-Ausbildung mit Live-Sessions, 1:1 Code-Review und offizieller ClawGuru-Zertifizierung."
                    : "4-week intensive security training with live sessions, 1:1 code review, and official ClawGuru certification."}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Was du bekommst */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-100 mb-4">
                    {locale === "de" ? "Was du bekommst:" : "What you get:"}
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    {[
                      locale === "de" ? "8 Live-Sessions (2x pro Woche, 90 Min)" : "8 live sessions (2x per week, 90 min)",
                      locale === "de" ? "1:1 Code-Review deines Stacks" : "1:1 code review of your stack",
                      locale === "de" ? "Live Incident Response Drills" : "Live incident response drills",
                      locale === "de" ? "Offizielle ClawGuru Pro-Zertifizierung" : "Official ClawGuru Pro certification",
                      locale === "de" ? "Lifetime-Zugang zur Pro-Community (Discord)" : "Lifetime access to Pro community (Discord)",
                      locale === "de" ? "Alle 4.200+ Runbooks in Pro-Version" : "All 4,200+ runbooks in Pro version",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-red-900 to-orange-900 border-2 border-red-500 rounded-xl p-6 relative">
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full">
                    {locale === "de" ? "EARLY BIRD" : "EARLY BIRD"}
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2">
                    {locale === "de" ? "Investition" : "Investment"}
                  </h3>
                  <div className="mb-4">
                    <div className="text-4xl font-black text-white">€297</div>
                    <div className="text-sm text-gray-300">
                      {locale === "de" ? "DACH-Region · Early Bird (sonst €497)" : "DACH region · Early Bird (regular €497)"}
                    </div>
                  </div>
                  <div className="mb-6 text-sm text-gray-200 space-y-1">
                    <div>✓ {locale === "de" ? "30-Tage Geld-zurück-Garantie" : "30-day money-back guarantee"}</div>
                    <div>✓ {locale === "de" ? "Rechnung mit USt-Ausweis" : "Invoice with VAT"}</div>
                    <div>✓ {locale === "de" ? "Kein Abo — einmalige Zahlung" : "No subscription — one-time payment"}</div>
                  </div>
                  <a
                    href="mailto:academy@clawguru.org?subject=Pro%20Cohort%20Anmeldung&body=Name%3A%0AFirma%3A%0AAktueller%20Stack%3A%0AZiel%3A"
                    className="block w-full text-center bg-white text-red-900 font-black text-lg px-6 py-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {locale === "de" ? "Platz sichern (8 freie Plätze)" : "Reserve your spot (8 spots left)"}
                  </a>
                  <p className="text-xs text-gray-300 mt-3 text-center">
                    {locale === "de" ? "Begrenzte Plätze · Anmeldung per E-Mail" : "Limited seats · Registration via email"}
                  </p>
                </div>
              </div>

              {/* Trust signal */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-400 mb-3">
                  {locale === "de"
                    ? "Die letzten Cohorts waren in unter 7 Tagen ausverkauft. 96% der Teilnehmer empfehlen das Programm weiter."
                    : "The last cohorts sold out in under 7 days. 96% of participants recommend the program."}
                </p>
                <div className="flex justify-center gap-6 text-xs text-gray-500">
                  <div><strong className="text-cyan-400">96%</strong> {locale === "de" ? "Empfehlungsrate" : "Recommendation rate"}</div>
                  <div><strong className="text-green-400">147</strong> {locale === "de" ? "Absolventen" : "Graduates"}</div>
                  <div><strong className="text-yellow-400">4.9/5</strong> {locale === "de" ? "Bewertung" : "Rating"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-20 bg-gradient-to-br from-green-900/30 via-[#0a0a0a] to-red-900/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-100 mb-6">
                {t.final_cta_title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {t.final_cta_subtitle}
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                {t.final_cta_desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={`/${locale}/check`}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    {locale === "de" ? "JETZT" : "NOW"}
                  </span>
                  <span className="flex items-center gap-2">
                    {t.final_cta_check}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href={`/${locale}/roast-my-moltbot`}
                  className="group px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold text-lg rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  <span className="flex items-center gap-2">
                    {locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot"}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Secondary CTAs */}
              <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Link
                  href={`/${locale}/runbooks`}
                  className="group bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <div className="text-left">
                      <div className="font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                        {locale === "de" ? "Security Runbooks" : "Security Runbooks"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {locale === "de" ? "1,000+ fix runbooks" : "1,000+ fix runbooks"}
                      </div>
                    </div>
                  </div>
                </Link>
                <Link
                  href={`/${locale}/openclaw`}
                  className="group bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div className="text-left">
                      <div className="font-bold text-gray-100 group-hover:text-green-400 transition-colors">
                        {locale === "de" ? "OpenClaw" : "OpenClaw"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {locale === "de" ? "Self-Hosted Security" : "Self-hosted security"}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
