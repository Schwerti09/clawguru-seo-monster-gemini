import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RootPage from "@/app/ueber-uns/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const title = locale === "de" ? "Über uns — ClawGuru Team aus Security Spezialisten" : "About Us — ClawGuru Team of Security Specialists"
  const description = locale === "de"
    ? "Ein interdisziplinäres Team aus Security Engineers, DevOps Experten und Threat Researchers mit 15+ Jahren Erfahrung. 10+ Spezialisten, 4,200+ AI Runbooks, 24/7 Incident Response."
    : "An interdisciplinary team of Security Engineers, DevOps Experts and Threat Researchers with 15+ years of experience. 10+ specialists, 4,200+ AI runbooks, 24/7 incident response."

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/ueber-uns"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
      alternateLocale: SUPPORTED_LOCALES.map((l) => (l === "de" ? "de_DE" : "en_US")),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function LocaleUeberUnsPage() {
  return <RootPage />
}
