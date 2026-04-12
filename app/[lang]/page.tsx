// Locale home pages: /en, /es, /fr, /pt, /it, /ru, /zh, /ja, /ar
// Renders the same main page with locale-aware dictionary so content is translated.

import { SUPPORTED_LOCALES, buildLocalizedAlternates, normalizeLocale } from "@/lib/i18n"

import { getDictionary } from "@/lib/getDictionary"
import Home from "@/app/page"

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)
  const pageUrl = `${SITE_URL}/${locale}`

  return {
    alternates: buildLocalizedAlternates(locale, "/"),
    openGraph: {
      type: "website" as const,
      url: pageUrl,
      locale: locale === "zh" ? "zh_CN" : locale === "hi" ? "hi_IN" : locale === "ar" ? "ar_SA" : `${locale}_${locale.toUpperCase()}`,
    },
  }
}

export default async function LocaleHomePage(props: { params: { lang: string } }) {
  const locale = normalizeLocale(props.params.lang)

  const dict = await getDictionary(locale)

  return <Home dict={dict} locale={locale} />
}