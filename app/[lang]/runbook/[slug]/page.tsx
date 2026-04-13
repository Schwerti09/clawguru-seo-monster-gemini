import type { Metadata } from "next"

import { buildLocalizedAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { parseGeoVariantSlug } from "@/lib/geo-matrix"
import { getCityBySlug } from "@/lib/geo-cities"
import { isGeoVariantIndexable } from "@/lib/geo-mycelium"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"
export const revalidate = 86400
export const dynamicParams = true // SEO: return 404 for unknown slugs (no redirect spam)
export const runtime = "nodejs"
export const maxDuration = 180
export const preferredRegion = "iad1"

export async function generateStaticParams() {
  const { materializedRunbooks } = await import("@/lib/pseo")
  const topSlugs = materializedRunbooks().map((r) => r.slug)
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de").split(",").map((s) => s.trim()).filter(Boolean)
  return allowed.flatMap((lang) => topSlugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata(props: {
  params: { lang: string; slug: string }
}): Promise<Metadata> {
  const { slug, lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const { getRunbook } = await import("@/lib/pseo")
  const geoParsed = parseGeoVariantSlug(slug)
  const geoCity = geoParsed.citySlug ? await getCityBySlug(geoParsed.citySlug) : null
  const runbook = getRunbook(slug) ?? getRunbook(geoParsed.baseSlug)
  // Use the actual slug (with or without geo variant) for canonical - don't redirect base to geo
  const canonicalSlug = runbook ? slug : slug
  const citySuffix = geoCity ? ` (${geoCity.name_en})` : ""
  const title = runbook?.title ? `${runbook.title}${citySuffix} | ClawGuru Runbook` : undefined
  const baseDescription = runbook?.summary ?? ""
  const geoDescription = geoCity ? `${baseDescription} Lokalisiert fuer ${geoCity.name_en}, ${geoCity.country_code}.` : baseDescription
  const description = geoDescription
    ? geoDescription.length > 160
      ? geoDescription.slice(0, 157) + "..."
      : geoDescription
    : undefined

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, `/runbook/${canonicalSlug}`),
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      type: "article",
      url: `${BASE_URL}/${lang}/runbook/${canonicalSlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function LocaleRunbookPage(props: {
  params: { lang: string; slug: string }
}) {
  const { lang, slug } = props.params
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) {
    notFound()
  }
  
  // SEO Fix: Return 404 for non-existent runbooks instead of redirecting to /runbooks
  // (redirects caused Google to see duplicate content on the listing page)
  const { getRunbook } = await import("@/lib/pseo")
  const { parseGeoVariantSlug } = await import("@/lib/geo-matrix")
  const geoParsed = parseGeoVariantSlug(slug)
  const resolvedSlug = getRunbook(slug) ? slug : (getRunbook(geoParsed.baseSlug) ? geoParsed.baseSlug : null)
  if (!resolvedSlug) {
    notFound()
  }
  // Geo-variant: check indexability; if not promoted yet, return 404 instead of noindex page
  if (geoParsed.citySlug) {
    const { getCityBySlug: getCity } = await import("@/lib/geo-cities")
    const { isGeoVariantIndexable: isIndexable } = await import("@/lib/geo-mycelium")
    const city = await getCity(geoParsed.citySlug)
    if (city) {
      const indexable = await isIndexable({ locale: lang, variantSlug: slug, rolloutStage: city.rollout_stage })
      if (!indexable) notFound()
    }
  }
  const Mod = await import("@/app/runbook/[slug]/page")
  const RootRunbookPage = Mod.default
  return <RootRunbookPage params={{ lang, slug: resolvedSlug }} />
}

