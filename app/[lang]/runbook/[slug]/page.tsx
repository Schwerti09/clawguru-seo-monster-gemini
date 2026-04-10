import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import { parseGeoVariantSlug } from "@/lib/geo-matrix"
import { getCityBySlug } from "@/lib/geo-cities"
import { isGeoVariantIndexable } from "@/lib/geo-mycelium"

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
  const { getRunbook } = await import("@/lib/pseo")
  const geoParsed = parseGeoVariantSlug(slug)
  const geoCity = geoParsed.citySlug ? await getCityBySlug(geoParsed.citySlug) : null
  const runbook = getRunbook(slug) ?? getRunbook(geoParsed.baseSlug)
  const canonicalSlug = runbook ? (geoCity ? `${runbook.slug}-${geoCity.slug}` : runbook.slug) : slug
  const isIndexableGeoVariant = geoCity
    ? await isGeoVariantIndexable({
        locale: lang,
        variantSlug: canonicalSlug,
        rolloutStage: geoCity.rollout_stage,
      })
    : true
  const citySuffix = geoCity ? ` (${geoCity.name_en})` : ""
  const title = runbook?.title ? `${runbook.title}${citySuffix} | ClawGuru Runbook` : undefined
  const baseDescription = runbook?.summary ?? ""
  const geoDescription = geoCity ? `${baseDescription} Lokalisiert fuer ${geoCity.name_en}, ${geoCity.country_code}.` : baseDescription
  const description = geoDescription
    ? geoDescription.length > 160
      ? geoDescription.slice(0, 157) + "..."
      : geoDescription
    : undefined
  const alternates = localeAlternates(`/runbook/${canonicalSlug}`)

  return {
    title,
    description,
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/${lang}/runbook/${canonicalSlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: isIndexableGeoVariant,
      follow: true,
      // Keep canary geo variants crawlable for discovery but out of index until stable.
      nocache: false,
    },
  }
}

export default async function LocaleRunbookPage(props: {
  params: { lang: string; slug: string }
}) {
  const { lang, slug } = props.params
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  if (!allowed.includes(lang)) {
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
  const Mod = await import("@/app/runbook/[slug]/page")
  const RootRunbookPage = Mod.default
  return <RootRunbookPage params={{ lang, slug: resolvedSlug }} />
}

