import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "InfluxDB HIPAA Compliance Checklist 2026 | ClawGuru",
    description:
      "Schritt-für-Schritt: Verschlüsselung, Audit-Logs, Zugriffskontrollen, Backup/DR für HIPAA-konforme InfluxDB-Setups. Mit Prüf-Commands.",
    alternates: { canonical: `/${locale}/solutions/influxdb-hipaa-compliance` },
  }
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-4">InfluxDB HIPAA Compliance (2026)</h1>
      <p className="text-slate-400 mb-8">
        Leitfaden zur Umsetzung von HIPAA-Kontrollen für InfluxDB: Verschlüsselung at-rest & in-transit, Audit-Logging,
        Zugriffskontrollen, Backup & Wiederherstellung, Notfalltests und Nachweisführung.
      </p>
      <h2 className="text-xl font-bold mt-10 mb-3">Checkliste</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-300">
        <li>TLS aktivieren (Client/Server), Cipher-Suites nach NIST</li>
        <li>At-rest Encryption (z.B. LUKS/Cloud-Volume) + Schlüsselrotation</li>
        <li>Audit-Logs aktivieren und zentral sammeln (SIEM)</li>
        <li>RBAC/MFA für Admin-Zugriff, Least-Privilege-Prinzip</li>
        <li>Backups verschlüsselt, täglich testen (Restore-Drill)</li>
        <li>BAA mit Cloud-Provider prüfen (falls relevant)</li>
      </ol>
      <div className="mt-10 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-sm">
        Mehr Guides: <a className="underline" href="/gsc-optimize">Guides Hub</a> ·
        <a className="underline ml-2" href="/solutions">Alle Solutions</a>
      </div>
    </div>
  )
}
