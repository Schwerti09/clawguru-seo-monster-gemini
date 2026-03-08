// Locale home pages: /en, /es, /fr, /pt, /it, /ru, /zh, /ja, /ar
// Renders the same main page with locale-aware dictionary so content is translated.

// Relative Imports – jetzt korrekt für app/[lang]/page.tsx
import { SUPPORTED_LOCALES, type Locale } from "../../lib/i18n"
import { getDictionary } from "../../lib/getDictionary"
import Home from "../page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}` },
  }
}

export default async function LocaleHomePage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const dict = await getDictionary(locale)

  return <Home dict={dict} />
}