import type { Metadata } from "next"
import PricingPage from "@/app/pricing/page"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { metadata as rootMetadata } from "@/app/pricing/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    ...(rootMetadata as Metadata),
    alternates: buildLocalizedAlternates(locale, "/pricing"),
    openGraph: {
      ...(rootMetadata as Metadata).openGraph,
      url: `https://clawguru.org/${locale}/pricing`,
    },
  }
}

export default function LocalePricingPage() {
  return <PricingPage />
}
