import type { Locale } from "@/lib/i18n"

/** First-wave DE+EN geo LPs (OpenClaw / Moltbot risk context). */
export const GEO_OPENCLAW_SPRINT_CITIES = ["berlin", "munich", "hamburg", "frankfurt", "cologne"] as const
export type GeoOpenClawSprintCity = (typeof GEO_OPENCLAW_SPRINT_CITIES)[number]

export const GEO_OPENCLAW_SPRINT_SLUGS = ["openclaw-risk-2026", "openclaw-exposed"] as const
export type GeoOpenClawSprintPageSlug = (typeof GEO_OPENCLAW_SPRINT_SLUGS)[number]

export function isGeoOpenClawSprintCity(value: string): value is GeoOpenClawSprintCity {
  return (GEO_OPENCLAW_SPRINT_CITIES as readonly string[]).includes(value)
}

export function geoOpenClawSprintPageSlugForLocale(locale: Locale): GeoOpenClawSprintPageSlug | null {
  if (locale === "de") return "openclaw-risk-2026"
  if (locale === "en") return "openclaw-exposed"
  return null
}

/** Localized path under `/[lang]`; only `de` and `en` have static geo variants. */
export function geoOpenClawSprintPath(locale: Locale, city: GeoOpenClawSprintCity): string | null {
  const slug = geoOpenClawSprintPageSlugForLocale(locale)
  if (!slug) return null
  return `/${locale}/${city}/${slug}`
}

export const GEO_OPENCLAW_SPRINT_CITY_LABELS: Record<GeoOpenClawSprintCity, { de: string; en: string }> = {
  berlin: { de: "Berlin", en: "Berlin" },
  munich: { de: "München", en: "Munich" },
  hamburg: { de: "Hamburg", en: "Hamburg" },
  frankfurt: { de: "Frankfurt am Main", en: "Frankfurt" },
  cologne: { de: "Köln", en: "Cologne" },
}

/** Crawlable hub links for static geo LPs (`/[lang]/[city]/…`); empty outside `de`/`en`. */
export function geoOpenClawSprintNavLinks(locale: Locale): { href: string; label: string }[] {
  if (locale !== "de" && locale !== "en") return []
  const lang = locale === "de" ? "de" : "en"
  return GEO_OPENCLAW_SPRINT_CITIES.map((city) => {
    const href = geoOpenClawSprintPath(locale, city)
    if (!href) return null
    return { href, label: GEO_OPENCLAW_SPRINT_CITY_LABELS[city][lang] }
  }).filter((row): row is { href: string; label: string } => row !== null)
}
