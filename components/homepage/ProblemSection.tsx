type Props = { dict?: Record<string, string> }

export default function ProblemSection({ dict = {} }: Props) {
  const points = [
    {
      icon: "�",
      title: dict.problem_p1_title || "Runbooks exist – but not where you need them",
      desc: dict.problem_p1_desc || "Confluence, Notion, shared drives. When an incident fires, you lose precious minutes searching – minutes that decide the scale of damage.",
    },
    {
      icon: "📋",
      title: dict.problem_p2_title || "Hardening checklists are outdated or missing entirely",
      desc: dict.problem_p2_desc || "CIS Benchmarks, STIG, BSI IT-Grundschutz: who has the time to keep them current and adapted to the actual stack? Most teams don't.",
    },
    {
      icon: "🤖",
      title: dict.problem_p3_title || "AI tools give answers – but no executable steps",
      desc: dict.problem_p3_desc || "ChatGPT explains the problem. But who writes the fix? Who executes it? Who documents the proof for the next audit?",
    },
    {
      icon: "⏱️",
      title: dict.problem_p4_title || "The first 15 minutes of an incident decide the damage",
      desc: dict.problem_p4_desc || "Breach, data leak, outage: the window for damage control is tight. Without an immediately available plan, every team operates blind under pressure.",
    },
    {
      icon: "📊",
      title: dict.problem_p5_title || "Compliance audits mean weeks of manual effort",
      desc: dict.problem_p5_desc || "NIS2, ISO 27001, SOC 2: evidence and documentation obligations are growing. Teams can't find time for seamless tracking alongside daily operations.",
    },
    {
      icon: "🧑‍💻",
      title: dict.problem_p6_title || "Knowledge gaps cost resilience",
      desc: dict.problem_p6_desc || "Junior engineers don't know what to do during incidents. Senior engineers have no time to explain it live. The structural risk remains – as long as knowledge doesn't scale.",
    },
  ]

  return (
    <section className="py-16" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
            {dict.problem_badge || "The Problem"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {dict.problem_title || "Why SecOps Teams Face Daily Compromises"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {dict.problem_sub || "Security operations are complex, time-critical, and knowledge-intensive – and most tools only help halfway."}
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
