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
