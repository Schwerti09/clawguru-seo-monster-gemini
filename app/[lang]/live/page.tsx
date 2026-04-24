import type { Metadata } from "next"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import LiveRootPage from "@/app/live/page"
import { BASE_URL } from "@/lib/config"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  const imageObjectJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `${BASE_URL}/og/live.png`,
    description: "ClawGuru Live Ops Cockpit - 4.2M+ Runbooks, Top 100 Hot Threats, 24/7 Live",
    author: {
      "@type": "Organization",
      name: "ClawGuru",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    width: 1200,
    height: 630,
  }

  return {
    title: "Live Ops Cockpit — Echtzeit-Überwachung | ClawGuru",
    description: "Echtzeit-Überwachung deiner Systeme und Bedrohungslandschaft. 4.2M+ Runbooks generierbar, Top 100 hot + trending threats, Live Pulse.",
    openGraph: {
      title: "Live Ops Cockpit — Echtzeit-Überwachung | ClawGuru",
      description: "Echtzeit-Überwachung deiner Systeme und Bedrohungslandschaft. 4.2M+ Runbooks generierbar, Top 100 hot + trending threats.",
      type: "website",
      url: `${BASE_URL}/${locale}/live`,
      images: [{
        url: `${BASE_URL}/og/live.png`,
        width: 1200,
        height: 630,
        alt: "ClawGuru Live Ops Cockpit - 4.2M+ Runbooks, Top 100 Hot Threats, 24/7 Live"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title: "Live Ops Cockpit — Echtzeit-Überwachung | ClawGuru",
      description: "Echtzeit-Überwachung deiner Systeme und Bedrohungslandschaft. 4.2M+ Runbooks generierbar, Top 100 hot + trending threats.",
      images: [`${BASE_URL}/og/live.png`]
    },
    alternates: buildLocalizedAlternates(locale, "/live"),
    other: {
      "application/ld+json": JSON.stringify(imageObjectJsonLd),
    },
  }
}

export default function LocaleLivePage() {
  return <LiveRootPage />
}
