// Localized temporal runbook pages: /de/runbook/[slug]/temporal, etc.

// Relative Imports – korrekt für app/[lang]/runbook/[slug]/temporal/page.tsx
import Container from "../../../../../components/shared/Container"
import { getRunbook, RUNBOOKS } from "../../../../../lib/pseo"
import { validateRunbook } from "../../../../../lib/quality-gate"
import { getTemporalHistory, findVersionByQuarter } from "../../../../../lib/temporal-mycelium"
import { notFound } from "next/navigation"
import { type Locale, SUPPORTED_LOCALES } from "../../../../../lib/i18n"

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.flatMap((lang) =>
    RUNBOOKS.map((r) => ({ lang, slug: r.slug }))
  )
}

export async function generateMetadata(props: {
  params: { lang: string; slug: string }
}) {
  const { slug, lang } = props.params
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale

  return {
    title: `Temporal History | ClawGuru Runbooks`,
    description: "Zeitliche Entwicklung und Versionsgeschichte des Runbooks",
    alternates: { canonical: `/runbook/:slug/temporal/page` }
  }
}

export default async function LocaleTemporalRunbookPage(props: {
  params: { lang: string; slug: string }
}) {
  const { slug, lang } = props.params
  void ((SUPPORTED_LOCALES.includes(lang as Locale) ? lang : "de") as Locale)

  const runbook = getRunbook(slug)
  if (!runbook) notFound()

  const history = getTemporalHistory(runbook)
  const currentQuarter = `${new Date().getFullYear()}-Q${Math.floor(new Date().getMonth() / 3) + 1}`
  const currentVersion = findVersionByQuarter(history, currentQuarter)

  const validationResult = validateRunbook(runbook)

  return (
    <Container>
      <div className="py-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-center">Temporal History: {runbook.title}</h1>
        <p className="mt-6 text-center text-xl text-gray-400">
          Versionsgeschichte und zeitliche Entwicklung (Stand: {currentQuarter})
        </p>

        {/* Aktuelle Version */}
        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/20">
          <h2 className="text-2xl font-bold mb-4">Aktuelle Version</h2>
          <p className="text-gray-300">
            {currentVersion
              ? `${currentVersion.label} – ${currentVersion.mutationReason || "Keine Beschreibung"}`
              : "Keine aktuelle Version gefunden"}
          </p>
        </div>

        {/* Validierungs-Status */}
        <div className="mt-8 p-6 rounded-3xl border border-gray-800 bg-black/30">
          <h2 className="text-2xl font-bold mb-4">Qualitäts-Check</h2>
          <p className={validationResult.pass ? "text-green-400" : "text-red-400"}>
            {validationResult.pass
              ? "Runbook ist gültig"
              : `Probleme: ${
                  validationResult.violations
                    ?.filter((v) => v.severity === "error")
                    .map((v) => v.message)
                    .join(", ") || "Unbekannte Validierungsfehler"
                }`}
          </p>
        </div>

        {/* Versions-Timeline */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Versions-History</h2>
          <div className="space-y-6">
            {history.versions.map((version) => (
              <div
                key={version.quarter}
                className="p-6 rounded-3xl border border-gray-800 bg-black/20"
              >
                <div className="text-xl font-bold">{version.quarter}</div>
                <p className="mt-2 text-gray-300">
                  {version.mutationReason || "Keine Änderungen dokumentiert"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}