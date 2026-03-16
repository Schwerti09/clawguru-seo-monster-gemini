// Shared runbooks listing content component.
// Used by both /runbooks (default locale) and /[lang]/runbooks (localized).

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import RunbooksSearch from "@/components/shared/RunbooksSearch"
import type { SeverityLevel } from "@/lib/design-system"
import type { RunbookSummary } from "@/components/shared/RunbooksSearch"
import { BASE_URL } from "@/lib/config"
import type { Locale } from "@/lib/i18n"
import type { Runbook } from "@/lib/pseo"

// VISUAL UPGRADE 2026: Derive severity from runbook tags
function deriveSeverity(tags: string[]): SeverityLevel {
  const text = tags.join(" ").toLowerCase()
  if (text.includes("critical") || text.includes("incident") || text.includes("notfall")) return "critical"
  if (text.includes("security") || text.includes("hardening") || text.includes("firewall")) return "high"
  if (text.includes("monitoring") || text.includes("setup")) return "medium"
  if (text.includes("docs") || text.includes("template")) return "info"
  return "medium"
}

// VISUAL UPGRADE 2026: Derive fix readiness from howto steps count
function deriveReadiness(r: Runbook): number {
  const steps = r.howto?.steps?.length ?? 3
  return Math.min(95, 50 + steps * 8)
}

export default async function RunbooksPageContent({
  locale,
  subtitle,
}: {
  locale: Locale
  subtitle: string
}) {
  let items: RunbookSummary[] = []
  try {
    const mod = await import("@/lib/pseo")
    const list = (mod as { RUNBOOKS?: Runbook[] }).RUNBOOKS ?? []
    if (Array.isArray(list) && list.length > 0) {
      items = [...list]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((r) => ({
          slug: r.slug,
          title: r.title,
          summary: r.summary,
          tags: r.tags,
          severity: deriveSeverity(r.tags),
          fixReadiness: deriveReadiness(r),
        }))
    }
  } catch {}

  if (items.length === 0) {
    const fallback: Array<RunbookSummary> = [
      { slug: "hetzner-ssh-hardening-2026", title: "Hetzner: SSH Hardening 2026", summary: "Key-only, Root aus, Rate-Limits, sichere Admin-Zugänge.", tags: ["hetzner","ssh","security","hardening"], severity: deriveSeverity(["security","hardening","ssh"]), fixReadiness: 86 },
      { slug: "aws-firewall-baseline-2026", title: "AWS: Firewall Baseline 2026", summary: "Default deny, minimal offene Ports, sichere Defaults.", tags: ["aws","firewall","security"], severity: deriveSeverity(["security","firewall"]), fixReadiness: 82 },
      { slug: "nginx-502-bad-gateway-2026", title: "Nginx: 502 Bad Gateway Fix 2026", summary: "Timeouts, Upstream-Health, Buffering – schnell triagieren und fixen.", tags: ["nginx","error:502","fix"], severity: deriveSeverity(["incident","critical","nginx"]), fixReadiness: 78 },
      { slug: "docker-secrets-management-2026", title: "Docker: Secrets Management 2026", summary: "Kein .env in Git – sichere Secret Stores nutzen.", tags: ["docker","secrets","security"], severity: deriveSeverity(["security","secrets"]), fixReadiness: 80 },
      { slug: "cloudflare-waf-baseline-2026", title: "Cloudflare: WAF Baseline 2026", summary: "Managed Rules + Rate Limits – sinnvolle Defaults.", tags: ["cloudflare","waf","security"], severity: deriveSeverity(["security","waf"]), fixReadiness: 76 },
      { slug: "kubernetes-rbac-2026", title: "Kubernetes: RBAC Hardening 2026", summary: "Least privilege, Service Accounts, Audit Logs.", tags: ["kubernetes","rbac","security"], severity: deriveSeverity(["security","kubernetes"]), fixReadiness: 79 },
      { slug: "stripe-webhook-verify-2026", title: "Stripe: Webhook Verify 2026", summary: "Signaturen prüfen, Replay verhindern, Idempotency.", tags: ["stripe","webhook","security"], severity: deriveSeverity(["security","stripe"]), fixReadiness: 74 },
      { slug: "redis-auth-tls-2026", title: "Redis: Auth + TLS 2026", summary: "Redis nicht öffentlich – Auth + TLS erzwingen.", tags: ["redis","security","tls"], severity: deriveSeverity(["security","redis"]), fixReadiness: 77 },
      { slug: "postgres-backup-restore-2026", title: "Postgres: Backup/Restore Drill 2026", summary: "PITR, WAL, regelmäßige Restore-Tests.", tags: ["postgres","backup","drill"], severity: deriveSeverity(["setup","monitoring"]), fixReadiness: 81 },
      { slug: "security-headers-csp-2026", title: "Security Headers & CSP 2026", summary: "HSTS, CSP, XFO, Referrer Policy – richtig setzen.", tags: ["security","headers","csp"], severity: deriveSeverity(["security","hardening"]), fixReadiness: 75 },
    ]
    items = fallback
  }

  const top20 = items.slice(0, 20)
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Runbook Library",
    description: "Security- und Ops-Runbooks für DevOps-Teams: SSH-Hardening, Firewall, Incident Response und mehr.",
    numberOfItems: items.length,
    itemListElement: top20.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/${locale}/runbook/${r.slug}`,
      name: r.title,
    })),
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Programmatic SEO"
          title="Runbook Library"
          subtitle={subtitle}
        />
        <RunbooksSearch items={items} />
      </div>
    </Container>
  )
}
