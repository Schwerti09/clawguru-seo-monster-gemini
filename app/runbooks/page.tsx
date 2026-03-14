import RunbooksPageContent from "@/components/pages/RunbooksPageContent"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Runbooks | ClawGuru",
  description:
    "Runbooks für OpenClaw/Moltbot Ops: Security, Setup, Fixes, Incident Response. Score → Runbook → Fix → Re-Check.",
  keywords: SEO_TARGET_KEYWORDS_2026,
  alternates: { canonical: "/runbooks" }
}

export default async function RunbooksPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  return <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
}
