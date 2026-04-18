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
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const title =
    locale === "de"
      ? "Security-Check in 30 Sekunden | Kostenloser Claw Score"
      : "30-Second Security Check | Free Claw Score"
  const description =
    locale === "de"
      ? "IP, Domain oder URL pruefen: Claw Score, konkrete Risiken und naechste Hardening-Schritte in unter 30 Sekunden."
      : "Check an IP, domain, or URL: get your Claw Score, concrete risks, and next hardening steps in under 30 seconds."

  // GEO-DOMINATION: HowTo Schema for AI Engines
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: [
      {
        "@type": "HowToStep",
        name: locale === "de" ? "IP, Domain oder URL eingeben" : "Enter IP, domain, or URL",
        text: locale === "de" ? "Gib die zu prüfende IP, Domain oder URL in das Eingabefeld ein." : "Enter the IP, domain, or URL you want to check in the input field."
      },
      {
        "@type": "HowToStep",
        name: locale === "de" ? "Security-Check starten" : "Start Security Check",
        text: locale === "de" ? "Klicke auf 'Prüfen' um den Security-Check zu starten." : "Click 'Check' to start the security scan."
      },
      {
        "@type": "HowToStep",
        name: locale === "de" ? "Claw Score und Risiken anzeigen" : "View Claw Score and Risks",
        text: locale === "de" ? "Erhalte deinen Claw Score, konkrete Risiken und Hardening-Schritte." : "Get your Claw Score, concrete risks, and hardening steps."
      }
    ]
  }

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/check"),
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/check`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "application/ld+json": JSON.stringify(howToSchema)
    }
  }
}

export default function LocaleCheckPage() {
  return <RootPage />
}
