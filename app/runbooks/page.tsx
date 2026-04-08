import RunbooksPageContent from "@/components/pages/RunbooksPageContent"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

export const dynamic = "force-static"
export const revalidate = 3600
export const runtime = "nodejs"
export const maxDuration = 180

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  keywords: SEO_TARGET_KEYWORDS_2026,
  alternates: { 
    canonical: "/runbooks",
    languages: {
      de: "https://clawguru.org/de/runbooks",
      en: "https://clawguru.org/en/runbooks",
      es: "https://clawguru.org/es/runbooks",
      fr: "https://clawguru.org/fr/runbooks",
      pt: "https://clawguru.org/pt/runbooks",
      it: "https://clawguru.org/it/runbooks",
      ru: "https://clawguru.org/ru/runbooks",
      zh: "https://clawguru.org/zh/runbooks",
      ja: "https://clawguru.org/ja/runbooks",
      ko: "https://clawguru.org/ko/runbooks",
      ar: "https://clawguru.org/ar/runbooks",
      hi: "https://clawguru.org/hi/runbooks",
      tr: "https://clawguru.org/tr/runbooks",
      pl: "https://clawguru.org/pl/runbooks",
      nl: "https://clawguru.org/nl/runbooks"
    }
  }
}

export default async function RunbooksPage() {
  const locale = DEFAULT_LOCALE as Locale
  const dict = await getDictionary(locale)
  return <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
}
