import type { Metadata } from "next"
import AffiliateLeaderboard from "@/components/affiliates/AffiliateLeaderboard"
import { type Locale, SUPPORTED_LOCALES, LOCALE_HREFLANG, t } from "@/lib/i18n"

export const runtime = "edge"
export const revalidate = 60 * 60

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const locale: Locale = SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : "de"
  return {
    title: `${t(locale, "affiliateTitle")} | ClawGuru`,
    description: t(locale, "affiliateSubtitle"),
    alternates: {
      canonical: `/${locale}/affiliates/top`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [LOCALE_HREFLANG[l], `/${l}/affiliates/top`])
      ),
    },
  }
}

export default function AffiliateTopLocalizedPage({
  params,
}: {
  params: { lang: string }
}) {
  const locale: Locale = SUPPORTED_LOCALES.includes(params.lang as Locale)
    ? (params.lang as Locale)
    : "de"
  return <AffiliateLeaderboard locale={locale} />
}
