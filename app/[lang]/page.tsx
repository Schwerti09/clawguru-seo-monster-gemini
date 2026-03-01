// Locale home pages: /en, /es, /fr, /pt, /it, /ru, /zh, /ja, /ar
// Renders the same main page so locale home-page navigation doesn't 404.

import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n"
import Home from "@/app/page"

export const revalidate = 60 * 60 * 24

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    alternates: { canonical: `/${locale}` },
  }
}

export default function LocaleHomePage() {
  return <Home />
}
