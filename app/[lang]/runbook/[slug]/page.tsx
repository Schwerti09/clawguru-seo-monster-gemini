import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound, permanentRedirect } from "next/navigation"

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
  const { lang, slug } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/runbook/${slug}` },
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
    return <RootRunbookPage params={{ slug }} />
  } catch (err) {
    console.error(`[sitemap-health] locale runbook generation failed for lang=${lang}, slug=${slug}:`, err instanceof Error ? err.message : String(err))
    permanentRedirect(`/${lang}/runbooks?q=${encodeURIComponent(slug)}`)
  }
}

