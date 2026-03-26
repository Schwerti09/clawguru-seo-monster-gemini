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
  alternates: { canonical: "/runbooks" }
}

export default async function RunbooksPage() {
  const locale = DEFAULT_LOCALE as Locale
  const dict = await getDictionary(locale)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist die ClawGuru Runbook Library?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eine kuratierte, evolvierende Wissensbasis mit ausführbaren Security- und Ops-Runbooks. Antwort‑first strukturiert, mit HowTo/FAQ Markup.",
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Antwort‑First: Von Score zum exakten Runbook</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">ClawGuru liefert priorisierte, zitierfähige Schritte – mit Proof, Befehlen und Verifikation. Ideal für Audits und schnelle Fixes.</p>
      </section>
      <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
    </>
  )
}
