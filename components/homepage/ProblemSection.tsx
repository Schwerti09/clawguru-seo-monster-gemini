type Props = { locale?: string }

const PAIN_POINTS_DE = [
  {
    icon: "🔥",
    title: "Runbooks existieren – aber nicht dort, wo du sie brauchst",
    desc: "Confluence, Notion, geteilte Laufwerke. Wenn der Incident läuft, verlierst du wertvolle Minuten mit Suchen – Minuten, die über den Schaden entscheiden.",
  },
  {
    icon: "📋",
    title: "Hardening-Checklisten sind veraltet oder fehlen komplett",
    desc: "CIS Benchmarks, STIG, BSI-Grundschutz: Wer hat die Zeit, sie manuell aktuell zu halten und auf den eigenen Stack anzupassen? Die meisten Teams haben es nicht.",
  },
  {
    icon: "🤖",
    title: "KI-Tools liefern Antworten – aber keine ausführbaren Schritte",
    desc: "ChatGPT erklärt das Problem. Aber wer schreibt den Fix? Wer führt ihn aus? Wer dokumentiert den Nachweis für den nächsten Audit?",
  },
  {
    icon: "⏱️",
    title: "Die ersten 15 Minuten eines Incidents entscheiden über den Schaden",
    desc: "Breach, Datenleck, Systemausfall: Das Zeitfenster für Schadensbegrenzung ist klein. Ohne einen sofort verfügbaren Plan arbeitet jedes Team blind unter Druck.",
  },
  {
    icon: "📊",
    title: "Compliance-Audits bedeuten wochenlangen manuellen Aufwand",
    desc: "NIS2, ISO 27001, SOC 2: Nachweis- und Dokumentationspflichten wachsen. Teams leisten sich keine Zeit für lückenloses Tracking neben dem operativen Alltag.",
  },
  {
    icon: "🧑‍💻",
    title: "Wissensgefälle kostet Resilienz",
    desc: "Junior-Engineers wissen im Incident nicht, was zu tun ist. Senior-Engineers haben keine Zeit, es live zu erklären. Das strukturelle Risiko bleibt – solange Wissen nicht skaliert.",
  },
]

const PAIN_POINTS_EN = [
  {
    icon: "🔥",
    title: "Runbooks exist – but not where you need them",
    desc: "Confluence, Notion, shared drives. When an incident fires, you lose precious minutes searching – minutes that decide the scale of damage.",
  },
  {
    icon: "📋",
    title: "Hardening checklists are outdated or missing entirely",
    desc: "CIS Benchmarks, STIG, BSI IT-Grundschutz: who has the time to keep them current and adapted to the actual stack? Most teams don't.",
  },
  {
    icon: "🤖",
    title: "AI tools give answers – but no executable steps",
    desc: "ChatGPT explains the problem. But who writes the fix? Who executes it? Who documents the proof for the next audit?",
  },
  {
    icon: "⏱️",
    title: "The first 15 minutes of an incident decide the damage",
    desc: "Breach, data leak, outage: the window for damage control is tight. Without an immediately available plan, every team operates blind under pressure.",
  },
  {
    icon: "📊",
    title: "Compliance audits mean weeks of manual effort",
    desc: "NIS2, ISO 27001, SOC 2: evidence and documentation obligations are growing. Teams can't find time for seamless tracking alongside daily operations.",
  },
  {
    icon: "🧑‍💻",
    title: "Knowledge gaps cost resilience",
    desc: "Junior engineers don't know what to do during incidents. Senior engineers have no time to explain it live. The structural risk remains – as long as knowledge doesn't scale.",
  },
]

export default function ProblemSection({ locale = "de" }: Props) {
  const isDe = locale.startsWith("de")
  const points = isDe ? PAIN_POINTS_DE : PAIN_POINTS_EN

  return (
    <section className="py-16" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
            {isDe ? "Das Problem" : "The Problem"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {isDe
              ? "Warum SecOps-Teams täglich Kompromisse eingehen müssen"
              : "Why SecOps Teams Face Daily Compromises"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {isDe
              ? "Sicherheitsoperationen sind komplex, zeitkritisch und wissensintensiv – und die meisten Tools helfen nur halb."
              : "Security operations are complex, time-critical, and knowledge-intensive – and most tools only help halfway."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 border border-white/10 bg-white/3"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="text-white font-bold text-base mb-2">{p.title}</div>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
