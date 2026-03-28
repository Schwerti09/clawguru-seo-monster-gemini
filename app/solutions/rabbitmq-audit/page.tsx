import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "RabbitMQ Audit & Compliance – Logging & Controls 2026 | ClawGuru",
    description:
      "Audit-Logging, Benutzer-/Rollen-Konzept, TLS, Policy-Checks und SIEM-Integration für RabbitMQ. Compliance-fähig dokumentiert.",
    alternates: { canonical: `/${locale}/solutions/rabbitmq-audit` },
  }
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-4">RabbitMQ Audit</h1>
      <p className="text-slate-400 mb-8">
        So bauen Sie revisionssichere Protokollierung und Zugriffskontrolle für RabbitMQ: TLS, Rollen, Policies, SIEM-Anbindung und Nachweise.
      </p>
      <h2 className="text-xl font-bold mt-10 mb-3">Kern-Schritte</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-300">
        <li>TLS + Client-Auth, Cipher Suites</li>
        <li>RBAC, Policy-Set (vHosts, Queues, Exchanges)</li>
        <li>Audit-Logs ins SIEM, Alarmierung</li>
        <li>Regelmäßige Evidence-Exports</li>
      </ul>
      <div className="mt-10 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-sm">
        Mehr Guides: <a className="underline" href="/gsc-optimize">Guides Hub</a> ·
        <a className="underline ml-2" href="/solutions">Alle Solutions</a>
      </div>
    </div>
  )
}
