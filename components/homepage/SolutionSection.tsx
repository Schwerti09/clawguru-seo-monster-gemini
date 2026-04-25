import { RUNBOOK_COUNT_LONG_EN } from "@/lib/stats"

type Props = { prefix?: string; dict?: Record<string, string> }

export default function SolutionSection({ prefix = "", dict = {} }: Props) {
  const pillars = [
    {
      title: dict.solution_p1_title || "Mycelial Engine",
      desc: dict.solution_p1_desc || `Over ${RUNBOOK_COUNT_LONG_EN} runbooks, semantically connected. The Engine finds the right path – not just an answer.`,
    },
    {
      title: dict.solution_p2_title || "AI-powered execution",
      desc: dict.solution_p2_desc || "Automated, context-aware, and in your environment. From identification to proof – in seconds.",
    },
    {
      title: dict.solution_p3_title || "Verifiable results",
      desc: dict.solution_p3_desc || "Git commit, audit report, certificate. Every execution is documented and traceable.",
    },
  ]

  return (
    <section className="py-16" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
            {dict.solution_badge || "The Solution"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {dict.solution_title || "One Platform – Three Pillars"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {dict.solution_sub || "ClawGuru solves the core problem: knowledge where it's needed, in executable form – instantly verifiable."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={p.title} className="text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 text-green-400">
                  <span className="text-2xl font-black">{i + 1}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-gray-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}