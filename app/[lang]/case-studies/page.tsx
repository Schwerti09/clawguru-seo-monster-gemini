import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { BASE_URL } from "@/lib/config"
import RootPage from "@/app/case-studies/page"

export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const pageUrl = `${BASE_URL}/${locale}/case-studies`
  const title = "Case Studies 2026 | Security Incidents, NIS2, KI-Angriffe | ClawGuru"
  const description =
    "18+ anonymisierte Security Case Studies (April 2026): KI-Agenten-Angriffe, NIS2-Compliance-Sprint, Supply-Chain-Kompromittierung, Cloud-Kosten-Explosion durch AI-Workloads. Echte Schritte, messbare Ergebnisse."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      images: ["/og-image.png"],
    },
    alternates: buildLocalizedAlternates(locale, "/case-studies"),
    robots: "index, follow",
  }
}

export default function LocaleCaseStudiesPage() {
  return <RootPage />
}
