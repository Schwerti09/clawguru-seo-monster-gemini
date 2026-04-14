import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/dictionary"

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
    link: "/moltbot/ai-agent-hardening-guide",
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
    link: "/runbooks",
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
        name: t[`track_${track.id.replace('-', '_')}_title` as keyof typeof t] as string,
        description: t[`track_${track.id.replace('-', '_')}_desc` as keyof typeof t] as string,
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                  href={track.link}
                  className="group relative bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
                  <div className="relative">
                    <div className="text-4xl mb-4">{track.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                      {t[`track_${track.id.replace('-', '_')}_title` as keyof typeof t] as string}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {t[`track_${track.id.replace('-', '_')}_desc` as keyof typeof t] as string}
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
                    {t[`course_${course.id.replace('-', '_')}_title` as keyof typeof t] as string}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {t[`course_${course.id.replace('-', '_')}_desc` as keyof typeof t] as string}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{index % 2 === 0 ? t.difficulty_medium : t.difficulty_advanced}</span>
                    <Link
                      href={course.link}
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
                  href={resource.link}
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
                  href="/check"
                  className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                >
                  <span className="flex items-center gap-2">
                    {t.final_cta_check}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/downloads"
                  className="px-8 py-4 border-2 border-green-500/50 text-green-400 font-bold text-lg rounded-lg hover:bg-green-9000/10 transition-all duration-300"
                >
                  {t.final_cta_downloads}
                </Link>
              </div>

              <div className="mt-12 text-gray-500 text-sm">
                <p>{t.final_cta_note}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
