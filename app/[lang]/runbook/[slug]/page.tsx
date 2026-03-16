import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import RootRunbookPage from "@/app/runbook/[slug]/page"

export const dynamic = "force-dynamic"
export const revalidate = 3600
export const dynamicParams = true
export const runtime = "nodejs"
export const maxDuration = 180

export async function generateStaticParams() {
  const { RUNBOOKS } = await import("@/lib/pseo")
  const topSlugs = RUNBOOKS.slice(0, 200).map((r) => r.slug)
  return SUPPORTED_LOCALES.flatMap((lang) => topSlugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata(props: {
  params: { lang: string; slug: string }
}): Promise<Metadata> {
  const { lang, slug } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/runbook/${slug}` },
  }
}

export default function LocaleRunbookPage(props: {
  params: { lang: string; slug: string }
}) {
  return <RootRunbookPage params={{ slug: props.params.slug }} />
}

