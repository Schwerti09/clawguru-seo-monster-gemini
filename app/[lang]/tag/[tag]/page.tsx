// Localized tag pages: /de/tag/[tag], /en/tag/[tag], etc.
// Delegates to the base tag page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { notFound } from "next/navigation"
import TagPage from "@/app/tag/[tag]/page"

export const revalidate = 3600
export const dynamicParams = true
export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const { allTags } = await import("@/lib/pseo")
  const tags = allTags().slice(0, 200)
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  return allowed.flatMap((lang) => tags.map((tag) => ({ lang, tag })))
}

export async function generateMetadata(props: {
  params: { lang: string; tag: string }
}) {
  const { tag, lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `${decodedTag} Runbooks | ClawGuru Tag-Hub`,
    alternates: { canonical: `/${locale}/tag/${encodeURIComponent(decodedTag)}` },
  }
}

export default async function LocaleTagPage(props: {
  params: { lang: string; tag: string }
}) {
  const { lang, tag } = props.params
  const allowed = (process.env.SITEMAP_100K_LOCALES ?? "de,en").split(",").map((s) => s.trim()).filter(Boolean)
  if (!allowed.includes(lang)) return notFound()
  return <TagPage params={{ tag }} />
}
