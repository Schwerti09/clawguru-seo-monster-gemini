// PROF. CLAWGURU COPILOT v∞ – AI Security Assistant – Overlord AI
// Server entry: exports SEO metadata, renders the interactive Copilot client component.

import type { Metadata } from "next"
import { headers } from "next/headers"
import Container from "@/components/shared/Container"
import CopilotChat from "@/components/copilot/CopilotChat"
import VoiceCopilot from "@/components/copilot/VoiceCopilot"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import { BASE_URL } from "@/lib/config"

/* ── Quantum Void colour tokens ── */
const QV = {
  void: "#050505",
  gold: "#c9a84c",
  violet: "#8b6cdf",
  coldWhite: "#d4dce8",
  green: "#00ff9d",
  blue: "#00b8ff",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const

export const metadata: Metadata = {
  title: "Prof. ClawGuru — AI Security Assistant | ClawGuru",
  description:
    "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. Prof. ClawGuru Copilot: Problem beschreiben, Schritt-für-Schritt Runbook bekommen.",
  keywords: [
    "prof clawguru",
    "ai security assistant",
    "security copilot",
    "runbook generator",
    "incident response",
    "openclaw",
    "moltbot",
    "security automation",
  ],
  openGraph: {
    title: "Prof. ClawGuru — AI Security Assistant | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    type: "website",
    url: `${BASE_URL}/copilot`,
    images: [{
      url: `${BASE_URL}/og/copilot.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Prof. ClawGuru — AI Security Assistant - 4.2M+ Runbooks, 30s Fix Time, 24/7 Active"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Prof. ClawGuru — AI Security Assistant | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    images: [`${BASE_URL}/og/copilot.png`]
  },
  alternates: { canonical: "/copilot" },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512.png`,
  foundingDate: "2024",
  description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
  sameAs: [
    "https://github.com/clawguru",
  ],
}

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Prof. ClawGuru",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description: "AI-powered security assistant that generates step-by-step runbooks for incident response and hardening.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  author: {
    "@type": "Organization",
    name: "ClawGuru",
  },
}

const imageObjectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  contentUrl: `${BASE_URL}/og/copilot.png`,
  description: "ClawGuru Prof. ClawGuru — AI Security Assistant - 4.2M+ Runbooks, 30s Fix Time, 24/7 Active",
  author: {
    "@type": "Organization",
    name: "ClawGuru",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  width: 1200,
  height: 630,
}

export default async function CopilotPage(
  props: { searchParams?: Promise<Record<string, string | string[] | undefined>> }
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams?.q : ""

  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectJsonLd) }}
      />
      <div
        className="relative min-h-screen flex flex-col"
        style={{ background: QV.void }}
      >
        {/* ── Header ── */}
        <div className="pt-16 pb-10 px-4 text-center">
          <a
            href="/clawverse"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-6 transition-opacity opacity-40 hover:opacity-80"
            style={{ color: QV.gold }}
          >
            ← ClawVerse
          </a>
          <div
            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
            style={{ color: `${QV.gold}88` }}
          >
            Prof. ClawGuru Copilot · v∞
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${QV.gold}, ${QV.coldWhite} 45%, ${QV.violet})`,
              }}
            >
              Prof. ClawGuru
            </span>
          </h1>
          <p
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            {dict.copilot.pageSubtitle}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6 max-w-3xl mx-auto">
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.gold}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.gold }}>4.2M+</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Runbooks</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.violet}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.violet }}>30s</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Problem → Fix</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.coldWhite}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.coldWhite }}>15+</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Jahre Erfahrung</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.green}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.green }}>24/7</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Incident Response</div>
            </div>
          </div>

          {/* Social Proof Counter */}
          <div className="mt-4 max-w-lg mx-auto mb-6">
            <SocialProofCounter variant="compact" />
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="mx-auto w-full max-w-4xl px-4 mb-10">
          {/* CopilotChat supports manual input; prefill hint displayed below */}
          {q ? (
            <div className="mb-6 p-4 rounded-2xl border" style={{ background: QV.glass, borderColor: `${QV.violet}18` }}>
              <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                {dict.copilot.prefillNote.replace("{q}", q)}
              </div>
            </div>
          ) : null}

          <LoginSaveBanner />
          <CopilotChat />

          {/* NEXT-LEVEL UPGRADE 2026: Voice Copilot – speak your issue */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
              <h2 className="text-xl font-black" style={{ color: QV.green }}>{dict.copilot.voiceTitle}</h2>
              {/* Feature gate nudge – Voice is limited on Day Pass */}
              <a
                href={`/${locale}/pricing#pro`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-opacity hover:opacity-80"
                style={{ borderColor: `${QV.violet}44`, color: QV.violet, background: `${QV.violet}10` }}
              >
                {dict.copilot.voiceUpgrade}
              </a>
            </div>
            <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
              {dict.copilot.voiceDesc}
            </p>
            <VoiceCopilot lang={locale} />
          </div>
        </div>

        {/* ── E-E-A-T Signals ── */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              Warum wir vertrauenswürdig sind
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Experience",
                  desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                  color: QV.gold,
                },
                {
                  title: "Expertise",
                  desc: "4,2 Millionen AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.",
                  color: QV.violet,
                },
                {
                  title: "Authoritativeness",
                  desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                  color: QV.coldWhite,
                },
                {
                  title: "Trustworthiness",
                  desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                  color: QV.green,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-4 border" style={{ background: QV.glass, borderColor: `${item.color}18` }}>
                  <div className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="pb-12 text-center px-4">
          <a
            href="/sandbox"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: `${QV.gold}10`,
              border: `1px solid ${QV.gold}44`,
              color: QV.gold,
            }}
          >
            Try Live Fix Sandbox →
          </a>
        </div>

        {/* ── Bottom inscription ── */}
        <div className="pb-6 text-center">
          <div
            className="text-[9px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.07)" }}
          >
            AI-Powered Security Intelligence. · Prof. ClawGuru v∞ · ClawGuru.org
          </div>
        </div>
      </div>
    </>
  )
}
