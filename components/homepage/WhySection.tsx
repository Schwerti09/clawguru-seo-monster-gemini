type Props = { locale?: string }

export default function WhySection({ locale = "de" }: Props) {
  const isDe = locale.startsWith("de")

  const reasons = isDe
    ? [
        {
          stat: "4,2 Mio.",
          label: "Runbooks",
          desc: "Die größte semantisch vernetzte Security-Runbook-Bibliothek, die für reale SecOps-Szenarien entwickelt wurde – nicht für Demos.",
          icon: "📚",
        },
        {
          stat: "< 30 Sek.",
          label: "bis zum ersten Ergebnis",
          desc: "Von der Frage zum ausführbaren Runbook in unter 30 Sekunden. Kein Onboarding, keine Konfiguration – sofort einsatzbereit.",
          icon: "⚡",
        },
        {
          stat: "100 %",
          label: "Executable Content",
          desc: "Jedes Runbook ist direkt ausführbar. Kein Copy-Paste, kein Rätselraten: Schritt-für-Schritt mit Logging und Rollback-Unterstützung.",
          icon: "▶️",
        },
        {
          stat: "Audit-ready",
          label: "out of the box",
          desc: "Automatische Protokollierung jeder Aktion, Git-Commit und exportierbarer Report – für NIS2, ISO 27001 und interne Reviews.",
          icon: "📋",
        },
      ]
    : [
        {
          stat: "4.2 M",
          label: "runbooks",
          desc: "The largest semantically linked security runbook library, built for real SecOps scenarios – not demos.",
          icon: "📚",
        },
        {
          stat: "< 30 sec",
          label: "to first result",
          desc: "From question to executable runbook in under 30 seconds. No onboarding, no configuration – ready to use immediately.",
          icon: "⚡",
        },
        {
          stat: "100 %",
          label: "executable content",
          desc: "Every runbook is directly executable. No copy-paste, no guesswork: step-by-step with logging and rollback support.",
          icon: "▶️",
        },
        {
          stat: "Audit-ready",
          label: "out of the box",
          desc: "Automatic logging of every action, Git commit, and exportable report – for NIS2, ISO 27001, and internal reviews.",
          icon: "📋",
        },
      ]

  const differentiators = isDe
    ? [
        {
          title: "Mycelial Engine",
          desc: "Unsere proprietäre Mycelial Engine vernetzt Runbooks, Patches, CVEs und Best Practices in einem semantischen Wissensgraphen – damit du immer die relevanteste Lösung bekommst, nicht nur die beliebteste.",
        },
        {
          title: "Executable Security Content",
          desc: "Die meisten Security-Plattformen liefern Wissen zum Lesen. ClawGuru liefert Wissen zum Ausführen. Der Unterschied ist operativ, nicht philosophisch.",
        },
        {
          title: "Bilingual & Stack-agnostisch",
          desc: "Verfügbar auf Deutsch und Englisch, für AWS, Azure, GCP, Linux, Kubernetes, Docker, Windows Server und mehr – ohne Stack-Lock-in.",
        },
        {
          title: "Transparent & Open",
          desc: "Keine Magic Boxes. Code, Roadmap und Issues sind öffentlich einsehbar. Wir zeigen, was wir tun – nicht nur, was wir versprechen.",
        },
      ]
    : [
        {
          title: "Mycelial Engine",
          desc: "Our proprietary Mycelial Engine links runbooks, patches, CVEs, and best practices in a semantic knowledge graph – so you always get the most relevant solution, not just the most popular one.",
        },
        {
          title: "Executable Security Content",
          desc: "Most security platforms deliver knowledge to read. ClawGuru delivers knowledge to execute. The difference is operational, not philosophical.",
        },
        {
          title: "Bilingual & Stack-agnostic",
          desc: "Available in German and English, for AWS, Azure, GCP, Linux, Kubernetes, Docker, Windows Server, and more – without stack lock-in.",
        },
        {
          title: "Transparent & Open",
          desc: "No magic boxes. Code, roadmap, and issues are publicly accessible. We show what we do – not just what we promise.",
        },
      ]

  return (
    <section className="py-16" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {isDe ? "Warum ClawGuru" : "Why ClawGuru"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isDe
              ? "Nicht das nächste Security-Tool. Ein operativer Multiplier."
              : "Not the next security tool. An operational multiplier."}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {isDe
              ? "Der Unterschied liegt nicht im Feature-Set. Er liegt darin, ob Wissen wirklich in Aktion übergeht."
              : "The difference isn't in the feature set. It's in whether knowledge actually translates into action."}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {reasons.map((r) => (
            <div
              key={r.label}
              className="rounded-2xl p-5 border border-white/10 text-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="text-2xl mb-2">{r.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-white leading-none">{r.stat}</div>
              <div className="text-xs text-cyan-400 font-semibold mt-1 mb-2 uppercase tracking-wide">{r.label}</div>
              <p className="text-gray-400 text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Differentiators */}
        <div className="grid sm:grid-cols-2 gap-5">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl p-6 border border-white/10"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-white font-bold text-base mb-2">{d.title}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
