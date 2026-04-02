import type { Metadata } from "next"

import { localeAlternates, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { permanentRedirect } from "next/navigation"
import { parseGeoVariantSlug } from "@/lib/geo-matrix"
import { getCityBySlug } from "@/lib/geo-cities"

export const dynamic = "force-static"
export const revalidate = 86400
export const dynamicParams = true // Recovery mode: stale indexed URLs should redirect, not 404
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
      index: true,
      follow: true,
      // If content is too short, Google may still choose not to index
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
    permanentRedirect(`/${SUPPORTED_LOCALES[0]}/runbooks?q=${encodeURIComponent(slug)}`)
  }
  
  // PHASE 1 Fix #1: Graceful error handling for broken runbook generation
  try {
    const { getRunbook } = await import("@/lib/pseo")
    if (!getRunbook(slug)) {
      permanentRedirect(`/${lang}/runbooks?q=${encodeURIComponent(slug)}`)
    }
    const Mod = await import("@/app/runbook/[slug]/page")
    const RootRunbookPage = Mod.default
    return <RootRunbookPage params={{ lang, slug }} />
  } catch (err) {
    const anyErr = err as any
    const message = err instanceof Error ? err.message : String(err)
    const digest = typeof anyErr?.digest === "string" ? anyErr.digest : ""
    // Next.js throws NEXT_REDIRECT as control flow signal; this is expected.
    if (message === "NEXT_REDIRECT" || digest.includes("NEXT_REDIRECT") || String(err).includes("NEXT_REDIRECT")) {
      throw err
    }
    // Keep logs clean: stale/synthetic slugs should silently redirect to search hub.
    permanentRedirect(`/${lang}/runbooks?q=${encodeURIComponent(slug)}`)
  }
}

