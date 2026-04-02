"use client"

import { motion } from "framer-motion"
import type { Locale } from "@/lib/i18n"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"

type Props = { locale: Locale; prefix?: string; dict?: Record<string, string> }

export default function TrustSection({ locale, prefix = "", dict = {} }: Props) {
  const cro = getHomepageCroCopy(locale)
  const points = [
    {
      title: dict.trust_p1_title || "Open & verifiable",
      desc: dict.trust_p1_desc || "Code, issues and roadmap are public – transparent development without hype.",
      href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini",
      label: dict.trust_p1_label || "View GitHub",
    },
    {
      title: dict.trust_p2_title || "Changelog & releases",
      desc: dict.trust_p2_desc || "Every release is documented – changes are traceable.",
      href: "https://github.com/Schwerti09/clawguru-seo-monster-gemini/releases",
      label: dict.trust_p2_label || "Open releases",
    },
    {
      title: dict.trust_p3_title || "Security check (public)",
      desc: dict.trust_p3_desc || "You can try core security features right away – no sign‑up required.",
      href: `${prefix}/check`,
      label: dict.trust_p3_label || "Start security check",
    },
  ]

  const roadmap = [
    { name: "GDPR & NIS2", status: dict.trust_r1_status || "compliant today" },
    { name: "SOC 2 Type II", status: dict.trust_r2_status || "planned (H2 2026)" },
    { name: "ISO 27001", status: dict.trust_r3_status || "planned (H2 2026)" },
  ]

  return (
    <section className="relative py-24 overflow-hidden bg-black/40 backdrop-blur-sm rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            {dict.trust_heading || "Transparency over logos"}
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            {dict.trust_sub || "We're early‑stage. Instead of big names, we show what you can verify yourself."}
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
          {dict.trust_honesty || "Honesty over glamour: no fake logos, no fabricated references."}
        </div>
        <div className="mb-6 text-center text-xs text-gray-500">
          {dict.trust_disclaimer || cro.trustDisclaimer}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-white font-semibold">
                {dict.trust_compliance || "Compliance roadmap"}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {dict.trust_compliance_sub || "What's fulfilled today and what's planned – clearly indicated."}
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
              {dict.trust_github_btn || "View project on GitHub"}
            </a>
            <a
              href={`${prefix}/check`}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
            >
              {dict.trust_check_btn || "Try the security check"}
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
