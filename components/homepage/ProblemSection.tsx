type Props = { dict?: Record<string, string> }

export default function ProblemSection({ dict = {} }: Props) {
  const points = [
    {
      icon: "🚨",
      title: dict.problem_p1_title || "Exposed stack, unclear priority",
      desc: dict.problem_p1_desc || "Gateways, auth gaps, key leaks: teams see the noise, but not the order of action.",
    },
    {
      icon: "⚡",
      title: dict.problem_p2_title || "30-second signal, concrete weak spots",
      desc: dict.problem_p2_desc || "The check gives fast posture feedback so your team can prioritize immediately.",
    },
    {
      icon: "🛠️",
      title: dict.problem_p3_title || "Runbook path from issue to fix",
      desc: dict.problem_p3_desc || "Move from diagnosis to implementation and verification without tab-chaos.",
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
            {dict.problem_title || "From exposure to fix in three steps"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {dict.problem_sub || "A simple operating path: detect the weak spots, prioritize, execute, and re-check."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
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
