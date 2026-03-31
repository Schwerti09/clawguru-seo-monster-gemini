#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

// Convert the remaining 5 homepage components to use dict instead of locale/isDe

// SolutionSection
const solutionSection = `type Props = { prefix?: string; dict?: Record<string, string> }

export default function SolutionSection({ prefix = "", dict = {} }: Props) {
  const pillars = [
    {
      title: dict.solution_p1_title || "Mycelial Engine",
      desc: dict.solution_p1_desc || "Over 4.2 million runbooks, semantically connected. The Engine finds the right path – not just an answer.",
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
}`

// ToolsSection
const toolsSection = `type Props = { prefix?: string; dict?: Record<string, string> }

export default function ToolsSection({ prefix = "", dict = {} }: Props) {
  const tools = [
    {
      id: "summon",
      emoji: "🔴",
      title: dict.tools_t1_title || "Summon",
      desc: dict.tools_t1_desc || "Describe your problem – ClawGuru finds matching runbooks and starts execution.",
      href: \`\${prefix}/summon\`,
    },
    {
      id: "intel",
      emoji: "🧠",
      title: dict.tools_t2_title || "Intel Feed",
      desc: dict.tools_t2_desc || "Real-time threat intelligence. Automated risk analysis for your infrastructure.",
      href: \`\${prefix}/intel\`,
    },
    {
      id: "opswall",
      emoji: "🛡️",
      title: dict.tools_t3_title || "OpsWall",
      desc: dict.tools_t3_desc || "Live monitoring of your systems. Detection of anomalies and threats in real time.",
      href: \`\${prefix}/live\`,
    },
    {
      id: "threatmap",
      emoji: "🗺️",
      title: dict.tools_t4_title || "ThreatMap",
      desc: dict.tools_t4_desc || "Visualized attack surface. See where your vulnerabilities are – before attackers do.",
      href: \`\${prefix}/threatmap\`,
    },
    {
      id: "perfection",
      emoji: "⚡",
      title: dict.tools_t5_title || "Perfection",
      desc: dict.tools_t5_desc || "Automated configuration checks. CIS Benchmarks, STIG, BSI – instantly on your stack.",
      href: \`\${prefix}/perfection\`,
    },
    {
      id: "neuro",
      emoji: "🧬",
      title: dict.tools_t6_title || "Neuro",
      desc: dict.tools_t6_desc || "AI-powered vulnerability analysis. Proactive identification of risks in code and infrastructure.",
      href: \`\${prefix}/neuro\`,
    },
  ]

  return (
    <section className="py-16" style={{ background: "var(--surface-1)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {dict.tools_badge || "Tools"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {dict.tools_title || "Tools for real security operations"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            {dict.tools_sub || "From incident response to hardening to compliance – everything in one platform."}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t) => (
            <a
              key={t.id}
              href={t.href}
              className="group block rounded-2xl p-6 border border-white/10 bg-white/3 hover:border-white/20 transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{t.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}`

// WhySection
const whySection = `type Props = { dict?: Record<string, string> }

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
            <h3 className="text-xl font-bold text-white mb-6">Key Benefits</h3>
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
            <h3 className="text-xl font-bold text-white mb-6">Differentiators</h3>
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
}`

// FinalCTASection
const finalCTASection = `type Props = { prefix?: string; dict?: Record<string, string> }

export default function FinalCTASection({ prefix = "", dict = {} }: Props) {
  return (
    <section className="py-20" style={{ background: "var(--surface-0)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
          {dict.final_cta_title || "Ready for real security operations?"}
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          {dict.final_cta_sub || "Start now – risk-free. Productive in 5 minutes."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={\`\${prefix}/daypass\`}
            className="px-8 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 text-white text-center"
          >
            {dict.final_cta_primary || "Get started now"}
          </a>
          <a
            href="#live-previews"
            className="px-8 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
          >
            {dict.final_cta_secondary || "View demo"}
          </a>
        </div>
      </div>
    </section>
  )
}`

// Write the files
const components = [
  { file: "SolutionSection.tsx", content: solutionSection },
  { file: "ToolsSection.tsx", content: toolsSection },
  { file: "WhySection.tsx", content: whySection },
  { file: "FinalCTASection.tsx", content: finalCTASection },
]

const dir = path.join(__dirname, "..", "components", "homepage")
for (const comp of components) {
  const filePath = path.join(dir, comp.file)
  fs.writeFileSync(filePath, comp.content, "utf-8")
  console.log(`✓ Updated ${comp.file}`)
}

console.log("\nAll 4 remaining components converted to use dict instead of locale/isDe")
