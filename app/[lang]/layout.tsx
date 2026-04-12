import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { normalizeLocale, buildLocalizedAlternates, SUPPORTED_LOCALES, localeDir } from "@/lib/i18n"

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = normalizeLocale(props.params.lang)
  return {
    alternates: buildLocalizedAlternates(locale, "/"),
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

  return (
    <div dir={localeDir(locale)} data-locale={locale}>
      {props.children}
    </div>
  )
}
