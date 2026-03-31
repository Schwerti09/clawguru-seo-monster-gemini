type Props = { prefix?: string; dict?: Record<string, string> }

export default function ToolsSection({ prefix = "", dict = {} }: Props) {
  const tools = [
    {
      id: "summon",
      emoji: "🔴",
      title: dict.tools_t1_title || "Summon",
      desc: dict.tools_t1_desc || "Describe your problem – ClawGuru finds matching runbooks and starts execution.",
      href: `${prefix}/summon`,
    },
    {
      id: "intel",
      emoji: "🧠",
      title: dict.tools_t2_title || "Intel Feed",
      desc: dict.tools_t2_desc || "Real-time threat intelligence. Automated risk analysis for your infrastructure.",
      href: `${prefix}/intel`,
    },
    {
      id: "opswall",
      emoji: "🛡️",
      title: dict.tools_t3_title || "OpsWall",
      desc: dict.tools_t3_desc || "Live monitoring of your systems. Detection of anomalies and threats in real time.",
      href: `${prefix}/live`,
    },
    {
      id: "threatmap",
      emoji: "🗺️",
      title: dict.tools_t4_title || "ThreatMap",
      desc: dict.tools_t4_desc || "Visualized attack surface. See where your vulnerabilities are – before attackers do.",
      href: `${prefix}/threatmap`,
    },
    {
      id: "perfection",
      emoji: "⚡",
      title: dict.tools_t5_title || "Perfection",
      desc: dict.tools_t5_desc || "Automated configuration checks. CIS Benchmarks, STIG, BSI – instantly on your stack.",
      href: `${prefix}/perfection`,
    },
    {
      id: "neuro",
      emoji: "🧬",
      title: dict.tools_t6_title || "Neuro",
      desc: dict.tools_t6_desc || "AI-powered vulnerability analysis. Proactive identification of risks in code and infrastructure.",
      href: `${prefix}/neuro`,
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
}