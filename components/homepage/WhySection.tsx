type Props = { dict?: Record<string, string> }

export default function WhySection({ dict = {} }: Props) {
  const reasons = [
    {
      title: dict.why_r1_title || "Ready immediately",
      desc: dict.why_r1_desc || "No weeks for onboarding. Productive in 5 minutes – from day one.",
    },
    {
      title: dict.why_r2_title || "Scalable knowledge",
      desc: dict.why_r2_desc || "4.2 million runbooks grow with every new requirement. Your knowledge scales automatically.",
    },
    {
      title: dict.why_r3_title || "Verifiable security",
      desc: dict.why_r3_desc || "Every execution is documented. Git commit, audit report, certificate – for the next audit.",
    },
  ]

  const differentiators = [
    {
      title: dict.why_d1_title || "Mycelial Engine",
      desc: dict.why_d1_desc || "Semantic connection of millions of runbooks. The Engine finds the right path – not just an answer.",
    },
    {
      title: dict.why_d2_title || "AI-powered execution",
      desc: dict.why_d2_desc || "Automated, context-aware, and in your environment. From identification to proof – in seconds.",
    },
    {
      title: dict.why_d3_title || "Open Source",
      desc: dict.why_d3_desc || "No vendor lock-in. Code, issues and roadmap are public – transparent development without hype.",
    },
  ]

  return (
    <section className="py-16" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {dict.why_badge || "Why"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {dict.why_title || "Why ClawGuru?"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {dict.why_sub || "We solve the core problem of SecOps: knowledge where it's needed, in executable form – instantly verifiable."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">{dict.why_benefits_heading || "Key Benefits"}</h3>
            <div className="space-y-4">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">{r.title}</div>
                    <div className="text-gray-400 text-sm">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6">{dict.why_diff_heading || "Differentiators"}</h3>
            <div className="space-y-4">
              {differentiators.map((d) => (
                <div key={d.title} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-white font-semibold">{d.title}</div>
                    <div className="text-gray-400 text-sm">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}