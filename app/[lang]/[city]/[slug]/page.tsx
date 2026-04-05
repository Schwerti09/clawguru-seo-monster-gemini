import type { Metadata } from "next"

import Container from "@/components/shared/Container"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import {
  GEO_OPENCLAW_SPRINT_CITIES,
  GEO_OPENCLAW_SPRINT_SLUGS,
  type GeoOpenClawSprintCity,
  type GeoOpenClawSprintPageSlug,
  geoOpenClawSprintPageSlugForLocale,
  geoOpenClawSprintPath,
  isGeoOpenClawSprintCity,
} from "@/lib/geo-openclaw-city-sprint"
import { SUPPORTED_LOCALES, type Locale, getLocaleHrefLang } from "@/lib/i18n"
import { notFound } from "next/navigation"

export const revalidate = 300

type CitySlug = GeoOpenClawSprintCity
type PageSlug = GeoOpenClawSprintPageSlug

type CityCopy = {
  name: string
  region: string
  country: string
}

type LocaleCopy = {
  title: (city: CityCopy) => string
  subtitle: (city: CityCopy) => string
  metaTitle: (city: CityCopy) => string
  metaDescription: (city: CityCopy) => string
  heatmapTitle: (city: CityCopy) => string
  heatmapIntro: (city: CityCopy) => string
  ctaPrimary: string
  ctaSecondary: string
  shareTitle: (city: CityCopy) => string
}

const CITY_COPY: Record<CitySlug, { de: CityCopy; en: CityCopy }> = {
  berlin: {
    de: { name: "Berlin", region: "Berlin", country: "DE" },
    en: { name: "Berlin", region: "Berlin", country: "DE" },
  },
  munich: {
    de: { name: "München", region: "Bayern", country: "DE" },
    en: { name: "Munich", region: "Bavaria", country: "DE" },
  },
  hamburg: {
    de: { name: "Hamburg", region: "Hamburg", country: "DE" },
    en: { name: "Hamburg", region: "Hamburg", country: "DE" },
  },
  frankfurt: {
    de: { name: "Frankfurt am Main", region: "Hessen", country: "DE" },
    en: { name: "Frankfurt", region: "Hesse", country: "DE" },
  },
  cologne: {
    de: { name: "Köln", region: "Nordrhein-Westfalen", country: "DE" },
    en: { name: "Cologne", region: "North Rhine-Westphalia", country: "DE" },
  },
  warsaw: {
    de: { name: "Warschau", region: "Masowien", country: "PL" },
    en: { name: "Warsaw", region: "Masovia", country: "PL" },
  },
  krakow: {
    de: { name: "Krakau", region: "Kleinpolen", country: "PL" },
    en: { name: "Krakow", region: "Lesser Poland", country: "PL" },
  },
  wroclaw: {
    de: { name: "Breslau", region: "Niederschlesien", country: "PL" },
    en: { name: "Wroclaw", region: "Lower Silesia", country: "PL" },
  },
  budapest: {
    de: { name: "Budapest", region: "Budapest", country: "HU" },
    en: { name: "Budapest", region: "Budapest", country: "HU" },
  },
  bucharest: {
    de: { name: "Bukarest", region: "Bukarest", country: "RO" },
    en: { name: "Bucharest", region: "Bucharest", country: "RO" },
  },
  sofia: {
    de: { name: "Sofia", region: "Sofia", country: "BG" },
    en: { name: "Sofia", region: "Sofia", country: "BG" },
  },
  athens: {
    de: { name: "Athen", region: "Attika", country: "GR" },
    en: { name: "Athens", region: "Attica", country: "GR" },
  },
  thessaloniki: {
    de: { name: "Thessaloniki", region: "Zentralmakedonien", country: "GR" },
    en: { name: "Thessaloniki", region: "Central Macedonia", country: "GR" },
  },
  bratislava: {
    de: { name: "Bratislava", region: "Bratislava", country: "SK" },
    en: { name: "Bratislava", region: "Bratislava", country: "SK" },
  },
  zagreb: {
    de: { name: "Zagreb", region: "Zagreb", country: "HR" },
    en: { name: "Zagreb", region: "Zagreb", country: "HR" },
  },
  ljubljana: {
    de: { name: "Ljubljana", region: "Ljubljana", country: "SI" },
    en: { name: "Ljubljana", region: "Ljubljana", country: "SI" },
  },
  belgrade: {
    de: { name: "Belgrad", region: "Belgrad", country: "RS" },
    en: { name: "Belgrade", region: "Belgrade", country: "RS" },
  },
}

const DE_COPY: LocaleCopy = {
  title: (city) => `OpenClaw Risk 2026 – ${city.name}`,
  subtitle: (city) =>
    `Schnelle Risiko-Einordnung für OpenClaw/Moltbot-Stacks in ${city.name}. Kostenloser Security-Check + Runbooks für die nächsten Schritte.`,
  metaTitle: (city) => `OpenClaw Risk 2026 – ${city.name} | ClawGuru`,
  metaDescription: (city) =>
    `Wie exponiert ist dein OpenClaw/Moltbot-Stack in ${city.name}? 30-Sekunden-Security-Check, Heatmap-Einordnung und Fix-Pfade ohne Signup.`,
  heatmapTitle: (city) => `Geo-Heatmap für ${city.name}`,
  heatmapIntro: (city) =>
    `Aggregierte Signale aus Checks und Runbooks zeigen, wo OpenClaw/Moltbot-Stacks in ${city.name} typischerweise offen sind – von Gateway/Auth bis Netzwerk-Exposition.`,
  ctaPrimary: "Security-Check starten",
  ctaSecondary: "OpenClaw Landingpage öffnen",
  shareTitle: (city) => `Teile deine Stadt-Heatmap für ${city.name}`,
}

const EN_COPY: LocaleCopy = {
  title: (city) => `OpenClaw Exposure – ${city.name} 2026`,
  subtitle: (city) =>
    `Fast signal on OpenClaw/Moltbot risk posture in ${city.name}. Free security check plus runbooks for concrete next steps.`,
  metaTitle: (city) => `OpenClaw exposure – ${city.name} | ClawGuru`,
  metaDescription: (city) =>
    `How exposed is your OpenClaw/Moltbot stack in ${city.name}? 30-second security signal, city heatmap context, and fix paths – no signup.`,
  heatmapTitle: (city) => `City exposure heatmap for ${city.name}`,
  heatmapIntro: (city) =>
    `Aggregated signals from checks and runbooks highlight typical OpenClaw/Moltbot misconfigurations in ${city.name} – from gateways and auth to network exposure.`,
  ctaPrimary: "Start security check",
  ctaSecondary: "Open OpenClaw landing page",
  shareTitle: (city) => `Share your ${city.name} heatmap`,
}

function getCopy(locale: Locale, city: CitySlug): { localeCopy: LocaleCopy; cityCopy: CityCopy } {
  const base = locale === "de" ? DE_COPY : EN_COPY
  const cityRow = CITY_COPY[city][locale === "de" ? "de" : "en"]
  return { localeCopy: base, cityCopy: cityRow }
}

function normalizeParams(params: { lang: string; city: string; slug: string }): {
  locale: Locale
  city: CitySlug
  slug: PageSlug
} {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const cityNorm = params.city.toLowerCase()
  const slugNorm = params.slug.toLowerCase() as PageSlug
  if (!isGeoOpenClawSprintCity(cityNorm) || !(GEO_OPENCLAW_SPRINT_SLUGS as readonly string[]).includes(slugNorm)) {
    notFound()
  }
  const expected = geoOpenClawSprintPageSlugForLocale(locale)
  if (!expected || expected !== slugNorm) {
    notFound()
  }
  return { locale, city: cityNorm, slug: slugNorm }
}

export async function generateStaticParams() {
  const out: { lang: Locale; city: CitySlug; slug: PageSlug }[] = []
  const cities = [...GEO_OPENCLAW_SPRINT_CITIES]
  for (const city of cities) {
    out.push({ lang: "de", city, slug: "openclaw-risk-2026" })
    out.push({ lang: "en", city, slug: "openclaw-exposed" })
  }
  return out
}

export async function generateMetadata(props: { params: { lang: string; city: string; slug: string } }): Promise<Metadata> {
  const { locale, city } = normalizeParams(props.params)
  const { localeCopy, cityCopy } = getCopy(locale, city)
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const cityPath = geoOpenClawSprintPath(locale, city) ?? `/${locale}/${city}/openclaw-exposed`
  const canonical = `${base}${cityPath}`

  return {
    title: localeCopy.metaTitle(cityCopy),
    description: localeCopy.metaDescription(cityCopy),
    alternates: {
      canonical,
      languages: {
        [getLocaleHrefLang("de")]: `${base}/de/${city}/openclaw-risk-2026`,
        [getLocaleHrefLang("en")]: `${base}/en/${city}/openclaw-exposed`,
        "x-default": `${base}/en/${city}/openclaw-exposed`,
      },
    },
    openGraph: {
      title: localeCopy.metaTitle(cityCopy),
      description: localeCopy.metaDescription(cityCopy),
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: localeCopy.metaTitle(cityCopy),
      description: localeCopy.metaDescription(cityCopy),
    },
  }
}

export default function GeoOpenClawCityPage(props: { params: { lang: string; city: string; slug: string } }) {
  const { locale, city } = normalizeParams(props.params)
  const { localeCopy, cityCopy } = getCopy(locale, city)
  const prefix = `/${locale}`
  const coreLinks = getCoreSecurityLinks(locale)

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <Container>
        <div className="mx-auto max-w-4xl space-y-10">
          <header className="space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">
              {locale === "de" ? "Geo · OpenClaw Risk 2026" : "Geo · OpenClaw exposure 2026"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{localeCopy.title(cityCopy)}</h1>
            <p className="text-zinc-300 max-w-3xl mx-auto">{localeCopy.subtitle(cityCopy)}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={coreLinks.check}
                className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black hover:bg-cyan-400"
              >
                {localeCopy.ctaPrimary}
              </a>
              <a
                href={`${prefix}/openclaw`}
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-cyan-400/60"
              >
                {localeCopy.ctaSecondary}
              </a>
              <a
                href={`${prefix}/roast-my-moltbot`}
                className="rounded-xl border border-amber-400/40 px-5 py-3 text-sm font-semibold text-amber-100 hover:border-amber-300/70"
              >
                Roast My Moltbot
              </a>
            </div>
          </header>

          <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
              <h2 className="text-xl font-black text-white mb-3">{localeCopy.heatmapTitle(cityCopy)}</h2>
              <p className="text-sm text-zinc-300 mb-4">{localeCopy.heatmapIntro(cityCopy)}</p>
              <div
                className="relative h-56 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-cyan-900 via-black to-amber-900"
                aria-label={locale === "de" ? "Stadt-Heatmap (schematisch)" : "City heatmap (schematic)"}
              >
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.6),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(250,204,21,0.6),transparent_55%)]" />
                <div className="relative z-10 flex flex-col justify-between h-full p-4">
                  <div className="text-xs text-zinc-300 font-mono">
                    {cityCopy.name} · {cityCopy.region} · {cityCopy.country}
                  </div>
                  <div className="space-y-2 text-xs text-zinc-200">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-6 rounded-full bg-red-500" />
                      <span>{locale === "de" ? "Exponierte Gateways & schwache Auth" : "Exposed gateways & weak auth"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-6 rounded-full bg-amber-400" />
                      <span>
                        {locale === "de"
                          ? "Offene Ports & zu breite Firewall-Regeln"
                          : "Open ports & overly broad firewall rules"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-2 w-6 rounded-full bg-cyan-400" />
                      <span>
                        {locale === "de"
                          ? "Logging/Monitoring ohne klare Alerts"
                          : "Logging/monitoring without clear alerts"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <h3 className="text-sm font-semibold text-white mb-2">
                  {locale === "de" ? "Nächste Schritte" : "Next steps"}
                </h3>
                <ol className="list-decimal pl-4 text-sm text-zinc-300 space-y-1">
                  <li>{locale === "de" ? "Security-Check mit deinem realen Stack starten." : "Start the security check with your real stack."}</li>
                  <li>
                    {locale === "de"
                      ? "Die Runbooks für Gateway/Auth & Netzwerk-Härtung öffnen."
                      : "Open runbooks for gateway/auth and network hardening."}
                  </li>
                  <li>
                    {locale === "de"
                      ? "Fixes umsetzen und Check erneut laufen lassen."
                      : "Apply fixes and rerun the check to verify."}
                  </li>
                </ol>
              </div>
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5">
                <h3 className="text-sm font-semibold text-cyan-300 mb-1">{localeCopy.shareTitle(cityCopy)}</h3>
                <p className="text-xs text-zinc-300">
                  {locale === "de"
                    ? "Nutze den Free-Check, um eine anonyme Heatmap für deinen Stack zu erzeugen, und teile den Link in der OpenClaw-Community."
                    : "Use the free check to generate an anonymous heatmap for your stack and share the link with the OpenClaw community."}
                </p>
              </div>
            </aside>
          </section>

          <nav className="text-xs text-zinc-400 flex flex-wrap gap-4">
            <a href={coreLinks.methodology} className="hover:text-cyan-300">
              {locale === "de" ? "Methodik & Grenzen" : "Methodology & limits"}
            </a>
            <a href={coreLinks.runbooksSecurity} className="hover:text-cyan-300">
              {locale === "de" ? "Security-Runbooks" : "Security runbooks"}
            </a>
            <a href={`${prefix}/openclaw-security-check`} className="hover:text-cyan-300">
              {locale === "de" ? "OpenClaw Security Check" : "OpenClaw security check"}
            </a>
            <a href={`${prefix}/moltbot-hardening`} className="hover:text-cyan-300">
              {locale === "de" ? "Moltbot Hardening" : "Moltbot hardening"}
            </a>
            <a href={`${prefix}/roast-my-moltbot`} className="hover:text-cyan-300">
              Roast My Moltbot
            </a>
            <a href={`${prefix}/openclaw`} className="hover:text-cyan-300">
              OpenClaw
            </a>
          </nav>
        </div>
      </Container>
    </main>
  )
}

