type Props = { prefix?: string; locale?: string }

const TOOLS_DE = [
  {
    id: "summon",
    emoji: "🔴",
    name: "Summon",
    tagline: "Emergency Runbooks on Demand",
    desc: "Summon liefert sofort einsatzbereite Incident-Response-Runbooks für jeden Stack und jeden Angriffsvektor. Keine Suche, kein Raten – direkt der richtige Schritt im richtigen Moment.",
    keywords: ["Incident Response", "Emergency Runbooks", "SecOps"],
    href: "/summon",
  },
  {
    id: "oracle",
    emoji: "🔮",
    name: "Oracle",
    tagline: "Security-Analyse & Risikoeinschätzung",
    desc: "Oracle analysiert Konfigurationen, Logs und Infrastruktur-Beschreibungen und liefert eine priorisierte Risikoeinschätzung mit konkreten Handlungsempfehlungen – nicht nur Warnungen.",
    keywords: ["Risk Assessment", "Security Analysis", "Vulnerability Management"],
    href: "/oracle",
  },
  {
    id: "neuro",
    emoji: "🧬",
    name: "Neuro",
    tagline: "KI-Copilot für Security-Operationen",
    desc: "Neuro ist der kontextbewusste KI-Assistent für SecOps-Fragen. Beschreibe dein Problem in natürlicher Sprache – Neuro liefert präzise, ausführbare Lösungsschritte für deinen exakten Stack.",
    keywords: ["AI Security Copilot", "Security Automation", "DevSecOps"],
    href: "/neuro",
  },
  {
    id: "mycelium",
    emoji: "🍄",
    name: "Mycelium",
    tagline: "Das lebendige Runbook-Netzwerk",
    desc: "Über 4,2 Millionen Runbooks, semantisch vernetzt durch die Mycelial Engine. Finde exakt die Lösung, die zu deinem Stack passt – inklusive verwandter Runbooks, Patterns und Best Practices.",
    keywords: ["Security Runbooks", "Knowledge Base", "Security Automation"],
    href: "/mycelium",
  },
  {
    id: "check",
    emoji: "🛡️",
    name: "Security Check",
    tagline: "Sofort-Scan ohne Registrierung",
    desc: "Führe einen sofortigen Security-Check deiner Infrastruktur durch – ohne Login, ohne Wartezeit. Der Security Check liefert in 30 Sekunden deine Top-Risiken mit konkreten Abhilfemaßnahmen.",
    keywords: ["Security Scan", "Infrastructure Hardening", "CIS Benchmark"],
    href: "/check",
  },
]

const TOOLS_EN = [
  {
    id: "summon",
    emoji: "🔴",
    name: "Summon",
    tagline: "Emergency Runbooks on Demand",
    desc: "Summon delivers immediately deployable incident-response runbooks for any stack and any attack vector. No searching, no guessing – the right step at the right moment.",
    keywords: ["Incident Response", "Emergency Runbooks", "SecOps"],
    href: "/summon",
  },
  {
    id: "oracle",
    emoji: "🔮",
    name: "Oracle",
    tagline: "Security Analysis & Risk Assessment",
    desc: "Oracle analyses configurations, logs, and infrastructure descriptions, returning a prioritised risk assessment with concrete action steps – not just warnings.",
    keywords: ["Risk Assessment", "Security Analysis", "Vulnerability Management"],
    href: "/oracle",
  },
  {
    id: "neuro",
    emoji: "🧬",
    name: "Neuro",
    tagline: "AI Copilot for Security Operations",
    desc: "Neuro is the context-aware AI assistant for SecOps questions. Describe your problem in natural language – Neuro returns precise, executable solution steps for your exact stack.",
    keywords: ["AI Security Copilot", "Security Automation", "DevSecOps"],
    href: "/neuro",
  },
  {
    id: "mycelium",
    emoji: "🍄",
    name: "Mycelium",
    tagline: "The Living Runbook Network",
    desc: "4.2 million runbooks, semantically linked by the Mycelial Engine. Find exactly the solution that fits your stack – including related runbooks, patterns, and best practices.",
    keywords: ["Security Runbooks", "Knowledge Base", "Security Automation"],
    href: "/mycelium",
  },
  {
    id: "check",
    emoji: "🛡️",
    name: "Security Check",
    tagline: "Instant Scan – No Registration",
    desc: "Run an instant security check of your infrastructure – no login, no waiting. The Security Check delivers your top risks with concrete remediation steps in 30 seconds.",
    keywords: ["Security Scan", "Infrastructure Hardening", "CIS Benchmark"],
    href: "/check",
  },
]

export default function ToolsSection({ prefix = "", locale = "de" }: Props) {
  const isDe = locale.startsWith("de")
  const tools = isDe ? TOOLS_DE : TOOLS_EN

  return (
    <section className="py-16" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {isDe ? "Die Tools" : "The Tools"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isDe
              ? "Fünf spezialisierte Tools. Eine integrierte Plattform."
              : "Five Specialised Tools. One Integrated Platform."}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {isDe
              ? "Jedes Tool löst ein spezifisches SecOps-Problem – und alle arbeiten nahtlos zusammen."
              : "Each tool solves a specific SecOps problem – and all work seamlessly together."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <a
              key={tool.id}
              href={`${prefix}${tool.href}`}
              className="group rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] block"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{tool.emoji}</span>
                <div>
                  <div className="text-white font-black text-lg leading-none">{tool.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tool.tagline}</div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{tool.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.keywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    {kw}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {isDe ? "Öffnen →" : "Open →"}
              </div>
            </a>
          ))}

          {/* Spacer / CTA card */}
          <div
            className="rounded-2xl p-6 border border-dashed border-white/10 flex flex-col items-center justify-center text-center"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-white font-bold text-sm mb-1">
              {isDe ? "Alle Tools im Dashboard" : "All Tools in the Dashboard"}
            </div>
            <p className="text-gray-400 text-xs mb-3">
              {isDe
                ? "Mit Daypass oder Pro bekommst du vollen Zugriff auf alle Tools und Ausführungen."
                : "With Daypass or Pro, you get full access to all tools and executions."}
            </p>
            <a
              href={`${prefix}/daypass`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-cyan to-brand-violet text-white hover:opacity-90 transition-all"
            >
              {isDe ? "Daypass starten" : "Start Daypass"}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
