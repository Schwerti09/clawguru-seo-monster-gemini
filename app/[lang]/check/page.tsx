import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RootPage from "@/app/check/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const title =
    locale === "de"
      ? "Security-Check in 30 Sekunden | Kostenloser Claw Score"
      : "30-Second Security Check | Free Claw Score"
  const description =
    locale === "de"
      ? "IP, Domain oder URL pruefen: Claw Score, konkrete Risiken und naechste Hardening-Schritte in unter 30 Sekunden."
      : "Check an IP, domain, or URL: get your Claw Score, concrete risks, and next hardening steps in under 30 seconds."

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/check"),
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${locale}/check`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function LocaleCheckPage() {
  return <RootPage />
}
