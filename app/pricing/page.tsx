import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"

export const metadata = {
  title: "Day Pass | ClawGuru – Sofortzugang für Security Incidents",
  description:
    "Security Incident? Day Pass: 24h Vollzugriff auf alle Runbooks, Log4j-Check, Ransomware Playbooks, Copilot & mehr. Einmal zahlen, sofort loslegen – kein Abo-Approval nötig.",
  keywords:
    "Day Pass Security, Log4j quick check, Ransomware runbook download, incident response sofort, Security Notfall Zugang, CVE check, emergency runbook",
  alternates: { canonical: "/pricing" }
}

type Feature = { label: string; isNew?: boolean }
type FeatureGroup = { heading: string; items: Feature[] }

function FeatureList({ groups }: { groups: FeatureGroup[] }) {
  return (
    <div className="mt-5 space-y-4">
      {groups.map((g) => (
        <div key={g.heading}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">
            {g.heading}
          </div>
          <ul className="space-y-[7px]">
            {g.items.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm text-gray-200">
                <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: "rgba(0,255,157,0.12)", color: "#00ff9d" }} aria-hidden="true">✓</span>
                <span className="leading-snug">
                  {item.label}
                  {item.isNew && (
                    <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-[6px] py-[2px] rounded-full align-middle"
                      style={{ background: "rgba(0,184,255,0.18)", color: "#00b8ff" }}>
                      NEU
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const DAY_PASS_GROUPS: FeatureGroup[] = [
  {
    heading: "Security & Analyse",
    items: [
      { label: "Live Security Score – Top-3-Risiken in 30 Sekunden" },
      { label: "Zero-Knowledge Check (privacy-first)", isNew: true },
      { label: "Config Validator: Docker, Nginx, YAML", isNew: true },
      { label: "Security Badge Generator (shareable)" },
    ]
  },
  {
    heading: "Ops & Monitoring",
    items: [
      { label: "OpsWall Live – Trends & Hot Fixes in Echtzeit" },
      { label: "ThreatMap – Real-Time Threat Visualisierung", isNew: true },
      { label: "Mission Control Dashboard", isNew: true },
      { label: "Incident Playbooks (sofort einsetzbar)" },
    ]
  },
  {
    heading: "Wissen & Runbooks",
    items: [
      { label: "Vault: 500+ Runbooks & Blueprints" },
      { label: "Hardening, Recovery, Stripe/Webhooks & mehr" },
      { label: "Copilot Chat – KI-Assistent für Debug & Ops" },
    ]
  },
]

const PRO_GROUPS: FeatureGroup[] = [
  {
    heading: "Alles aus Day Pass",
    items: [
      { label: "Dauerhafter Vollzugriff (kein Ablauf)" },
      { label: "Alle Security- & Ops-Tools ohne Zeitlimit" },
    ]
  },
  {
    heading: "Intelligence Layer",
    items: [
      { label: "Temporal Intelligence – zeitbasierte Threats", isNew: true },
      { label: "Neuro Intelligence – KI-getriebene Insights", isNew: true },
      { label: "ClawVerse – semantischer Wissensgraph", isNew: true },
      { label: "Living Mycelium – 1M+ Knowledge Nodes", isNew: true },
    ]
  },
  {
    heading: "Deployment & Tracking",
    items: [
      { label: "SWARM Deployment Simulator", isNew: true },
      { label: "Provenance Chain – Source-Tracking", isNew: true },
      { label: "Issue Tracker + Fix Repository", isNew: true },
    ]
  },
  {
    heading: "Pro-Extras",
    items: [
      { label: "Pro Runbooks – laufende Updates" },
      { label: "Copilot: höhere Limits (fair-use)" },
      { label: "Priority: neue Features & Topics zuerst" },
    ]
  },
]

const TEAM_GROUPS: FeatureGroup[] = [
  {
    heading: "Alles aus Pro",
    items: [
      { label: "Vollzugriff auf alle Intelligence- & Ops-Layer" },
      { label: "Alle SWARM-, Neuro- & Provenance-Features" },
    ]
  },
  {
    heading: "Team-Collaboration",
    items: [
      { label: "Gemeinsame Runbook-Links & Playbooks", isNew: true },
      { label: "Shared Mission Control (Team-Dashboard)", isNew: true },
      { label: "Höhere Limits für alle Mitglieder (fair-use)" },
    ]
  },
  {
    heading: "Roadmap & Einfluss",
    items: [
      { label: "Roadmap Votes – bestimmt was als nächstes gebaut wird" },
      { label: "Early Access auf neue Features" },
    ]
  },
]

const ENTERPRISE_GROUPS: FeatureGroup[] = [
  {
    heading: "Alles aus Teams",
    items: [
      { label: "Vollzugriff auf alle Pro- & Teams-Features" },
    ]
  },
  {
    heading: "Intel Feed API",
    items: [
      { label: "REST/JSON API – direkt in SIEM integrierbar", isNew: true },
      { label: "API Key Authentifizierung (Bearer / X-API-Key)", isNew: true },
      { label: "Filter nach Severity & Kategorie", isNew: true },
      { label: "Maschinenlesbare Timestamps & Tags (STIX-kompatibel)", isNew: true },
    ]
  },
  {
    heading: "Enterprise Support",
    items: [
      { label: "Dedizierter API-Schlüssel (revocable)", isNew: true },
      { label: "SLA-Garantie & Priority Support" },
      { label: "Custom Onboarding & Integration Calls" },
    ]
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,184,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}>
            Zugang · Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            Wähle deinen Zugang
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Day Pass für akute Incidents – sofort, ohne Abo-Approval.<br className="hidden sm:block" />
            Pro für dauerhaften Zugriff. Teams für Zusammenarbeit.
          </p>
          {/* Emergency nudge */}
          <div className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border"
            style={{ borderColor: "rgba(220,38,38,0.35)", color: "#f87171", background: "rgba(220,38,38,0.06)" }}>
            🔥 Security Incident? <a href="/emergency" className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">→ Sofort-Zugang für Notfälle</a>
          </div>
        </div>
      </section>

      <Container>
        <div className="pb-20">

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">

            {/* ── Day Pass ── */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,184,255,0.5) 0%, rgba(0,184,255,0.05) 100%)" }}>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0a0f18" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#00b8ff" }}>
                      Einmalig · 24h
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Day Pass</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.08)" }}>
                    24h Access
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">7€</span>
                  <span className="text-sm text-gray-400 pb-2">einmalig</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  Brennt gerade was? Log4j, Ransomware, exposed Keys – 24 Stunden Vollzugriff
                  auf alle Runbooks, Copilot, OpsWall, Vault, ThreatMap & Mission Control.
                  Sofort aktiv nach Zahlung, kein Abo-Approval nötig.
                </p>

                <FeatureList groups={DAY_PASS_GROUPS} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="daypass"
                    label="Day Pass kaufen (7€) → Stripe"
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #00b8ff 0%, #0077ff 100%)", boxShadow: "0 0 30px rgba(0,184,255,0.3)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Sofortzugang · kein Abo · Zugang via /recover wiederherstellbar
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pro ── (most popular) */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(0,255,157,0.3) 100%)" }}>
              {/* Popular badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full text-black"
                style={{ background: "linear-gradient(90deg, #00ff9d, #00b8ff)" }}>
                Beliebtester Plan
              </div>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0d0a18" }}>
                <div className="flex items-start justify-between gap-3 mt-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#a78bfa" }}>
                      Abo · monatlich
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Pro</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.1)" }}>
                    Pro
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">14,99€</span>
                  <span className="text-sm text-gray-400 pb-2">/ Monat</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  Dauerhafter Vollzugriff auf alle Tools – plus Intelligence Layer, SWARM, Temporal &amp;
                  den kompletten ClawVerse-Wissensgraph. Kündbar jederzeit.
                </p>

                <FeatureList groups={PRO_GROUPS} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="pro"
                    label="Pro starten (14,99€/Monat) → Stripe"
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #a78bfa 0%, #00ff9d 100%)", boxShadow: "0 0 30px rgba(139,92,246,0.35)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Kündbar jederzeit · Abo-Status via Stripe geprüft
                  </div>
                </div>
              </div>
            </div>

            {/* ── Teams ── */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,255,157,0.4) 0%, rgba(0,255,157,0.05) 100%)" }}>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#080f0c" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#00ff9d" }}>
                      Abo · Teams
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Teams</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,255,157,0.3)", color: "#00ff9d", background: "rgba(0,255,157,0.06)" }}>
                    Teams
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">29,99€</span>
                  <span className="text-sm text-gray-400 pb-2">/ Monat</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  Für kleine Teams, die gemeinsam deployen, recovern und keine Lust auf Chaos-Docs haben.
                  Shared Mission Control, Team-Playbooks, alle Pro-Features. Kündbar jederzeit.
                </p>

                <FeatureList groups={TEAM_GROUPS} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="team"
                    label="Teams starten (29,99€/Monat) → Stripe"
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-white border transition-all duration-300 hover:bg-white/5 disabled:opacity-60"
                    style={{ borderColor: "rgba(0,255,157,0.4)", boxShadow: "0 0 20px rgba(0,255,157,0.1)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Kündbar jederzeit · Abo-Status via Stripe geprüft
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Enterprise API ── */}
          <div id="enterprise" className="mt-10 relative rounded-3xl p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,165,0,0.6) 0%, rgba(255,80,0,0.2) 100%)" }}>
            <div className="rounded-3xl p-8" style={{ background: "#0f0a05" }}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                {/* Left: header + price */}
                <div className="lg:w-64 shrink-0">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#ffaa00" }}>
                    Enterprise · API
                  </div>
                  <div className="text-2xl font-black text-white font-heading">ClawGuru Enterprise</div>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-black text-white">299€</span>
                    <span className="text-sm text-gray-400 pb-2">/ Monat</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    Direkter REST/JSON-Feed für euer SIEM, SOC oder eigenes Monitoring-Backend.
                    API-Key-Auth, maschinenlesbare Events – kein manuelles Klicken mehr.
                  </p>
                  <a
                    href="mailto:enterprise@clawguru.org?subject=Enterprise%20Intel%20Feed%20API"
                    className="mt-6 inline-block w-full text-center py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)", boxShadow: "0 0 30px rgba(255,165,0,0.3)" }}
                  >
                    Enterprise anfragen →
                  </a>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Kontakt: enterprise@clawguru.org
                  </div>
                </div>

                {/* Right: features */}
                <div className="flex-1">
                  <FeatureList groups={ENTERPRISE_GROUPS} />

                  {/* API quick-start snippet */}
                  <div className="mt-6 rounded-2xl border border-orange-900/40 bg-black/40 p-4">
                    <div className="text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-3">
                      API Quick-Start
                    </div>
                    <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`# Alle High-Severity Events abrufen
curl https://clawguru.com/api/intel/feeds \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G --data-urlencode "severity=high"

# Response (JSON – direkt in SIEM importierbar)
{
  "object": "list",
  "total": 3,
  "updatedAt": "2026-02-20T12:00:00Z",
  "items": [
    {
      "id": "inc-001",
      "title": "Exposed Gateway → Token Leakage",
      "severity": "high",
      "category": "exposure",
      "when": "2026-02-20T00:00:00Z",
      "actions": [...],
      "tags": ["gateway", "token", "firewall"]
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              ["⚡ Sofortzugang", "Stripe Checkout → /success → Aktivierung → Dashboard. Dauert unter 60 Sekunden."],
              ["🔑 Kein Account nötig", "Dein Zugang wird direkt im Browser freigeschaltet (Token). Kein Passwort, kein Onboarding."],
              ["🔄 Zahlung hakt?", "Geh auf /recover und gib deine Stripe Session-ID ein. Zugang sofort aktiv."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/8 p-5"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="font-semibold text-white text-sm">{title}</div>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12 rounded-3xl border border-white/10 p-8" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">FAQ</div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-300">
              <div>
                <div className="font-semibold text-white">Wie lange gilt der Zugriff?</div>
                <p className="mt-1 text-gray-400">Day Pass: 24 Stunden ab Aktivierung. Pro/Teams: solange das Abo aktiv ist.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Kann ich den Zugang übertragen?</div>
                <p className="mt-1 text-gray-400">Der Day Pass ist an deinen Browser-Token gebunden. Für Teams kommen später echte Accounts.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Was, wenn Stripe bezahlt, aber ich sehe nichts?</div>
                <p className="mt-1 text-gray-400">Geh auf /recover und gib die Checkout Session-ID oder Payment Intent-ID ein. Das aktiviert den Zugang erneut.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Kann ich kündigen?</div>
                <p className="mt-1 text-gray-400">Day Pass ist einmalig. Pro/Teams sind Abos und können jederzeit in Stripe gekündigt werden.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Was ist neu im Pro-Plan?</div>
                <p className="mt-1 text-gray-400">Temporal Intelligence, Neuro Intelligence, ClawVerse, Living Mycelium, SWARM Deployment Simulator, Provenance Chain und Issue Tracker sind neu hinzugekommen.</p>
              </div>
              <div>
                <div className="font-semibold text-white">Was versteht ClawGuru unter &quot;Intelligence Layer&quot;?</div>
                <p className="mt-1 text-gray-400">Zeitbasierte Threats (Temporal), KI-Insights (Neuro), semantischer Wissensgraph (ClawVerse) – echte operative Intelligenz statt statischer Docs.</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            {[
              ["/check", "Security Check"],
              ["/score", "Score + Badge"],
              ["/runbooks", "Runbooks"],
              ["/live", "OpsWall Live"],
              ["/mission-control", "Mission Control"],
              ["/threatmap", "ThreatMap"],
              ["/recover", "Zugang recover"],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200">
                {label}
              </a>
            ))}
          </div>

        </div>
      </Container>
    </main>
  )
}
