import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "GitHub Actions auf Bare Metal – Deployment Guide 2026 | ClawGuru",
    description:
      "Self-Hosted Runner sicher betreiben: Netzwerk, Secrets, RBAC/MFA, Canary/Blue-Green Deployment, Observability & Rollback.",
    alternates: { canonical: `/${locale}/solutions/github-actions-bare-metal` },
  }
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-4">GitHub Actions auf Bare Metal</h1>
      <p className="text-slate-400 mb-8">
        Sichere Deployments mit eigene Runnern: Isolierung, least privilege, Secrets-Handhabung, Canary/Blue-Green, Telemetrie und schnelles Rollback.
      </p>
      <h2 className="text-xl font-bold mt-10 mb-3">Checkliste</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-300">
        <li>Runner-Isolation (Namespace/VM), ausgehende Policy</li>
        <li>OIDC/Short-Lived Tokens, Secret-Scanning</li>
        <li>Canary/Blue-Green, Health-Probes, Auto-Rollback</li>
        <li>End-to-End Logging/Tracing für Deploy-Events</li>
      </ul>
      <div className="mt-10 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-sm">
        Mehr Guides: <a className="underline" href="/gsc-optimize">Guides Hub</a> ·
        <a className="underline ml-2" href="/solutions">Alle Solutions</a>
      </div>
    </div>
  )
}
