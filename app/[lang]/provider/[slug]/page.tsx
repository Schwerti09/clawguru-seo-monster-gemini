// Localized provider pages: /de/provider/[slug], /en/provider/[slug], etc.
// Delegates to the base provider page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import { allProviders } from "@/lib/pseo"
import ProviderPage from "@/app/provider/[slug]/page"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((lang) =>
    allProviders().map((p) => ({ lang, slug: p.slug }))
  )
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug, lang } = await props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const p = allProviders().find((x) => x.slug === slug.toLowerCase())
  if (!p) return {}
  return {
    title: `${p.name} Runbooks | ClawGuru`,
    alternates: { canonical: `/${locale}/provider/${p.slug}` },
  }
}

export default async function LocaleProviderPage(props: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { slug } = await props.params
  return <ProviderPage params={Promise.resolve({ slug })} />
}
