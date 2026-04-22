import type { Metadata } from "next"
import PricingPage from "@/app/pricing/page"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(
  { params }: { params: { lang: string } }
): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const title = `${dict.pricing.title} | ClawGuru`
  const description = dict.pricing.subtitle
  const url = `https://clawguru.org/${locale}/pricing`
  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/pricing"),
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  }
}

export default function LocalePricingPage() {
  return <PricingPage />
}
