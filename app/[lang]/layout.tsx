import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { normalizeLocale, localeAlternates, SUPPORTED_LOCALES, getLocaleHrefLang, localeDir } from "@/lib/i18n"

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params
  const locale = normalizeLocale(lang)
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
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const locale = normalizeLocale(lang)
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound()
  }

  return (
    <div dir={localeDir(locale)} data-locale={locale}>
      {props.children}
    </div>
  )
}
