"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import PageOnboarding from "@/components/onboarding/PageOnboarding"
import { useI18n } from "@/components/i18n/I18nProvider"
import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import { EmailCapture } from "@/components/conversion/EmailCapture"

export default function CheckPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { locale, dict } = useI18n()
  const c = dict.check
  const prefix = `/${locale}`
  const faqItems = [
    { q: c.faq_q1, a: c.faq_a1 },
    { q: c.faq_q2, a: c.faq_a2 },
    { q: c.faq_q3, a: c.faq_a3 },
    { q: c.faq_q4, a: c.faq_a4 },
    { q: c.faq_q5, a: c.faq_a5 },
  ]
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  useEffect(() => {
    // Show onboarding if first visit
    const hasVisited = localStorage.getItem("check_visited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("check_visited", "1")
    }
    trackEvent("check_page_view", { locale })
  }, [locale])

  if (showOnboarding) {
    return (
      <Container>
        <div className="py-16">
          <PageOnboarding 
            pageType="check" 
            onDismiss={() => setShowOnboarding(false)} 
          />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-16">
        <SectionTitle
          kicker="SECURITY"
          title={c.page_title}
          subtitle={c.page_subtitle}
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-100">
            {c.badge_no_reg}
          </div>
          <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 px-4 py-3 text-sm text-cyan-100">
            {c.badge_time}
          </div>
          <div className="rounded-xl border border-violet-900/40 bg-violet-950/20 px-4 py-3 text-sm text-violet-100">
            {c.badge_share}
          </div>
        </div>
        <div className="mt-8">
          <HeroSecurityCheck />
        </div>

        {/* Email Capture after Check */}
        <div className="mt-8 max-w-4xl">
          <EmailCapture locale={locale} source="check_page" variant="card" />
        </div>

        {/* CONVERSION WARFARE ROUND 4: Aggressive CTAs with Urgency */}
        <div className="mt-8 max-w-4xl space-y-4">
          <a
            href={`${prefix}/runbooks`}
            onClick={() => trackEvent("cta_click", { locale, target: "runbooks", source: "check_page_cta" })}
            className="block bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400 rounded-xl p-6 hover:from-cyan-500 hover:to-cyan-400 transition-all relative"
          >
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {locale === 'de' ? 'JETZT' : 'NOW'}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl">📚</div>
              <div>
                <div className="text-cyan-100 text-sm">
                  {locale === 'de' ? '1.000+ Fix-Runbooks — validiert von SecOps-Experten' : '1,000+ fix runbooks — validated by SecOps experts'}
                </div>
              </div>
            </div>
          </a>

          <div className="grid sm:grid-cols-4 gap-4">
            <a
              href={`${prefix}/roast-my-moltbot`}
              onClick={() => trackEvent("cta_click", { locale, target: "roast-moltbot", source: "check_page_cta" })}
              className="block bg-gradient-to-r from-red-600 to-red-500 border border-red-400 rounded-xl p-4 hover:from-red-500 hover:to-red-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                <div>
                  <div className="font-semibold text-white">{locale === 'de' ? 'Roast My Moltbot' : 'Roast My Moltbot'}</div>
                  <div className="text-xs text-red-100">{locale === 'de' ? 'Kostenloser Security-Roast' : 'Free security roast'}</div>
                </div>
              </div>
            </a>
            <a
              href={`${prefix}/openclaw`}
              onClick={() => trackEvent("cta_click", { locale, target: "openclaw", source: "check_page_cta" })}
              className="block bg-gradient-to-r from-green-600 to-green-500 border border-green-400 rounded-xl p-4 hover:from-green-500 hover:to-green-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                <div>
                  <div className="font-semibold text-white">{locale === 'de' ? 'OpenClaw' : 'OpenClaw'}</div>
                  <div className="text-xs text-green-100">{locale === 'de' ? 'Self-Hosted Security' : 'Self-hosted security'}</div>
                </div>
              </div>
            </a>
            <a
              href={`${prefix}/academy`}
              onClick={() => trackEvent("cta_click", { locale, target: "academy", source: "check_page_cta" })}
              className="block bg-gradient-to-r from-purple-600 to-purple-500 border border-purple-400 rounded-xl p-4 hover:from-purple-500 hover:to-purple-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                <div>
                  <div className="font-semibold text-white">{locale === 'de' ? 'Academy' : 'Academy'}</div>
                  <div className="text-xs text-purple-100">{locale === 'de' ? 'Kurse & Zertifizierung' : 'Courses & Certification'}</div>
                </div>
              </div>
            </a>
            <a
              href={`${prefix}/solutions`}
              onClick={() => trackEvent("cta_click", { locale, target: "solutions", source: "check_page_cta" })}
              className="block bg-gradient-to-r from-emerald-600 to-emerald-500 border border-emerald-400 rounded-xl p-4 hover:from-emerald-500 hover:to-emerald-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl"></div>
                <div>
                  <div className="font-semibold text-white">{locale === 'de' ? 'Solutions' : 'Solutions'}</div>
                  <div className="text-xs text-emerald-100">{locale === 'de' ? 'Enterprise Lösungen' : 'Enterprise solutions'}</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* FINAL EXECUTION ROUND 10: Mycelium Kreislauf */}
        <div className="mt-8 max-w-4xl rounded-2xl border border-white/10 bg-black/20 p-6">
          <h2 className="text-lg font-bold text-white mb-4 text-center">
            {locale === "de" ? "Mycelium Kreislauf" : "Mycelium Circle"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`${prefix}/roast-my-moltbot`} className="group bg-gradient-to-br from-red-900/30 to-[#0a0a0a] p-4 rounded-xl border border-red-700/50 hover:border-red-500 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <div>
                  <div className="font-semibold text-red-400 group-hover:text-red-300">{locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot"}</div>
                  <div className="text-xs text-gray-400">{locale === "de" ? "Kostenloser Security-Roast" : "Free security roast"}</div>
                </div>
              </div>
            </a>
            <a href={`${prefix}/academy`} className="group bg-gradient-to-br from-purple-900/30 to-[#0a0a0a] p-4 rounded-xl border border-purple-700/50 hover:border-purple-500 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <div>
                  <div className="font-semibold text-purple-400 group-hover:text-purple-300">{locale === "de" ? "Academy" : "Academy"}</div>
                  <div className="text-xs text-gray-400">{locale === "de" ? "Kurse & Zertifizierung" : "Courses & Certification"}</div>
                </div>
              </div>
            </a>
            <a href={`${prefix}/solutions`} className="group bg-gradient-to-br from-emerald-900/30 to-[#0a0a0a] p-4 rounded-xl border border-emerald-700/50 hover:border-emerald-500 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <div>
                  <div className="font-semibold text-emerald-400 group-hover:text-emerald-300">{locale === "de" ? "Solutions" : "Solutions"}</div>
                  <div className="text-xs text-gray-400">{locale === "de" ? "Enterprise Lösungen" : "Enterprise solutions"}</div>
                </div>
              </div>
            </a>
            <a href={`/oracle`} className="group bg-gradient-to-br from-amber-900/30 to-[#0a0a0a] p-4 rounded-xl border border-amber-700/50 hover:border-amber-500 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl"></span>
                <div>
                  <div className="font-semibold text-amber-400 group-hover:text-amber-300">{locale === "de" ? "Oracle" : "Oracle"}</div>
                  <div className="text-xs text-gray-400">{locale === "de" ? "KI-Intelligenz" : "AI Intelligence"}</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Proof Bullets */}
        <section className="mt-10 max-w-4xl">
          <h2 className="text-xl font-bold text-gray-100 mb-5">{c.proof_heading}</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: c.proof_1_title, desc: c.proof_1_desc, color: "cyan" },
              { title: c.proof_2_title, desc: c.proof_2_desc, color: "emerald" },
              { title: c.proof_3_title, desc: c.proof_3_desc, color: "violet" },
            ].map((p) => (
              <div key={p.title} className={`rounded-xl border p-5 ${
                p.color === "cyan"    ? "border-cyan-900/50 bg-cyan-950/20" :
                p.color === "emerald" ? "border-emerald-900/50 bg-emerald-950/20" :
                "border-violet-900/50 bg-violet-950/20"
              }`}>
                <p className={`font-semibold text-sm mb-2 ${
                  p.color === "cyan" ? "text-cyan-300" : p.color === "emerald" ? "text-emerald-300" : "text-violet-300"
                }`}>{p.title}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Score Methodology */}
        <section className="mt-6 rounded-2xl border border-yellow-900/30 bg-yellow-950/10 p-6 max-w-4xl">
          <h2 className="text-base font-bold text-yellow-300 mb-2">{c.score_methodology_heading}</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{c.score_methodology_desc}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {c.methodology_title}
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            {c.methodology_desc}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li>• {c.methodology_bullet1}</li>
            <li>• {c.methodology_bullet2}</li>
            <li>• {c.methodology_bullet3}</li>
          </ul>
          <a
            href={`${prefix}/methodik`}
            onClick={() => trackEvent("methodik_click", { locale, source: "check_methodology_block" })}
            className="mt-4 inline-flex text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
          >
            {c.methodology_link}
          </a>
        </section>
        <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {c.harden_title}
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            {c.harden_desc}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href={`${prefix}/nginx-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "nginx-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Nginx Hardening
            </a>
            <a
              href={`${prefix}/kubernetes-network-policies`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "kubernetes-network-policies", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Kubernetes Network Policies
            </a>
            <a
              href={`${prefix}/vault-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "vault-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Vault Hardening
            </a>
            <a
              href={`${prefix}/aws-iam-security`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "aws-iam-security", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              AWS IAM Security
            </a>
            <a
              href={`${prefix}/postgresql-security`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "postgresql-security", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              PostgreSQL Security
            </a>
            <a
              href={`${prefix}/docker-security-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "docker-security-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Docker Security Hardening
            </a>
          </div>
        </section>

        {/* TECHNICAL SEO DOMINATION ROUND 3: Strong Internal Links to High-Value Content */}
        <section className="mt-8 rounded-2xl border border-cyan-900/30 bg-cyan-950/10 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-cyan-300 mb-4">
            {locale === 'de' ? '🚀 Weiterführende Ressourcen' : '🚀 Further Resources'}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`${prefix}/runbooks`}
              onClick={() => trackEvent("resource_link_click", { locale, target: "runbooks", source: "check_resources" })}
              className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
            >
              <div className="font-semibold text-cyan-400">{locale === 'de' ? '📚 Security Runbooks' : '📚 Security Runbooks'}</div>
              <div className="text-sm text-gray-300">{locale === 'de' ? '1.000+ expert-validierte Fix-Runbooks' : '1,000+ expert-validated fix runbooks'}</div>
            </a>
            <a
              href={`${prefix}/roast-my-moltbot`}
              onClick={() => trackEvent("resource_link_click", { locale, target: "roast-moltbot", source: "check_resources" })}
              className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-colors"
            >
              <div className="font-semibold text-amber-400">{locale === 'de' ? '🔥 Roast My Moltbot' : '🔥 Roast My Moltbot'}</div>
              <div className="text-sm text-gray-300">{locale === 'de' ? 'Kostenloser Security-Roast' : 'Free security roast'}</div>
            </a>
            <a
              href={`${prefix}/openclaw`}
              onClick={() => trackEvent("resource_link_click", { locale, target: "openclaw", source: "check_resources" })}
              className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition-colors"
            >
              <div className="font-semibold text-green-400">{locale === 'de' ? '🛡️ OpenClaw' : '🛡️ OpenClaw'}</div>
              <div className="text-sm text-gray-300">{locale === 'de' ? 'Self-Hosted Security Framework' : 'Self-hosted security framework'}</div>
            </a>
            <a
              href={`${prefix}/moltbot-hardening`}
              onClick={() => trackEvent("resource_link_click", { locale, target: "moltbot-hardening", source: "check_resources" })}
              className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="font-semibold text-purple-400">{locale === 'de' ? '🤖 Moltbot Hardening' : '🤖 Moltbot Hardening'}</div>
              <div className="text-sm text-gray-300">{locale === 'de' ? 'AI-Agent Security Guide' : 'AI-agent security guide'}</div>
            </a>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {c.faq_title}
          </h3>
          <div className="mt-4 space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 px-4 py-3">
                <p className="font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-sm text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-8 max-w-2xl">
          <MyceliumShareCard
            title="Security-Check · ClawGuru"
            pageUrl="/check"
          />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </div>
    </Container>
  )
}
