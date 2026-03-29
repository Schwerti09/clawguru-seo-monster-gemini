import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"

export const dynamic = "force-static"
export const revalidate = 86400
export const dynamicParams = false // CRITICAL: Prevent 50k+ placeholder pages from being indexed
export const runtime = "nodejs"
export const maxDuration = 180
export const preferredRegion = "iad1"

export async function generateStaticParams() {
  const { RUNBOOKS } = await import("@/lib/pseo")
  // REDUCED: From 200 to only 25 TOP runbooks to prevent duplicate content penalty
  // These are the highest quality, most trafficked runbooks only
  const topSlugs = RUNBOOKS.slice(0, 25).map((r) => r.slug)
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
    // Prevent thin content from being indexed - only quality runbooks should rank
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
  if (!allowed.includes(lang)) return notFound()
  
  // PHASE 1 Fix #1: Graceful error handling for broken runbook generation
  try {
    const Mod = await import("@/app/runbook/[slug]/page")
    const RootRunbookPage = Mod.default
    return <RootRunbookPage params={{ slug }} />
  } catch (err) {
    console.error(`[sitemap-health] locale runbook generation failed for lang=${lang}, slug=${slug}:`, err instanceof Error ? err.message : String(err))
    return notFound()
  }
}

