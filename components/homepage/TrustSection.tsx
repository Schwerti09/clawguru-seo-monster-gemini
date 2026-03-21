"use client"

import { motion } from "framer-motion"

type Props = { prefix?: string; locale?: string }

export default function TrustSection({ prefix = "", locale = "de" }: Props) {
  const isDe = locale?.startsWith("de")

  const points = isDe
    ? [
        {
          title: "Open & nachprüfbar",
          desc: "Code, Issues und Roadmap sind öffentlich – transparente Entwicklung ohne Hype.",
          href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini",
          label: "GitHub ansehen",
        },
        {
          title: "Changelog & Releases",
          desc: "Jeder Release ist dokumentiert – was sich ändert, ist nachvollziehbar.",
          href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini/releases",
          label: "Releases öffnen",
        },
        {
          title: "Security‑Check öffentlich",
          desc: "Sicherheitsfunktionen kannst du sofort ausprobieren – ohne Registrierung.",
          href: `${prefix}/check`,
          label: "Security‑Check starten",
        },
      ]
    : [
        {
          title: "Open & verifiable",
          desc: "Code, issues and roadmap are public – transparent development without hype.",
          href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini",
          label: "View GitHub",
        },
        {
          title: "Changelog & releases",
          desc: "Every release is documented – changes are traceable.",
          href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini/releases",
          label: "Open releases",
        },
        {
          title: "Security check (public)",
          desc: "You can try core security features right away – no sign‑up required.",
          href: `${prefix}/check`,
          label: "Start security check",
        },
      ]

  const roadmap = isDe
    ? [
        { name: "GDPR & NIS2", status: "konform heute" },
        { name: "SOC 2 Type II", status: "geplant (H2 2026)" },
        { name: "ISO 27001", status: "geplant (H2 2026)" },
      ]
    : [
        { name: "GDPR & NIS2", status: "compliant today" },
        { name: "SOC 2 Type II", status: "planned (H2 2026)" },
        { name: "ISO 27001", status: "planned (H2 2026)" },
      ]

  return (
    <section className="relative py-24 overflow-hidden bg-black/40 backdrop-blur-sm rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            {isDe ? "Transparenz statt Logos" : "Transparency over logos"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            {isDe
              ? "Wir sind Early‑Stage. Statt großer Namen zeigen wir dir das, was du selbst prüfen kannst."
              : "We’re early‑stage. Instead of big names, we show what you can verify yourself."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {points.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              target={p.href.startsWith("http") ? "_blank" : undefined}
              rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="block rounded-2xl bg-white/5 border border-white/10 p-6 hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300"
            >
              <div className="text-lg font-semibold text-white">{p.title}</div>
              <p className="mt-2 text-sm text-gray-300">{p.desc}</p>
              <div className="mt-4 inline-flex items-center text-cyan-300 text-sm font-medium">
                {p.label}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mb-4 text-center text-sm text-gray-400">
          {isDe
            ? "Ehrlichkeit vor Glamour: keine Fake‑Logos, keine erfundenen Referenzen."
            : "Honesty over glamour: no fake logos, no fabricated references."}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-white font-semibold">
                {isDe ? "Compliance‑Roadmap" : "Compliance roadmap"}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {isDe
                  ? "Was heute erfüllt ist und was geplant ist – klar ausgewiesen."
                  : "What’s fulfilled today and what’s planned – clearly indicated."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {roadmap.map((r) => (
                <span key={r.name} className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-sm text-gray-300">
                  {r.name}: <span className="text-cyan-300 ml-1">{r.status}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-10">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/Schwerti09/clawguru-seo-monster-gemini"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/10 hover:border-white/20 text-gray-200 font-semibold transition-all duration-300"
            >
              {isDe ? "Projekt auf GitHub ansehen" : "View project on GitHub"}
            </a>
            <a
              href={`${prefix}/check`}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              {isDe ? "Security‑Check jetzt testen" : "Try the security check"}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
