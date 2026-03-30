import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale, localeAlternates } from "@/lib/i18n"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const alts = localeAlternates("/case-studies")
  return {
    title: "Case Studies 2026 | ClawGuru",
    description:
      "Praktische, anonymisierte Case Studies zu Incidents, Reliability, Kosten und Compliance. Mit klaren Runbooks, Metriken und Ergebnissen.",
    alternates: alts,
    openGraph: {
      title: "ClawGuru Case Studies 2026",
      description: "Beweise statt Behauptungen: echte Cases, klare Schritte, messbare Ergebnisse.",
      type: "website",
    },
  }
}

type CaseItem = {
  id: string
  title: string
  tag: "Incident" | "Reliability" | "Kosten" | "Compliance" | "Security"
  summary: string
  steps: string[]
  impact: { metric: string; before: string; after: string }[]
  links?: { label: string; href: string }[]
}

const CASES: CaseItem[] = [
  {
    id: "exposed-panel-key-rotation",
    title: "Exposed Panel + Key Rotation",
    tag: "Incident",
    summary:
      "Admin-Panel war öffentlich. Mehrere Auth-Fails in Logs. Fix: Key-Rotation, Private Binding, Origin-Allowlist. MTTR < 20 Minuten.",
    steps: [
      "Keys rotieren (API/Telegram) und alte Tokens invalidieren",
      "Ingress schließen (deny-by-default, Private Subnet)",
      "Origin-Allowlist für WebSockets aktivieren",
      "Auth-Fail Alerts + Rate Limits setzen",
    ],
    impact: [
      { metric: "MTTR", before: "> 2h", after: "18m" },
      { metric: "Auth-Fails/5m", before: "120+", after: "< 3" },
    ],
    links: [
      { label: "Runbook: SSH Hardening", href: "/runbook/aws-ssh-hardening-2026" },
      { label: "Copilot anwenden", href: "/copilot" },
    ],
  },
  {
    id: "cost-explosion-no-limits",
    title: "„Alles läuft“, aber Kosten explodieren",
    tag: "Kosten",
    summary:
      "Root Cause: fehlende Limits/Autoscaling-Defaults und Chatty-Worker. Fix: Concurrency-Limits, Batching, Cache, Observability.",
    steps: [
      "Worker Concurrency begrenzen",
      "Requests batchen, Cache aktivieren",
      "SLO definieren + Alarm bei Anomalien",
    ],
    impact: [
      { metric: "Cloud Spend", before: "+38%/Monat", after: "−26%/Monat" },
      { metric: "P95 Latenz", before: "1.2s", after: "380ms" },
    ],
  },
  {
    id: "deploy-friction-no-rollback",
    title: "Random Downtime durch Deploy-Friction",
    tag: "Reliability",
    summary:
      "Deployments ohne Rollback/Healthchecks. Fix: Health Endpoints, Blue/Green, ENV-Validation, Restore-Drill.",
    steps: [
      "Healthcheck + Readiness Gate",
      "Blue/Green mit automatischem Rollback",
      "ENV-Validator in CI",
      "Restore-Test (Backup ist nur Theorie, bis du restorest)",
    ],
    impact: [
      { metric: "Failed Deploys", before: "~1/Woche", after: "< 1/Monat" },
      { metric: "Change Failure Rate", before: "11%", after: "2%" },
    ],
  },
  {
    id: "iso27001-gcp-accelerator",
    title: "ISO 27001 auf GCP in 12 Wochen",
    tag: "Compliance",
    summary:
      "ISMS-Scope, Annex A Controls, Logging, DR. Audit-Readiness mit GCP Security Services und SoA-Dokumentation.",
    steps: [
      "ISMS Scope + Asset Inventory",
      "Annex A Controls auf GCP abbilden",
      "Cloud Logging + Chronicle SIEM",
      "SoA + Internal Audit + Management Review",
    ],
    impact: [
      { metric: "Audit Findings", before: "23 offen", after: "0 offen" },
      { metric: "Time-to-Cert", before: "6–9 Monate", after: "12 Wochen" },
    ],
    links: [
      { label: "Guide: ISO 27001 GCP", href: "/solutions/iso-27001-google-cloud" },
    ],
  },
  {
    id: "influxdb-hipaa-hardening",
    title: "InfluxDB HIPAA Hardening",
    tag: "Security",
    summary:
      "Encryption at Rest/Transit, RBAC, Audit Logging, DR. BAA-Prozess und PHI-Logging-Vermeidung.",
    steps: [
      "AES-256 at Rest + TLS 1.3",
      "RBAC + MFA + OIDC",
      "Audit-Logs an SIEM",
      "Encrypted Backups + DR-Drill",
    ],
    impact: [
      { metric: "Compliance Gaps", before: "9", after: "0" },
    ],
    links: [
      { label: "Guide: InfluxDB HIPAA", href: "/solutions/influxdb-hipaa-compliance" },
    ],
  },
  {
    id: "gha-bare-metal-runners",
    title: "GitHub Actions auf Bare Metal",
    tag: "Security",
    summary:
      "Self-Hosted Runner mit Isolation, OIDC, Secrets-less Deployments. Netzwerk-Segmentierung und Egress-Filter.",
    steps: [
      "Runner Installation + systemd",
      "Docker Userns-Remap + Seccomp",
      "OIDC für CSP-Access",
      "Egress-Filter + Proxy-Enforcement",
    ],
    impact: [
      { metric: "Secret Exposure Risk", before: "High", after: "Low" },
    ],
    links: [
      { label: "Guide: GHA Bare Metal", href: "/solutions/github-actions-bare-metal" },
    ],
  },
  {
    id: "rabbitmq-audit-baseline",
    title: "RabbitMQ Audit Baseline",
    tag: "Security",
    summary:
      "Audit-Events, Policy-Hardening, Least-Privilege, Network-ACLs. Sicheres Messaging in reg. Umgebungen.",
    steps: [
      "Audit-Logs aktivieren",
      "Policies + TLS erzwingen",
      "Least-Privilege vHosts/Users",
      "SIEM-Integration",
    ],
    impact: [
      { metric: "Unauthorized Ops", before: "n/a", after: "0 erfasst" },
    ],
    links: [
      { label: "Guide: RabbitMQ Audit", href: "/solutions/rabbitmq-audit" },
    ],
  },
  {
    id: "terraform-canary-pipeline",
    title: "Terraform Canary Deploy Pipeline",
    tag: "Reliability",
    summary:
      "Canary-Plan/Apply, Policy-as-Code Gates, Drift-Detection, automatischer Rollback bei Metrik-Regression.",
    steps: [
      "Plan-Drift Check",
      "OPA/Conftest Gates",
      "Canary Apply + Health Checks",
      "Autom. Rollback",
    ],
    impact: [
      { metric: "Change Failure Rate", before: "9%", after: "1.5%" },
    ],
    links: [
      { label: "Guide: Terraform Canary", href: "/solutions/terraform-canary-deploy" },
    ],
  },
]

export default function CaseStudiesPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Case Studies",
    url: `${BASE_URL}${prefix}/case-studies`,
    itemListElement: CASES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${BASE_URL}${prefix}/case-studies#${c.id}`,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      <div className="py-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <SectionTitle
            kicker="Beweise > Behauptungen"
            title="Case Studies (anonymisiert)"
            subtitle="Echte Vorfälle und Projekte. Klare Schritte. Messbare Ergebnisse. Keine Magie – nur saubere Reihenfolge."
          />
        </div>

        {/* Filters (static, UX only) */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {["Alle", "Incident", "Reliability", "Kosten", "Compliance", "Security"].map((f) => (
            <span key={f} className="px-3 py-1 rounded-full border border-gray-800 text-xs tracking-wider uppercase text-gray-300 hover:border-cyan-500 cursor-default">
              {f}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {CASES.map((c) => (
            <article id={c.id} key={c.id} className="p-6 rounded-3xl border border-gray-800 bg-black/30 hover:bg-black/40 transition-colors">
              <div className="text-xs uppercase tracking-widest text-cyan-300/80 font-bold">{c.tag}</div>
              <h2 className="mt-2 text-xl font-black text-white">{c.title}</h2>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">{c.summary}</p>

              <div className="mt-5 text-sm font-bold text-gray-200">Runbook-Auszug</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {c.steps.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              {c.impact?.length ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {c.impact.map((m) => (
                    <div key={m.metric} className="p-3 rounded-2xl border border-gray-800 bg-black/20">
                      <div className="text-[11px] uppercase tracking-widest text-gray-400">{m.metric}</div>
                      <div className="text-sm text-gray-300 mt-1"><span className="text-red-400/80 line-through mr-2">{m.before}</span><span className="text-emerald-400 font-bold">{m.after}</span></div>
                    </div>
                  ))}
                </div>
              ) : null}

              {c.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {c.links.map((l) => (
                    <a key={l.href} className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors" href={`${prefix}${l.href}`}>
                      {l.label} →
                    </a>
                  ))}
                  <a className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors" href={`${prefix}/vault`}>
                    Vault Referenzen →
                  </a>
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-3">
                  <a className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors" href={`${prefix}/copilot`}>
                    Copilot anwenden →
                  </a>
                  <a className="px-4 py-2 rounded-xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200 transition-colors" href={`${prefix}/vault`}>
                    Vault Referenzen →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-3xl border border-gray-800 bg-black/20">
          <div className="text-lg font-black text-white">Willst du deinen Case hier?</div>
          <p className="text-gray-300 mt-2">
            Schick anonymisierte Logs/Config-Snippets (ohne Secrets). Wir bauen daraus ein Runbook und – wenn du willst – eine Case Study.
          </p>
        </div>
      </div>
    </Container>
  )
}
