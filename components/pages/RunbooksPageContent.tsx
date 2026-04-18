// Shared runbooks listing content component.
// Used by both /runbooks (default locale) and /[lang]/runbooks (localized).

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"
import type { Locale } from "@/lib/i18n"
import dynamic from "next/dynamic"
const RunbookNexus = dynamic(() => import("@/components/pages/RunbookNexus"), {
  loading: () => (
    <div style={{ minHeight: "80vh", contentVisibility: "auto", containIntrinsicSize: "auto 1200px" }} />
  ),
})

// Data is now loaded clientseitig in RunbooksClientLoader (ähnlich wie MyceliumClientLoader)

export default async function RunbooksPageContent({
  locale,
  subtitle,
}: {
  locale: Locale
  subtitle: string
}) {
  // Load actual runbooks data for structured data
  const { loadRunbooks } = await import("@/lib/runbooks-data")
  const runbooks = await loadRunbooks()
  const top20 = runbooks.slice(0, 20)
  
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Runbook Library",
    description: "Security- und Ops-Runbooks für DevOps-Teams: SSH-Hardening, Firewall, Incident Response und mehr.",
    numberOfItems: top20.length,
    itemListElement: top20.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
      name: r.title,
    })),
  }

  // GEO-DOMINATION ROUND 3: FAQPage Schema for AI Engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "de" ? "Was sind Security Runbooks?" : "What are security runbooks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Security Runbooks sind ausführbare Playbooks für DevOps-Teams, die Security-Hardening, Incident Response und Ops-Automatisierung standardisieren. ClawGuru bietet 600+ AI-generierte Runbooks für OpenClaw/Moltbot."
            : "Security runbooks are executable playbooks for DevOps teams that standardize security hardening, incident response, and ops automation. ClawGuru offers 600+ AI-generated runbooks for OpenClaw/Moltbot."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Sind die Runbooks kostenlos?" : "Are the runbooks free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Ja, alle Security Runbooks auf ClawGuru sind 100% kostenlos und erfordern keine Anmeldung."
            : "Yes, all security runbooks on ClawGuru are 100% free and require no signup."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Wie funktionieren die Runbooks?" : "How do the runbooks work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de"
            ? "Jeder Runbook folgt dem Score → Runbook → Fix → Re-Check Workflow. Starte mit einem Security-Check, erhalte deinen Claw Score, wähle den passenden Runbook, fixe die Probleme und verifiziere mit einem erneuten Check."
            : "Each runbook follows the Score → Runbook → Fix → Re-Check workflow. Start with a security check, get your Claw Score, choose the matching runbook, fix the issues, and verify with a re-check."
        }
      }
    ]
  }

  const combinedSchema = [itemListLd, faqSchema]

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Programmatic SEO"
          title="Runbook Library"
          subtitle={subtitle}
        />
        <RunbookNexus />

        {/* CONVERSION WARFARE ROUND 3: Aggressive CTAs with Urgency */}
        <div className="mt-12 space-y-4">
          <a
            href={`/${locale}/check`}
            className="block bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400 rounded-xl p-6 hover:from-cyan-500 hover:to-cyan-400 transition-all relative"
          >
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {locale === 'de' ? 'JETZT' : 'NOW'}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🛡️</div>
              <div>
                <div className="font-bold text-white text-lg">
                  {locale === 'de' ? '🛡️ Vollständiger Security-Check' : '🛡️ Full Security Check'}
                </div>
                <div className="text-cyan-100 text-sm">
                  {locale === 'de' ? 'Deine gesamte Infrastruktur in 30 Sekunden prüfen' : 'Check your entire infrastructure in 30 seconds'}
                </div>
              </div>
            </div>
          </a>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href={`/${locale}/roast-my-moltbot`}
              className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="font-semibold text-amber-400">{locale === 'de' ? 'Roast My Moltbot' : 'Roast My Moltbot'}</div>
                  <div className="text-xs text-gray-400">{locale === 'de' ? 'Kostenloser Security-Roast' : 'Free security roast'}</div>
                </div>
              </div>
            </a>
            <a
              href={`/${locale}/openclaw`}
              className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <div className="font-semibold text-green-400">{locale === 'de' ? 'OpenClaw' : 'OpenClaw'}</div>
                  <div className="text-xs text-gray-400">{locale === 'de' ? 'Self-Hosted Security Framework' : 'Self-hosted security framework'}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
