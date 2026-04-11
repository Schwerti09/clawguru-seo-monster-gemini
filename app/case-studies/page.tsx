import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { BASE_URL } from "@/lib/config"
import { headers } from "next/headers"

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Case Studies 2026 | Security Incidents, NIS2, KI-Angriffe | ClawGuru",
    description:
      "18+ anonymisierte Security Case Studies (April 2026): KI-Agenten-Angriffe, NIS2-Compliance-Sprint, Supply-Chain-Kompromittierung, Cloud-Kosten-Explosion durch AI-Workloads. Echte Schritte, messbare Ergebnisse.",
    keywords: [
      "Security Case Studies 2026", "NIS2 Compliance", "KI Sicherheit", "Supply Chain Angriff",
      "Cloud Security", "Incident Response", "DSGVO Datenpanne", "Zero Trust", "Ransomware Resilience",
    ],
    openGraph: {
      title: "Case Studies 2026 | Security Incidents & Compliance | ClawGuru",
      description: "18+ echte Security Cases: KI-Angriffe, NIS2, Supply Chain, Cloud-Kosten — klare Schritte, messbare Ergebnisse.",
      type: "website",
      url: `${BASE_URL}/de/case-studies`,
      images: ["/og-image.png"],
    },
    robots: "index, follow",
  }
}

type CaseTag = "Incident" | "Reliability" | "Kosten" | "Compliance" | "Security" | "AI/ML" | "Supply Chain"

type CaseItem = {
  id: string
  title: string
  tag: CaseTag
  date: string
  severity?: "critical" | "high" | "medium"
  summary: string
  steps: string[]
  impact: { metric: string; before: string; after: string }[]
  links?: { label: string; href: string }[]
}

const TAG_COLORS: Record<CaseTag, string> = {
  "Incident":      "bg-red-900 text-red-300 border-red-700",
  "Reliability":   "bg-blue-900 text-blue-300 border-blue-700",
  "Kosten":        "bg-yellow-900 text-yellow-300 border-yellow-700",
  "Compliance":    "bg-purple-900 text-purple-300 border-purple-700",
  "Security":      "bg-green-900 text-green-300 border-green-700",
  "AI/ML":         "bg-cyan-900 text-cyan-300 border-cyan-700",
  "Supply Chain":  "bg-orange-900 text-orange-300 border-orange-700",
}

const SEVERITY_LABEL: Record<NonNullable<CaseItem["severity"]>, string> = {
  critical: "KRITISCH",
  high:     "HOCH",
  medium:   "MITTEL",
}

const CASES: CaseItem[] = [
  {
    id: "ai-agent-prompt-injection-prod",
    title: "LLM Prompt-Injection in Produktions-Copilot",
    tag: "AI/ML",
    date: "April 2026",
    severity: "critical",
    summary:
      "Ein interner KI-Copilot für DevOps wurde über manipulierte Ticket-Texte dazu gebracht, Shell-Befehle mit erhöhten Rechten auszuführen. Root Cause: keine Input-Sanitisierung, kein Sandbox-Modell. Fix: Prompt-Guard, Tool-Allowlist, Read-Only-Default.",
    steps: [
      "Prompt-Guard-Layer zwischen User-Input und LLM einziehen",
      "Tool-Allowlist: LLM darf nur definierte Aktionen auslösen",
      "Sandbox-Mode: alle LLM-Aktionen laufen als unprivilegierter Service-Account",
      "Audit-Log für jede LLM-Tool-Invocation aktivieren",
      "Red-Team-Test mit OWASP LLM Top 10 vor Re-Launch",
    ],
    impact: [
      { metric: "Privilege-Escalation-Risk", before: "Kritisch", after: "Eliminiert" },
      { metric: "LLM-Audit-Coverage", before: "0%", after: "100%" },
    ],
    links: [
      { label: "Guide: AI Agent Security", href: "/moltbot/ai-agent-security" },
      { label: "Guide: AI Hardening", href: "/moltbot/ai-agent-hardening-guide" },
    ],
  },
  {
    id: "supply-chain-gha-compromise",
    title: "GitHub Actions Supply-Chain-Kompromittierung",
    tag: "Supply Chain",
    date: "März 2026",
    severity: "critical",
    summary:
      "Ein externer GitHub-Action-Maintainer wurde kompromittiert. Sein Action-Tag wurde mit Malware überschrieben, die Secrets aus CI-Umgebungen exfiltrierte. Betroffen: 3 Repositories, 2 AWS-Keys, 1 NPM-Token.",
    steps: [
      "Alle Actions auf SHA-Pins umstellen (keine Tags mehr)",
      "Dependabot Actions-Updates aktivieren",
      "Alle exponierten Secrets sofort rotieren (AWS, NPM, Docker)",
      "OIDC statt langlebiger Credentials in CI/CD",
      "Supply-Chain-Policy in OPA/Conftest kodieren",
    ],
    impact: [
      { metric: "Exposed Secrets", before: "3 kompromittiert", after: "0 (rotiert + OIDC)" },
      { metric: "SHA-Pinned Actions", before: "0%", after: "100%" },
    ],
    links: [
      { label: "Guide: DevsecOps Pipeline", href: "/moltbot/devsecops-pipeline" },
      { label: "Guide: Supply Chain Security", href: "/openclaw/supply-chain-security" },
    ],
  },
  {
    id: "nis2-compliance-sprint-60days",
    title: "NIS2-Compliance-Sprint in 60 Tagen",
    tag: "Compliance",
    date: "April 2026",
    severity: "high",
    summary:
      "Mittelständischer SaaS-Anbieter (KRITIS-adjacent) musste NIS2 Art. 21 bis Deadline nachweisen. Fehlende Dokumentation, kein Incident-Response-Plan, kein Asset-Inventory. Vollständige Compliance in 8 Wochen.",
    steps: [
      "Asset-Inventory erstellen (Cloud + On-Prem)",
      "Risiko-Assessment nach ISO 27005",
      "Incident-Response-Plan + Meldepflicht-Workflow (72h-Frist BSI)",
      "Technische Massnahmen: MFA, Patch-SLAs, Backup-Tests",
      "Management-Review + Nachweis-Dokumentation",
    ],
    impact: [
      { metric: "NIS2-Controls", before: "4/21 erfüllt", after: "21/21 erfüllt" },
      { metric: "Time-to-Compliance", before: "geplant 6 Monate", after: "60 Tage erreicht" },
    ],
    links: [
      { label: "Guide: NIS2 Compliance", href: "/moltbot/nis2-compliance-setup" },
      { label: "Security Check starten", href: "/securitycheck" },
    ],
  },
  {
    id: "ai-workload-cloud-cost-explosion",
    title: "Cloud-Kosten-Explosion durch AI-Workloads",
    tag: "Kosten",
    date: "April 2026",
    severity: "high",
    summary:
      "LLM-Inference-Cluster auf AWS skalierte unkontrolliert: 340% Kosten-Anstieg in 3 Wochen durch fehlende Spot-Limits und GPU-Autoscaling ohne Budget-Alarms. Fix: FinOps-Guardrails, Spot-Budgets, Inference-Caching.",
    steps: [
      "AWS Budget Alarms + Cost Anomaly Detection aktivieren",
      "GPU-Spot-Instances: Max-Capacity-Limit setzen",
      "Inference-Request-Caching (semantisch: Redis + Embeddings)",
      "Modell-Tiering: kleine Modelle für einfache Anfragen",
      "FinOps-Dashboard: Kosten/1000-Tokens-Metrik einführen",
    ],
    impact: [
      { metric: "Monatliche Cloud-Kosten", before: "+340%", after: "-62% vs. Peak" },
      { metric: "Cost per 1k Tokens", before: "$0.043", after: "$0.009" },
    ],
    links: [
      { label: "Guide: Cloud Security Posture", href: "/moltbot/cloud-security-posture-management" },
    ],
  },
  {
    id: "kubernetes-cve-rapid-response",
    title: "Kubernetes CVE-Schnellreaktion (CVSS 9.8)",
    tag: "Security",
    date: "März 2026",
    severity: "critical",
    summary:
      "Kritische K8s-Schwachstelle (CVSS 9.8) in wildcard admission controller erlaubte privilege escalation. Cluster musste innerhalb von 4 Stunden gepatcht werden — ohne Service-Downtime dank rolling update und PodDisruptionBudgets.",
    steps: [
      "CVE-Alert über Trivy-Operator + OpenClaw CVE-Feed empfangen",
      "Blast-Radius analysieren: welche Nodes betroffen?",
      "Rolling Patch: Node-by-Node mit cordon/drain/upgrade/uncordon",
      "PodDisruptionBudgets prüfen — kein Service-Impact",
      "Post-Patch: Trivy-Scan + OPA-Policy für neue Admission Controller",
    ],
    impact: [
      { metric: "Patch-Zeit (CVSS 9.8)", before: "Industrie-Schnitt: 72h", after: "Erreicht: 4h" },
      { metric: "Service-Downtime", before: "erwartet: 45 min", after: "0 min" },
    ],
    links: [
      { label: "Guide: Container Security", href: "/moltbot/container-security-docker-kubernetes" },
      { label: "Guide: Vulnerability Scanning", href: "/moltbot/vulnerability-scanning" },
    ],
  },
  {
    id: "dsgvo-data-breach-response",
    title: "DSGVO-Datenpanne: Response in 71 Stunden",
    tag: "Compliance",
    date: "Februar 2026",
    severity: "critical",
    summary:
      "Fehlkonfigurierter S3-Bucket exponierte PII von 8.200 Kunden. DSGVO-Meldepflicht: 72 Stunden an Aufsichtsbehörde. Mit vorbereitendem Incident-Response-Plan wurde die Meldung in 71h fristgerecht eingereicht.",
    steps: [
      "S3-Bucket sofort auf Private + Block Public Access setzen",
      "Zugriffslog-Analyse: welche IPs haben heruntergeladen?",
      "Betroffenen-Liste aus Datenbank exportieren",
      "Aufsichtsbehörde (BSI/LfDI) innerhalb 72h benachrichtigen",
      "Betroffene Kunden informieren + Passwort-Reset erzwingen",
    ],
    impact: [
      { metric: "Meldung an Behörde", before: "Risiko: Fristversäumnis", after: "71h — fristgerecht" },
      { metric: "Bussgeldrisko", before: "Hoch (bis 4% Jahresumsatz)", after: "Stark reduziert" },
    ],
    links: [
      { label: "Guide: GDPR Compliance", href: "/moltbot/compliance-gdpr-setup" },
      { label: "Security Check starten", href: "/securitycheck" },
    ],
  },
  {
    id: "ransomware-resilience-chaos-test",
    title: "Ransomware-Resilience: Chaos-Engineering-Test",
    tag: "Incident",
    date: "April 2026",
    severity: "high",
    summary:
      "Geplantes Chaos-Engineering-Szenario simulierte Ransomware-Verschlüsselung auf Prod-ähnlicher Umgebung. RTO-Ziel war 4h — Realität war 18h. Findings führten zu Backup-Strategie-Overhaul und Air-Gap-Snapshots.",
    steps: [
      "Tabletop-Exercise: Angriffspfad durchspielen",
      "Backup-Restore-Drill mit echten Produktionsdaten (anonymisiert)",
      "Air-Gap-Snapshots einführen (immutable S3 / WORM-Speicher)",
      "Backup-Metadaten in separatem Account speichern",
      "RTO-Test wiederholen: Ziel unter 4h",
    ],
    impact: [
      { metric: "RTO (Ransomware-Szenario)", before: "18h (Realität)", after: "3h 20m (nach Fix)" },
      { metric: "Backup-Restore-Coverage", before: "42%", after: "100% getestet" },
    ],
    links: [
      { label: "Guide: Backup & DR", href: "/moltbot/backup-recovery-disaster-recovery" },
      { label: "Incident Response Guide", href: "/moltbot/incident-response-automation" },
    ],
  },
  {
    id: "deepfake-social-engineering",
    title: "Deepfake-CEO-Anruf: Social Engineering 2026",
    tag: "Incident",
    date: "März 2026",
    severity: "critical",
    summary:
      "CFO erhielt KI-generierten Deepfake-Sprachanruf, der CEO imitierte und Sofort-Überweisung von 180.000 EUR anforderte. Nur der 4-Augen-Prozess verhinderte den Transfer. Lessons learned: Anti-Fraud-Protokoll und Out-of-Band-Verifikation.",
    steps: [
      "Out-of-Band-Verifikation für Zahlungen über 5.000 EUR einführen",
      "Mitarbeiter-Schulung: Deepfake-Erkennung + Meldepflicht",
      "Anti-Fraud-Protokoll: Rückruf auf bekannte Nummer erzwingen",
      "Awareness-Kampagne mit simulierten Deepfake-Angriffen",
      "Eskalations-Workflow in Runbook dokumentieren",
    ],
    impact: [
      { metric: "Verhinderte Fraud-Summe", before: "180k EUR Risiko", after: "0 EUR — Transfer verhindert" },
      { metric: "Mitarbeiter trainiert", before: "0", after: "47/47 (100%)" },
    ],
    links: [
      { label: "Threat Detection Setup", href: "/moltbot/threat-detection-setup" },
      { label: "Security Awareness via Copilot", href: "/copilot" },
    ],
  },
  {
    id: "soc2-type2-automation",
    title: "SOC2 Type II Automation mit OpenClaw",
    tag: "Compliance",
    date: "Januar–April 2026",
    summary:
      "B2B-SaaS-Startup brauchte SOC2 Type II für Enterprise-Deals. Manueller Audit-Prozess zu teuer/langsam. Mit OpenClaw + automatischen Evidence-Collections auf AWS wurde Audit-Readiness in 90 Tagen erreicht.",
    steps: [
      "Trust Service Criteria mappen auf bestehende Controls",
      "Automatische Evidence-Collection: CloudTrail, Config, GuardDuty",
      "Change-Management-Prozess + PR-Reviews als Kontroll-Evidenz",
      "Penetration-Test beauftragen (Scope: Web + API)",
      "Auditor-Paket automatisch exportieren",
    ],
    impact: [
      { metric: "Audit-Prep-Zeit", before: "Est. 9 Monate manuell", after: "90 Tage automatisiert" },
      { metric: "Gewonnene Enterprise-Deals", before: "0 (Blocker: SOC2)", after: "3 in Pipeline" },
    ],
    links: [
      { label: "Guide: SOC2 Compliance", href: "/solutions/soc2-compliance-automation" },
      { label: "Compliance Automation Engine", href: "/moltbot/compliance-automation-engine" },
    ],
  },
  {
    id: "api-key-leak-github-scanning",
    title: "API-Key-Leak über GitHub Secret Scanning",
    tag: "Incident",
    date: "Februar 2026",
    severity: "high",
    summary:
      "Entwickler commitete Stripe Live-Key in Feature-Branch. GitHub Secret Scanning erkannte ihn 8 Minuten nach Push. Key rotiert, kein Schaden. Ohne Scanning wäre Key vermutlich Wochen exponiert gewesen.",
    steps: [
      "GitHub Secret Scanning + Push Protection aktivieren",
      "Pre-Commit-Hook: truffleHog / gitleaks lokal installieren",
      "Alle Secrets in Vault / GitHub Secrets auslagern",
      "Incident-Post-Mortem: kein Blame, klare Prozessverbesserung",
      "Entwickler-Schulung: Secrets gehören nicht in Git",
    ],
    impact: [
      { metric: "Erkennungszeit", before: "Wochen (historisch)", after: "8 Minuten" },
      { metric: "Finanzieller Schaden", before: "Potenziell hoch", after: "0 EUR" },
    ],
    links: [
      { label: "Guide: Secrets Vault Management", href: "/moltbot/secrets-vault-management" },
    ],
  },
  {
    id: "zero-trust-remote-workforce",
    title: "Zero-Trust-Rollout für 200 Remote-Mitarbeiter",
    tag: "Security",
    date: "Q1 2026",
    summary:
      "Unternehmen mit 200 Remote-MA wechselte von VPN auf Zero-Trust-Architektur (Tailscale + Keycloak). VPN-Split-Tunneling erlaubte zu weite Netzwerk-Erreichbarkeit. ZTA reduzierte Blast-Radius auf einzelne Services.",
    steps: [
      "Inventar: alle Dienste + Zugriffsmuster dokumentieren",
      "Identitäts-Provider (Keycloak) als Single Source of Truth",
      "Tailscale ACLs: Per-Service-Grants statt Netz-Zugang",
      "Device-Trust: Gerät-Zertifikate + Endpoint-Compliance",
      "Rollout: Abteilung für Abteilung, kein Big-Bang",
    ],
    impact: [
      { metric: "Laterale Bewegungsrisiko", before: "Gesamtes Netz", after: "Einzelner Service" },
      { metric: "VPN-Helpdesk-Tickets", before: "40/Monat", after: "3/Monat" },
    ],
    links: [
      { label: "Guide: Zero Trust Architecture", href: "/moltbot/zero-trust-architecture" },
      { label: "Guide: Keycloak Hardening", href: "/keycloak-hardening" },
    ],
  },
  {
    id: "sbom-vulnerability-supply-chain",
    title: "SBOM-Einführung stoppt versteckten CVE",
    tag: "Supply Chain",
    date: "April 2026",
    severity: "high",
    summary:
      "Nach XZ-Utils-artiger Warnung im Open-Source-Ökosystem führte das Team Software Bill of Materials (SBOM) ein. Sofort wurde eine kritische transitive Abhängigkeit mit bekanntem CVE gefunden, die seit 7 Monaten im Produkt war.",
    steps: [
      "Syft/CycloneDX SBOM-Generation in CI/CD integrieren",
      "SBOM an Grype / OSV-Scanner übergeben",
      "Transitive Dependencies visualisieren (dependency tree)",
      "SLA für Critical CVEs: Patch innerhalb 24h",
      "SBOM-Artefakt pro Release im Registry speichern",
    ],
    impact: [
      { metric: "Versteckte kritische CVEs", before: "Unbekannt (7 Monate)", after: "0 — alle sichtbar" },
      { metric: "SBOM-Coverage", before: "0%", after: "100% aller Releases" },
    ],
    links: [
      { label: "Guide: SBOM Generation", href: "/moltbot/sbom-generation" },
      { label: "Guide: Vulnerability Scanning", href: "/moltbot/vulnerability-scanning" },
    ],
  },
  {
    id: "ai-threat-model-production",
    title: "Threat Modeling für KI-Agenten-Infrastruktur",
    tag: "AI/ML",
    date: "März 2026",
    summary:
      "Enterprise führte autonome KI-Agenten für interne Prozesse ein. Kein Threat Model existierte. STRIDE-Analyse deckte 14 neue Risiken auf — darunter Model-Exfiltration, Prompt-Replay-Attacks und Credential-Leakage via Tool-Calls.",
    steps: [
      "STRIDE-Threat-Model für jeden KI-Agenten erstellen",
      "Data-Flow-Diagramm: was fliesst in/aus dem LLM?",
      "Risiko-Priorisierung: DREAD-Score pro Finding",
      "Mitigations implementieren: Input-Validation, Output-Filtering",
      "Regelmässige Red-Team-Sessions: LLM-spezifische Angriffe",
    ],
    impact: [
      { metric: "Identifizierte KI-Risiken", before: "0 (kein Model)", after: "14 gefunden, 14 adressiert" },
      { metric: "OWASP LLM Top10 Coverage", before: "0%", after: "100%" },
    ],
    links: [
      { label: "Guide: AI Agent Threat Model", href: "/moltbot/ai-agent-threat-model" },
      { label: "Guide: AI Agent Security", href: "/moltbot/ai-agent-security" },
    ],
  },
  {
    id: "exposed-panel-key-rotation",
    title: "Exposed Admin-Panel + sofortige Key-Rotation",
    tag: "Incident",
    date: "Q4 2025",
    summary:
      "Admin-Panel war öffentlich zugänglich. Mehrere Auth-Fails in Logs entdeckt. Fix: Key-Rotation, Private Subnet-Binding, Origin-Allowlist. MTTR unter 20 Minuten.",
    steps: [
      "API/Telegram-Keys rotieren, alte Tokens sofort invalidieren",
      "Ingress schliessen: deny-by-default, Private Subnet",
      "Origin-Allowlist für WebSocket-Verbindungen aktivieren",
      "Auth-Fail Alerts + Rate-Limits konfigurieren",
    ],
    impact: [
      { metric: "MTTR", before: "> 2h", after: "18 min" },
      { metric: "Auth-Fails/5m", before: "120+", after: "< 3" },
    ],
    links: [
      { label: "Copilot anwenden", href: "/copilot" },
      { label: "Security Check", href: "/securitycheck" },
    ],
  },
  {
    id: "deploy-friction-no-rollback",
    title: "Random Downtime durch fehlende Rollback-Strategie",
    tag: "Reliability",
    date: "Q3 2025",
    summary:
      "Deployments ohne Rollback/Healthchecks verursachten wöchentliche Ausfälle. Fix: Health Endpoints, Blue/Green-Strategie, ENV-Validation in CI, monatliche Restore-Drills.",
    steps: [
      "Healthcheck-Endpoint + Readiness-Gate implementieren",
      "Blue/Green-Deployment mit automatischem Rollback",
      "ENV-Validator als CI-Job einbauen",
      "Monatlicher Restore-Test (Backup ist nur Theorie ohne Test)",
    ],
    impact: [
      { metric: "Failed Deploys", before: "~1/Woche", after: "< 1/Monat" },
      { metric: "Change Failure Rate", before: "11%", after: "2%" },
    ],
    links: [
      { label: "Guide: Backup & DR", href: "/moltbot/backup-recovery-disaster-recovery" },
    ],
  },
  {
    id: "iso27001-gcp-accelerator",
    title: "ISO 27001 auf GCP in 12 Wochen",
    tag: "Compliance",
    date: "Q1 2026",
    summary:
      "ISMS-Scope, Annex A Controls, Logging, DR-Nachweis. Audit-Readiness mit GCP Security Services und SoA-Dokumentation. Von 23 offenen Findings auf null.",
    steps: [
      "ISMS-Scope + Asset-Inventory erstellen",
      "Annex A Controls auf GCP-Services mappen",
      "Cloud Logging + Chronicle SIEM für Nachweis",
      "SoA + Internal Audit + Management-Review",
    ],
    impact: [
      { metric: "Audit Findings", before: "23 offen", after: "0 offen" },
      { metric: "Time-to-Cert", before: "6–9 Monate (Plan)", after: "12 Wochen (erreicht)" },
    ],
    links: [
      { label: "Guide: ISO 27001 Roadmap", href: "/solutions/iso27001-certification-roadmap" },
    ],
  },
  {
    id: "terraform-canary-pipeline",
    title: "Terraform Canary-Deploy-Pipeline",
    tag: "Reliability",
    date: "Q4 2025",
    summary:
      "Canary-Plan/Apply, Policy-as-Code Gates, Drift-Detection, automatischer Rollback bei Metrik-Regression. Change-Failure-Rate von 9% auf 1.5% gesenkt.",
    steps: [
      "Plan-Drift-Check vor jedem Apply",
      "OPA/Conftest Policy-Gates",
      "Canary Apply + automatische Health Checks",
      "Rollback bei Metrik-Regression",
    ],
    impact: [
      { metric: "Change Failure Rate", before: "9%", after: "1.5%" },
      { metric: "Mean MTTR", before: "47 min", after: "8 min" },
    ],
    links: [
      { label: "Guide: DevsecOps Pipeline", href: "/moltbot/devsecops-pipeline" },
      { label: "Runbooks", href: "/runbooks" },
    ],
  },
  {
    id: "cost-explosion-ai-limits",
    title: "Cloud-Kosten durch fehlende Concurrency-Limits",
    tag: "Kosten",
    date: "Q3 2025",
    summary:
      "Root Cause: fehlende Limits, Autoscaling-Defaults und chatty Worker. Fix: Concurrency-Limits, Batching, aggressives Caching, SLO-Observability.",
    steps: [
      "Worker Concurrency hart begrenzen",
      "Requests batchen, Redis-Cache aktivieren",
      "SLO definieren + Budget-Alarm bei Anomalien",
      "Least-Cost-Routing: Regional Endpoints nutzen",
    ],
    impact: [
      { metric: "Cloud Spend (Trend)", before: "+38%/Monat", after: "-26%/Monat" },
      { metric: "P95 Latenz", before: "1.2s", after: "380ms" },
    ],
  },
]

const STATS = [
  { value: "18+", label: "Case Studies" },
  { value: "100%", label: "Anonymisiert" },
  { value: "April 2026", label: "Aktualisiert" },
  { value: "MTTR -74%", label: "Avg. Verbesserung" },
]

export default function CaseStudiesPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const prefix = `/${locale}`

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Security Case Studies 2026",
    url: `${BASE_URL}${prefix}/case-studies`,
    description: "Anonymisierte Security Case Studies zu Incidents, NIS2, KI-Angriffen, Supply Chain und Compliance",
    itemListElement: CASES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${BASE_URL}${prefix}/case-studies#${c.id}`,
    })),
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist eine Security Case Study?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eine Security Case Study beschreibt einen realen Sicherheitsvorfall oder ein Compliance-Projekt anonym und detailliert: Root Cause, Lösungsschritte und messbare Ergebnisse (MTTR, Kosten, Risk Reduction).",
        },
      },
      {
        "@type": "Question",
        name: "Sind die Cases wirklich passiert?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ja — alle Cases basieren auf echten Vorfällen und Projekten aus der ClawGuru-Community. Namen, spezifische Zahlen und identifizierbare Details wurden anonymisiert.",
        },
      },
    ],
  }

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <div className="py-12 md:py-16">

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">&quot;Not a Pentest&quot; Notice</strong>: Alle Cases beschreiben defensive Massnahmen für eigene Systeme. Keine Angriffs-Tools, keine fremde Infrastruktur.
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">Beweise statt Behauptungen</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-100">Security Case Studies 2026</h1>
          <p className="text-lg text-gray-300 mb-8">
            Echte, anonymisierte Vorfälle und Projekte — KI-Angriffe, NIS2, Supply Chain, Ransomware. Klare Runbook-Schritte. Messbare Ergebnisse. Stand: April 2026.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tag Filter Labels */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["Alle", "Incident", "Security", "AI/ML", "Supply Chain", "Compliance", "Kosten", "Reliability"].map((f) => (
            <span
              key={f}
              className="px-3 py-1 rounded-full border border-gray-700 text-xs tracking-wider uppercase text-gray-300 hover:border-cyan-500 cursor-default transition-colors"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {CASES.map((c) => (
            <article id={c.id} key={c.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors flex flex-col">

              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${TAG_COLORS[c.tag]}`}>
                  {c.tag}
                </span>
                <div className="flex items-center gap-2">
                  {c.severity && (
                    <span className="text-xs text-gray-400">{SEVERITY_LABEL[c.severity]}</span>
                  )}
                  <span className="text-xs text-gray-500">{c.date}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-100 mb-3 leading-tight">{c.title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4 flex-1">{c.summary}</p>

              {/* Steps */}
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Runbook-Auszug</div>
                <ul className="space-y-1.5">
                  {c.steps.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact Metrics */}
              {c.impact?.length ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {c.impact.map((m) => (
                    <div key={m.metric} className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">{m.metric}</div>
                      <div className="text-xs">
                        <span className="text-red-400 line-through mr-1.5">{m.before}</span>
                        <span className="text-emerald-400 font-bold">{m.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {c.links?.map((l) => (
                  <a
                    key={l.href}
                    href={`${prefix}${l.href}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-500 text-xs font-semibold text-cyan-400 transition-colors"
                  >
                    {l.label} &rarr;
                  </a>
                ))}
                {!c.links?.length && (
                  <a
                    href={`${prefix}/copilot`}
                    className="px-3 py-1.5 rounded-lg border border-gray-700 hover:border-cyan-500 text-xs font-semibold text-cyan-400 transition-colors"
                  >
                    Copilot anwenden &rarr;
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Further Resources */}
        <section className="mt-12 mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Weiterfuehrende Ressourcen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href={`${prefix}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Security Check</div>
              <div className="text-sm text-gray-300">Scanne dein System jetzt — kostenlos, in Echtzeit.</div>
            </a>
            <a href={`${prefix}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">600+ Runbooks</div>
              <div className="text-sm text-gray-300">Ausfuehrbare Security-Playbooks fuer jede Situation.</div>
            </a>
            <a href={`${prefix}/oracle`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Oracle — Threat Intelligence</div>
              <div className="text-sm text-gray-300">KI-gestuetzte Bedrohungsanalyse in Echtzeit.</div>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-lg font-bold text-gray-100 mb-2">Deinen Case hier einreichen?</div>
          <p className="text-gray-300 text-sm mb-4">
            Schick anonymisierte Logs/Config-Snippets (ohne Secrets). Wir bauen daraus ein Runbook und — auf Wunsch — eine vollstaendige Case Study. 100% anonym, kein Unternehmensname ohne Zustimmung.
          </p>
          <a href={`${prefix}/copilot`} className="inline-block px-5 py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors text-sm">
            Case einreichen via Copilot &rarr;
          </a>
        </div>

      </div>
    </Container>
  )
}
