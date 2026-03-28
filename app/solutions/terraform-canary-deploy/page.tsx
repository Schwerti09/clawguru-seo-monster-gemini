import type { Metadata } from "next"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"

export const dynamic = "force-static"
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  return {
    title: "Terraform Canary Deploy – Zero-Downtime Rollouts 2026 | ClawGuru",
    description:
      "Canary-Strategie mit Terraform: Traffic-Shaping, Health-Probes, Progressive Rollouts, automatisches Rollback und Observability.",
    alternates: { canonical: `/${locale}/solutions/terraform-canary-deploy` },
  }
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-black mb-4">Terraform Canary Deploy</h1>
      <p className="text-slate-400 mb-8">
        Planen, testen, ausrollen – und sicher zurückrollen: Canary-Deployments mit Metriken, Alarmschwellen und automatisierten Gates.
      </p>
      <h2 className="text-xl font-bold mt-10 mb-3">Praxis-Checkliste</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-300">
        <li>Traffic-Split (10% → 25% → 50% → 100%)</li>
        <li>Health-Checks & SLOs als Gates</li>
        <li>Rollback-Pfade & Datenmigrationen</li>
        <li>Telemetrie (Logs, Metrics, Traces) je Stufe</li>
      </ul>
      <div className="mt-10 p-4 rounded-lg border border-cyan-500/30 bg-cyan-900/10 text-sm">
        Mehr Guides: <a className="underline" href="/gsc-optimize">Guides Hub</a> ·
        <a className="underline ml-2" href="/solutions">Alle Solutions</a>
      </div>
    </div>
  )
}
