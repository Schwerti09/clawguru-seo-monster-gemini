// Mission Control – Analyse (2026-03)
// Sichtbare Elemente & Struktur:
// - Diese Seite ist derzeit eine statische Erläuterung (Definition, 3 Info-Karten).
// - Kein Tab/Sidebar‑Gerüst, keine API‑Anbindung.
// Verwandte Seiten:
// - app/dashboard/page.tsx rendert <DashboardClient/> mit modularen Tiles (Gating, Buttons).
//   Datenverbindungen: Stripe‑Checkout, Live‑Wall, Tier‑Abfrage (/api/auth/tier), diverse Platzhalter.
//   Layout: Tailwind, Kartenraster, Glassmorphism.
// - app/admin/dashboard/page.tsx lädt <UniverseDashboard/> (Admin‑Cockpit)
//   Datenverbindungen: Admin‑Cookie, Stripe/Gemini/Index‑Status u.a. im Client; modulare Cards/Drawer.
// Fazit:
// - Für das zentrale Command Center ist eine neue Seite mit Tabs/Sidebar sinnvoll.
//   Die existierende Mission‑Control‑Seite bleibt als Intro bestehen.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist ClawGuru Mission Control?', acceptedAnswer: { '@type': 'Answer', text: 'Mission Control ist das zentrale Ops-Dashboard von ClawGuru: Echtzeit-Überblick über alle überwachten Domains und deren Security-Scores. Integrierte Runbook-Ausführung. Alert-Management (kritische CVEs, Score-Verschlechterungen). Compliance-Status-Übersicht (NIS2, SOC2, ISO27001). Team-Kollaboration: gemeinsame Runbook-Ausführung mit Approval-Workflows. Audit-Trail aller Aktionen.' } },
    { '@type': 'Question', name: 'Wie richte ich Mission Control für mein Team ein?', acceptedAnswer: { '@type': 'Answer', text: 'Mission Control Team-Setup: 1) Enterprise/Team-Account erstellen. 2) Team-Mitglieder einladen (E-Mail-Einladung). 3) Rollen zuweisen (Admin, Operator, Viewer). 4) Domains hinzufügen (manuell oder über API). 5) Alert-Schwellwerte konfigurieren (Score < 75 → Alert). 6) Approval-Workflows einrichten (kritische Runbooks: 4-Augen-Prinzip). 7) SIEM-Integration aktivieren (Syslog, Splunk, Elastic). Setup-Zeit: ca. 30 Minuten.' } },
    { '@type': 'Question', name: 'Welche Integrationen unterstützt Mission Control?', acceptedAnswer: { '@type': 'Answer', text: 'Mission Control Integrationen: Alerting: PagerDuty, OpsGenie, Slack, MS Teams, E-Mail. SIEM: Splunk, Elastic SIEM, Microsoft Sentinel, Grafana Loki. Ticketing: Jira, GitHub Issues, Linear. CI/CD: GitHub Actions, GitLab CI (Score-Gate). Chat: Slack-Bot für Score-Updates und Runbook-Approval. API: REST + Webhooks für Custom-Integrationen. SSO: SAML 2.0, OIDC (Okta, Azure AD, Google Workspace).' } },
    { '@type': 'Question', name: 'Wie erhalte ich Alerts wenn sich der Security Score verschlechtert?', acceptedAnswer: { '@type': 'Answer', text: 'Mission Control Alerts konfigurieren: Dashboard → Settings → Alerts. Alert-Typen: Score-Drop (z.B. Score fällt unter 75). New Critical CVE für überwachte Komponenten. Compliance-Drift (neues Finding verletzt Policy). Runbook-Fehlschlag. Kanäle: E-Mail, Slack, PagerDuty, Webhook. Frequenz: sofort (real-time), täglich digest, wöchentlicher Report. Pro-Plan: bis 10 Alert-Regeln. Enterprise: unbegrenzt.' } },
  ],
}

export default function MissionControl() {
  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Definition"
          title="Mission Control"
          subtitle="Die operative Schicht zwischen Code und Produktion: Security, Monitoring, Governance, Kostenkontrolle."
        />

        <div className="space-y-6">
          {[
            ["Warum es nötig ist", "OpenClaw ist mächtig. Production ist brutal. Ohne Sichtbarkeit = Incident."],
            ["Was wir liefern", "Tools, Runbooks, Intel, Sprints – alles auf Handlung optimiert."],
            ["Wie du es nutzt", "Copilot → Sprint → Vault → Lagebericht. Wiederkehr statt einmal lesen."]
          ].map(([t, d]) => (
            <div key={t} className="p-6 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black text-xl mb-2">{t}</div>
              <div className="text-gray-300">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
