import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { normalizeLocale, localeAlternates, SUPPORTED_LOCALES, getLocaleHrefLang } from "@/lib/i18n"

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = normalizeLocale(props.params.lang)
  const alternates = localeAlternates("/")
  const localeHrefLang = getLocaleHrefLang(locale)
  const canonical = alternates.languages[localeHrefLang] ?? alternates.canonical

  return {
    alternates: {
      canonical,
      languages: alternates.languages,
    },
  }
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const locale = normalizeLocale(props.params.lang)
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound()
  }

  return props.children
}
