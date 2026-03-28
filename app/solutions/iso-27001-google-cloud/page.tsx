import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "ISO 27001 auf Google Cloud – Praxisleitfaden 2026 | ClawGuru",
    description:
      "ISMS auf GCP: Scope, Risikoanalyse, Controls (Annex A), Logging/Monitoring, Backup/DR, Dokumentation. Audit-ready mit Nachweisen.",
    alternates: { canonical: `/${locale}/solutions/iso-27001-google-cloud` },
  }
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-4">ISO 27001 auf Google Cloud</h1>
      <p className="text-slate-400 mb-8">
        So implementieren Sie ein ISMS auf Google Cloud: Risiken identifizieren, Controls priorisieren, technische & organisatorische Maßnahmen
        umsetzen, Wirksamkeit messen und Audit-Nachweise liefern.
      </p>
      <h2 className="text-xl font-bold mt-10 mb-3">Kern-Bereiche</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-300">
        <li>Asset-Management & Klassifizierung</li>
        <li>Identity & Access Management (MFA, Least Privilege)</li>
        <li>Protokollierung, Monitoring, Incident Management</li>
        <li>Backup/DR, Change- & Patch-Management</li>
      </ul>
      <div className="mt-10 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-sm">
        Mehr Guides: <a className="underline" href="/gsc-optimize">Guides Hub</a> ·
        <a className="underline ml-2" href="/solutions">Alle Solutions</a>
      </div>
    </div>
  )
}
