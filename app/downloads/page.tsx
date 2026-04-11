import Container from "@/components/shared/Container"

export const metadata = {
  title: "Premium Security Downloads 2026 | ClawGuru",
  description:
    "4 exklusive Mega-Premium Downloads: OpenClaw Fortress Blueprint, Zero-Trust Arsenal, AI Threat Intelligence Kit & IR Warfare Manual. Gratis für Self-Hoster.",
  alternates: { canonical: "/downloads" }
}

const DOWNLOADS = [
  {
    id: "openclaw-fortress-blueprint",
    icon: "🏰",
    badge: "EXKLUSIV",
    badgeColor: "text-cyan-400 border-cyan-400",
    title: "OpenClaw Fortress Blueprint 2026",
    subtitle: "Das tiefste OpenClaw-Hardening-Dokument weltweit",
    file: "OpenClaw-Fortress-Blueprint-2026-v1.0.zip",
    size: "ca. 28 MB",
    format: "ZIP (PDF + Bash Scripts + YAML)",
    highlights: [
      "68-seitiges professionelles PDF (Dark Mode, Neon-Akzente)",
      "22 executable Runbooks als Markdown + Copy-Paste Bash Scripts",
      "Fertige Docker-Compose Security Templates (Traefik, Caddy, Nginx)",
      "Konfigurations-Checklisten + Security Scoring System",
      "Bonus: 1-Klick Hardening Scripts für Hetzner, Contabo, VPS",
    ],
    accentBorder: "border-cyan-700",
    accentBg: "from-cyan-950/40",
    btnClass: "bg-cyan-500 hover:bg-cyan-400 text-black",
    href: "/api/downloads/openclaw-fortress-blueprint-2026",
  },
  {
    id: "zero-trust-arsenal",
    icon: "🛡️",
    badge: "TOOLKIT",
    badgeColor: "text-blue-400 border-blue-400",
    title: "Zero-Trust Self-Hosting Arsenal 2026",
    subtitle: "Enterprise-Toolkit, jetzt kostenlos für Self-Hoster",
    file: "Zero-Trust-Self-Hosting-Arsenal-2026.zip",
    size: "ca. 41 MB",
    format: "ZIP (HTML + JS + Templates)",
    highlights: [
      "Offline-fähiger ClawGuru Live Security Check (HTML + JS)",
      "8 spezialisierte Nuclei + Nmap Templates für Self-Hosting",
      "Vault + Bitwarden + Passkey Templates",
      "Network Segmentation Guide + Firewall Rulesets",
      "Secret Scanning Tool (lokal lauffähig) + HTML-Report Export",
    ],
    accentBorder: "border-blue-700",
    accentBg: "from-blue-950/40",
    btnClass: "bg-blue-500 hover:bg-blue-400 text-white",
    href: "/api/downloads/zero-trust-self-hosting-arsenal-2026",
  },
  {
    id: "moltbot-threat-intelligence",
    icon: "🤖",
    badge: "AI & THREAT",
    badgeColor: "text-purple-400 border-purple-400",
    title: "Moltbot & AI Agent Threat Intelligence Kit",
    subtitle: "Tiefes AI-Agent Threat Modeling – nirgendwo sonst kostenlos",
    file: "Moltbot-AI-Agent-Threat-Intelligence-Kit-2026.zip",
    size: "ca. 19 MB",
    format: "ZIP (Excel + Markdown + PDF)",
    highlights: [
      "Interaktives Threat Model Template (Excel + Notion Duplicate Link)",
      "14 fertige AI-Agent Kill Chain Modelle",
      "Automatischer Runbook Generator (Markdown Vorlagen)",
      "Prompt-Injection + Model-Poisoning Defense Playbooks",
      "Real-World Case Studies 2025/2026",
    ],
    accentBorder: "border-purple-700",
    accentBg: "from-purple-950/40",
    btnClass: "bg-purple-500 hover:bg-purple-400 text-white",
    href: "/api/downloads/moltbot-ai-threat-intelligence-kit-2026",
  },
  {
    id: "ir-warfare-manual",
    icon: "⚔️",
    badge: "INCIDENT RESPONSE",
    badgeColor: "text-orange-400 border-orange-400",
    title: "Self-Hosted Incident Response Warfare Manual",
    subtitle: "Echte Kriegshandbücher für Self-Hoster – keine generischen Templates",
    file: "Self-Hosted-IR-Warfare-Manual-2026.zip",
    size: "ca. 34 MB",
    format: "ZIP (Markdown + PDF + Scripts)",
    highlights: [
      "18 echte Incident Response Playbooks (Markdown + PDF)",
      "Step-by-Step Anleitungen für häufigste Self-Hosting Zwischenfälle",
      "Decision Trees + Checklisten",
      "Post-Mortem Template + Lessons Learned Vorlage",
      "Forensik-Ready Scripts (Log Extraction, Memory Dump etc.)",
    ],
    accentBorder: "border-orange-700",
    accentBg: "from-orange-950/40",
    btnClass: "bg-orange-500 hover:bg-orange-400 text-black",
    href: "/api/downloads/self-hosted-ir-warfare-manual-2026",
  },
]

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-gray-950 to-blue-950/20 pointer-events-none" />
        <Container>
          <div className="py-20 max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-cyan-900/40 border border-cyan-700 rounded-full px-4 py-1.5 text-sm text-cyan-300 font-semibold mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse inline-block" />
              4 Mega-Premium Downloads — 100% kostenlos
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-gray-100 leading-tight">
              Security Ressourcen,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                die sonst keiner teilt
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Professionelle Hardening-Dokumente, Toolkits und Playbooks — entwickelt von Security-Experten für Self-Hoster. Kein Spam, keine Paywall.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300">
                🔒 Exklusiv bei ClawGuru
              </span>
              <span className="bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300">
                📥 Bereits von 1.847 Self-Hostern heruntergeladen
              </span>
              <span className="bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-gray-300">
                🛡️ Kein Account erforderlich
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Download Cards */}
      <Container>
        <div className="py-16 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {DOWNLOADS.map((dl) => (
              <div
                key={dl.id}
                className={`rounded-2xl border ${dl.accentBorder} bg-gradient-to-br ${dl.accentBg} to-gray-900 p-6 flex flex-col`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{dl.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`inline-block text-xs font-bold border rounded px-2 py-0.5 mb-2 ${dl.badgeColor}`}>
                      {dl.badge}
                    </div>
                    <h2 className="text-xl font-black text-gray-100 leading-snug">{dl.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{dl.subtitle}</p>
                  </div>
                </div>

                <div className="font-mono text-xs text-gray-500 mb-3 truncate">📁 {dl.file}</div>
                <div className="flex gap-3 text-xs mb-5">
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-gray-300">{dl.size}</span>
                  <span className="bg-gray-800 border border-gray-700 rounded px-2 py-0.5 text-gray-300">{dl.format}</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {dl.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-cyan-500 mt-0.5 flex-shrink-0">✓</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <a
                  href={dl.href}
                  className={`w-full text-center font-black text-base rounded-xl px-6 py-3 transition-all ${dl.btnClass} shadow-lg`}
                >
                  ↓ Jetzt herunterladen
                </a>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-800 p-8 text-center">
            <div className="text-3xl mb-3">⚡</div>
            <h2 className="text-2xl font-black text-gray-100 mb-3">
              Direkt nach dem Download: Wie sicher ist dein System?
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Nutze den kostenlosen Live Security Check von ClawGuru — analysiere deine HTTP-Header, erhalte einen Security-Score und konkrete Handlungsempfehlungen in Sekunden.
            </p>
            <a
              href="/securitycheck"
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg rounded-xl px-8 py-4 transition-colors shadow-xl"
            >
              🔍 Kostenloser Live Security Check →
            </a>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>✓ Keine Registrierung</span>
              <span>✓ Sofort-Ergebnis</span>
              <span>✓ DSGVO-konform</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
