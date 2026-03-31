type Props = { prefix?: string; locale?: string }

export default function SolutionSection({ prefix = "", locale = "de" }: Props) {
  const isDe = locale.startsWith("de")

  const pillars = isDe
    ? [
        {
          icon: "⚡",
          title: "Sofort ausführbar",
          desc: "Runbooks sind keine PDFs. Sie laufen direkt in deiner Umgebung – mit Logging, Rollback und Audit-Trail.",
        },
        {
          icon: "🧠",
          title: "KI-gestützt, kontextsensitiv",
          desc: "Die Mycelial Engine verbindet über 4,2 Millionen Runbooks semantisch. Du bekommst immer die relevanteste Lösung für deinen exakten Stack.",
        },
        {
          icon: "📐",
          title: "Standardisiert & nachweisbar",
          desc: "Jede Aktion erzeugt automatisch einen Nachweis – für Audits, Compliance und interne Reviews. Git-kompatibel, exportierbar, beweisbar.",
        },
        {
          icon: "🌐",
          title: "Skaliert mit deinem Team",
          desc: "Vom Solo-Engineer bis zum Enterprise-SOC: ClawGuru bringt strukturiertes Sicherheitswissen dorthin, wo es gebraucht wird – ohne Skalierungsaufwand.",
        },
      ]
    : [
        {
          icon: "⚡",
          title: "Instantly executable",
          desc: "Runbooks aren't PDFs. They run directly in your environment – with logging, rollback, and audit trail.",
        },
        {
          icon: "🧠",
          title: "AI-powered, context-aware",
          desc: "The Mycelial Engine semantically connects 4.2+ million runbooks. You always get the most relevant solution for your exact stack.",
        },
        {
          icon: "📐",
          title: "Standardised & verifiable",
          desc: "Every action automatically generates evidence – for audits, compliance, and internal reviews. Git-compatible, exportable, provable.",
        },
        {
          icon: "🌐",
          title: "Scales with your team",
          desc: "From solo engineer to enterprise SOC: ClawGuru brings structured security knowledge where it's needed – without scaling overhead.",
        },
      ]

  return (
    <section className="py-16" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {isDe ? "Die Lösung" : "The Solution"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isDe
              ? "ClawGuru: Von der Frage zum ausführbaren Fix in Sekunden"
              : "ClawGuru: From Question to Executable Fix in Seconds"}
          </h2>
          <p className="mt-4 text-gray-300 max-w-3xl mx-auto text-base sm:text-lg">
            {isDe
              ? "ClawGuru ist kein weiteres Security-Dashboard. Es ist eine operative SecOps-Plattform, die Sicherheitswissen direkt handlungsfähig macht – für Incident Response, Hardening, Compliance und tägliche Security-Operationen."
              : "ClawGuru isn't another security dashboard. It's an operational SecOps platform that turns security knowledge into immediate action – for incident response, hardening, compliance, and daily security operations."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 border border-white/10 flex gap-4 items-start"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-3xl shrink-0 mt-0.5">{p.icon}</span>
              <div>
                <div className="text-white font-bold text-base mb-1">{p.title}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={`${prefix}/daypass`}
            className="inline-block px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white transition-all duration-300"
          >
            {isDe ? "Jetzt ausprobieren →" : "Try it now →"}
          </a>
        </div>
      </div>
    </section>
  )
}
