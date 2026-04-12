import PricingPage from "@/app/pricing/page"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  return {
    alternates: buildLocalizedAlternates(locale, "/pricing"),
  }
}

export default function LocalePricingPage() {
  return <PricingPage />
}
