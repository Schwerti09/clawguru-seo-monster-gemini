import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import { BASE_URL } from "@/lib/config"

export const metadata: Metadata = {
  title: "Emergency Security Response | ClawGuru – Log4j Check, Ransomware Runbook",
  description:
    "IT security incident? Get instant access to Log4j quick check, ransomware runbook, incident response playbooks, and more. ClawGuru Day Pass – active within 60 seconds.",
  keywords: [
    "Log4j quick check",
    "Log4j vulnerability check",
    "ransomware runbook download",
    "ransomware incident response",
    "security incident emergency",
    "emergency incident response playbook",
    "CVE quick check",
    "IT security emergency",
    "security breach response",
    "incident runbook",
  ].join(", "),
  alternates: { canonical: "/emergency" },
  openGraph: {
    title: "Emergency Security Response – ClawGuru Day Pass",
    description:
      "Security is on fire? Get instant 24h access to all runbooks, checks, and copilot. No subscription approval needed.",
    url: `${BASE_URL}/emergency`,
    type: "website",
  },
}

const EMERGENCY_SCENARIOS = [
  {
    icon: "🔥",
    keyword: "Log4j / Log4Shell",
    headline: "Log4j Quick Check",
    steps: [
      "Expose-Check via Security Score (30 Sekunden)",
      "Log4Shell Runbook: Scanning, Patching, Verifikation",
      "Config Validator: JVM-Flags & WAF-Rules prüfen",
      "Copilot: Stack-spezifisches Patch-Runbook generieren",
    ],
  },
  {
    icon: "💀",
    keyword: "Ransomware",
    headline: "Ransomware Runbook",
    steps: [
      "Sofort: Instanz offline, Firewall dicht, Ports schließen",
      "Runbook: Isolierung → Backup-Prüfung → Recovery",
      "Key Rotation & Session Invalidation (Vault)",
      "Logs sichern & forensische Spurensicherung",
    ],
  },
  {
    icon: "🔑",
    keyword: "Exposed API Keys / Secrets",
    headline: "API Key Leak Response",
    steps: [
      "Sofortiger Key Rotate über Vault (1-Click Runbook)",
      "Git-Repo Scan auf exposed Secrets",
      "Webhooks & Token invalidieren",
      "Copilot: Rotation-Skript für deinen Stack",
    ],
  },
  {
    icon: "🌐",
    keyword: "Server Breach / Intrusion",
    headline: "Server Intrusion Runbook",
    steps: [
      "Admin-Ports schließen, VPN-only Modus",
      "Auth-Log Analyse & verdächtige Sessions markieren",
      "SSH-Hardening Runbook (sofort einsetzbar)",
      "Mission Control: Live-Monitoring nach Remediation",
    ],
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie schnell bekomme ich Zugang für ein Security-Incident?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Der Day Pass ist innerhalb von 60 Sekunden aktiv: Stripe Checkout → /success → Aktivierung → Sofortzugang zu allen Runbooks, Copilot und Tools.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es ein Log4j Quick-Check Runbook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Mit Day Pass-Zugang kannst du sofort den Log4Shell Runbook aufrufen, den Config Validator für JVM-Flags nutzen und per Copilot ein stack-spezifisches Patch-Runbook generieren.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es ein Ransomware Runbook zum Download?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja. Der Vault enthält sofort einsetzbare Ransomware-Response Runbooks: Isolierung, Backup-Prüfung, Recovery-Schritte und forensische Spurensicherung – alles mit Day Pass zugänglich.",
      },
    },
    {
      "@type": "Question",
      name: "Brauche ich ein Abo oder Account-Approval?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nein. Der Day Pass kostet 9€ einmalig, kein Abo, kein Account nötig. Zugang wird direkt im Browser freigeschaltet (Token). Ideal wenn du keine Buchhaltungs-Approval abwarten kannst.",
      },
    },
  ],
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512.png`,
  foundingDate: "2024",
  description: "ClawGuru baut Ops- und Security-Command-Center für Self-Hosted-Teams und AI-Agent-Infrastruktur mit 15+ Jahren Erfahrung in Incident Response.",
  sameAs: [
    "https://github.com/clawguru",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "emergency",
    telephone: "+49-000-000",
    email: "security@clawguru.org",
    areaServed: ["DE", "AT", "CH", "EU"],
    availableLanguage: ["German", "English"],
  },
}

export default function EmergencyPage() {
  return (
    <main className="min-h-screen bg-[#05060A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-10 px-4">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{
              borderColor: "rgba(220,38,38,0.4)",
              color: "#f87171",
              background: "rgba(220,38,38,0.08)",
            }}
          >
            🔥 E-E-A-T · EMERGENCY RESPONSE
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            Security Incident?<br />
            <span style={{ color: "#f87171" }}>Sofort handeln.</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            15+ Jahre Erfahrung in Incident Response. Log4j-Check, Ransomware Runbook, Key Rotation, Intrusion Response – alles sofort verfügbar. Day Pass: aktiv in 60 Sekunden, kein Abo-Approval nötig.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-cyan-400">15+</div>
              <div className="text-xs text-gray-400 mt-1">Jahre Erfahrung</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-400">4,200+</div>
              <div className="text-xs text-gray-400 mt-1">AI Runbooks</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-fuchsia-400">10+</div>
              <div className="text-xs text-gray-400 mt-1">Spezialisten</div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-yellow-400">24/7</div>
              <div className="text-xs text-gray-400 mt-1">Incident Response</div>
            </div>
          </div>

          {/* Social Proof Counter */}
          <div className="mt-4 max-w-lg mx-auto">
            <SocialProofCounter variant="compact" />
          </div>

          {/* Day Pass CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <BuyButton
              product="daypass"
              label="🔥 Day Pass kaufen – Sofortzugang (9€)"
              className="py-4 px-8 rounded-2xl font-black text-base text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                boxShadow: "0 0 40px rgba(220,38,38,0.4)",
              }}
            />
            <a
              href="/security/notfall-leitfaden"
              className="py-4 px-8 rounded-2xl font-black text-sm border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all duration-200"
            >
              Notfall-Leitfaden (kostenlos) →
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Sofortzugang · kein Abo · kein Account · Zugang via /recover wiederherstellbar
          </p>
        </div>
      </section>

      <Container>
        <div className="pb-20 max-w-5xl mx-auto">

          {/* Emergency Scenarios */}
          <div className="mt-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-6 text-center">
              Häufige Incidents · Was du mit Day Pass sofort tun kannst
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {EMERGENCY_SCENARIOS.map((scenario) => (
                <div
                  key={scenario.keyword}
                  className="rounded-2xl border border-white/8 p-6"
                  style={{ background: "rgba(220,38,38,0.04)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" aria-hidden="true">{scenario.icon}</span>
                    <div>
                      <div
                        className="text-[10px] font-mono uppercase tracking-widest mb-0.5"
                        style={{ color: "#f87171" }}
                      >
                        {scenario.keyword}
                      </div>
                      <div className="font-black text-white text-base">{scenario.headline}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {scenario.steps.map((step) => (
                      <li key={step} className="flex items-start gap-2 text-sm text-gray-300">
                        <span
                          className="mt-[2px] shrink-0 size-[16px] rounded-full flex items-center justify-center text-[8px] font-bold"
                          style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}
                          aria-hidden="true"
                        >
                          →
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* What's included */}
          <div
            className="mt-10 rounded-3xl border p-8"
            style={{
              borderColor: "rgba(220,38,38,0.2)",
              background: "rgba(220,38,38,0.04)",
            }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-gray-500 mb-4">
              Day Pass · 24h Vollzugriff für 9€
            </div>
            <h2 className="text-2xl font-black text-white mb-4">
              Was du sofort bekommst
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                "500+ Runbooks & Incident Playbooks (Vault)",
                "Log4Shell, CVE, Ransomware Runbooks",
                "Security Score – Top-Risiken in 30 Sek.",
                "Copilot: KI-Runbook für deinen Stack",
                "Config Validator: Docker, Nginx, YAML",
                "Key Rotation Runbooks (Vault)",
                "OpsWall Live – aktuelle Threats",
                "ThreatMap – Real-Time Visualisierung",
                "Mission Control Dashboard",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-200 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <span
                    className="mt-[2px] shrink-0 size-[16px] rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <BuyButton
                product="daypass"
                label="Day Pass kaufen (9€) → Sofortzugang"
                className="py-3 px-7 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                  boxShadow: "0 0 25px rgba(220,38,38,0.3)",
                }}
              />
              <span className="text-xs text-gray-500">
                Sofortzugang · kein Abo · Zahlung via Stripe
              </span>
            </div>
          </div>

          {/* FAQ */}
          <div
            className="mt-10 rounded-3xl border border-white/10 p-8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">FAQ</div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-300">
              {faqJsonLd.mainEntity.map((q) => (
                <div key={q.name}>
                  <div className="font-semibold text-white">{q.name}</div>
                  <p className="mt-1 text-gray-400">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* E-E-A-T Signals */}
          <div
            className="mt-10 rounded-3xl border border-white/10 p-8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">Warum wir vertrauenswürdig sind</div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Experience",
                  desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                  color: "text-cyan-400",
                },
                {
                  title: "Expertise",
                  desc: "4,200+ AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.",
                  color: "text-emerald-400",
                },
                {
                  title: "Authoritativeness",
                  desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                  color: "text-fuchsia-400",
                },
                {
                  title: "Trustworthiness",
                  desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                  color: "text-yellow-400",
                },
              ].map((item) => (
                <div key={item.title} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className={`font-bold ${item.color} text-sm mb-2`}>{item.title}</div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            {[
              ["/check", "Security Check"],
              ["/runbooks", "Runbooks & Playbooks"],
              ["/copilot", "Copilot (KI-Runbook)"],
              ["/vault/key-rotation", "Key Rotation"],
              ["/security/notfall-leitfaden", "Notfall-Leitfaden"],
              ["/recover", "Zugang recover"],
              ["/pricing", "Alle Pläne"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200"
              >
                {label}
              </a>
            ))}
          </div>

        </div>
      </Container>
    </main>
  )
}
