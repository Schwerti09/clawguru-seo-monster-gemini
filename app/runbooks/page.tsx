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
  alternates: { 
    canonical: "/runbooks",
    languages: {
      de: "https://clawguru.org/de/runbooks",
      en: "https://clawguru.org/en/runbooks",
      es: "https://clawguru.org/es/runbooks",
      fr: "https://clawguru.org/fr/runbooks",
      pt: "https://clawguru.org/pt/runbooks",
      it: "https://clawguru.org/it/runbooks",
      ru: "https://clawguru.org/ru/runbooks",
      zh: "https://clawguru.org/zh/runbooks",
      ja: "https://clawguru.org/ja/runbooks",
      ko: "https://clawguru.org/ko/runbooks",
      ar: "https://clawguru.org/ar/runbooks",
      hi: "https://clawguru.org/hi/runbooks",
      tr: "https://clawguru.org/tr/runbooks",
      pl: "https://clawguru.org/pl/runbooks",
      nl: "https://clawguru.org/nl/runbooks"
    }
  }
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was sind ClawGuru Runbooks?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Runbooks sind 600+ ausführbare Sicherheits-Playbooks für Self-Hosted und Cloud-Infrastruktur. Jedes Runbook: schrittweise Anleitung mit Befehlen, automatische Verifikation nach jedem Schritt, Rollback-Anweisungen, Compliance-Evidenz-Export. Kategorien: Security Hardening, Incident Response, Compliance Automation, Monitoring Setup, Container Security, Secrets Management.' } },
    { '@type': 'Question', name: 'Für welche Systeme gibt es ClawGuru Runbooks?', acceptedAnswer: { '@type': 'Answer', text: 'ClawGuru Runbook-Abdeckung: Betriebssysteme: Ubuntu, Debian, CentOS, RHEL, Alpine. Container: Docker, Kubernetes (K8s), Helm. Web-Server: nginx, Apache, Caddy, Traefik. Datenbanken: PostgreSQL, MySQL, Redis, MongoDB. CI/CD: GitHub Actions, GitLab CI, Jenkins. Cloud: AWS, GCP, Azure, Hetzner. Security Tools: Falco, Trivy, Vault, Prometheus/Grafana. AI/Bots: Moltbot, OpenClaw-Deployments.' } },
    { '@type': 'Question', name: 'Wie führe ich ein ClawGuru Runbook aus?', acceptedAnswer: { '@type': 'Answer', text: 'Runbook ausführen: 1) Security Check für deine Domain durchführen (kostenlos). 2) Runbook für den gefundenen Finding auswählen (ClawGuru verlinkt direkt). 3) Runbook öffnen — zeigt Schritt-für-Schritt-Anleitung. 4) Schritte sequenziell ausführen mit Verifikations-Checks. 5) Re-Check nach Abschluss (Score sollte steigen). Alternativ: Runbook über API in CI/CD-Pipeline integrieren für automatische Verifikation bei jedem Deploy.' } },
    { '@type': 'Question', name: 'Kann ich eigene Runbooks in ClawGuru erstellen?', acceptedAnswer: { '@type': 'Answer', text: 'Custom Runbooks: Pro und Enterprise Plan ermöglichen eigene Runbooks. Format: YAML-basiert mit Steps, Verifikations-Commands, Rollback-Anweisungen. Import aus bestehenden Markdown-Runbooks möglich. Team-Sharing: Runbooks im Team-Namespace teilen. Versionierung über Git-Integration. Custom Runbooks werden nicht öffentlich — nur für dein Team sichtbar. Enterprise: eigene Runbook-Library als White-Label.' } },
  ],
}

export default async function RunbooksPage() {
  const locale = DEFAULT_LOCALE as Locale
  const dict = await getDictionary(locale)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <RunbooksPageContent locale={locale} subtitle={dict.runbooks.subtitle} />
    </>
  )
}
