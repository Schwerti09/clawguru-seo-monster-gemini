// Localized solutions index: /de/solutions, /en/solutions, etc.
// Delegates to the base solutions page so all locales resolve without 404.

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import SolutionsPage from "@/app/solutions/page"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: {
  params: { lang: string }
}) {
  const { lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

  // GEO-DOMINATION: FAQPage Schema for AI Engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "de" ? "Was sind ClawGuru CVE Solutions?" : "What are ClawGuru CVE Solutions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "ClawGuru CVE Solutions sind schrittweise Anleitungen zur Behebung bekannter CVEs (Common Vulnerabilities and Exposures) in Self-Hosted und Cloud-Infrastruktur."
            : "ClawGuru CVE Solutions are step-by-step guides to fix known CVEs (Common Vulnerabilities and Exposures) in self-hosted and cloud infrastructure."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Wie finde ich die richtige CVE Solution?" : "How do I find the right CVE Solution?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Suche nach CVE-ID (z.B. CVE-2024-12345), Komponentenname (z.B. 'nginx') oder Schweregrad (Critical, High)."
            : "Search by CVE ID (e.g., CVE-2024-12345), component name (e.g., 'nginx'), or severity (Critical, High)."
        }
      }
    ]
  }

  // GEO-DOMINATION: BreadcrumbList Schema for AI Engines
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "de" ? "Home" : "Home",
        item: `${SITE_URL}/${locale}`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "de" ? "Solutions" : "Solutions",
        item: `${SITE_URL}/${locale}/solutions`
      }
    ]
  }

  return {
    title: "CVE Fix Solutions | ClawGuru",
    alternates: buildLocalizedAlternates(locale, "/solutions"),
    other: {
      "application/ld+json": JSON.stringify([faqSchema, breadcrumbSchema])
    }
  }
}

export default function LocaleSolutionsPage() {
  return <SolutionsPage />
}
