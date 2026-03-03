// Localized tag pages: /de/tag/[tag], /en/tag/[tag], etc.
// Delegates to the base tag page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { allTags } from "@/lib/pseo"
import TagPage from "@/app/tag/[tag]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const tags = allTags().slice(0, 200)
  return SUPPORTED_LOCALES.flatMap((lang) =>
    tags.map((tag) => ({ lang, tag }))
  )
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; tag: string }>
}) {
  const { tag, lang } = await props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `${decodedTag} Runbooks | ClawGuru Tag-Hub`,
    alternates: { canonical: `/${locale}/tag/${encodeURIComponent(decodedTag)}` },
  }
}

export default async function LocaleTagPage(props: {
  params: Promise<{ lang: string; tag: string }>
}) {
  const { tag } = await props.params
  return <TagPage params={Promise.resolve({ tag })} />
}
