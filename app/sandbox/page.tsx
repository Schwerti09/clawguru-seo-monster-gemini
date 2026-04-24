// LIVE FIX SANDBOX v∞ – In-Browser Config Testing – Overlord AI
// Server entry: exports SEO metadata, renders the interactive Sandbox client component.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import LiveFixSandbox from "@/components/copilot/LiveFixSandbox"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
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
  title: "Live Fix Sandbox — In-Browser Config Testing | ClawGuru",
  description:
    "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. Live Fix Sandbox: Test nginx, Docker, Terraform, K8s configs direkt im Browser.",
  keywords: [
    "sandbox",
    "config testing",
    "nginx linting",
    "docker validation",
    "terraform linter",
    "k8s validation",
    "config security",
    "browser-based testing",
  ],
  openGraph: {
    title: "Live Fix Sandbox — In-Browser Config Testing | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    type: "website",
    url: `${BASE_URL}/sandbox`,
    images: [{
      url: `${BASE_URL}/og/sandbox.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Live Fix Sandbox — In-Browser Config Testing - Nginx, Docker, Terraform, K8s"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Fix Sandbox — In-Browser Config Testing | ClawGuru",
    description: "ClawGuru ist die KI-gestützte SecOps-Plattform mit über 4,2 Millionen ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.",
    images: [`${BASE_URL}/og/sandbox.png`]
  },
  alternates: { canonical: "/sandbox" },
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
  name: "Live Fix Sandbox",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  description: "In-browser config testing sandbox for nginx, Docker, Terraform, and Kubernetes configurations. Real-time validation and security linting.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  author: {
    "@type": "Organization",
    name: "ClawGuru",
  },
  featureList: [
    "Nginx config linting",
    "Docker validation",
    "Terraform linter",
    "Kubernetes validation",
    "Real-time scoring",
    "Security best practices",
  ],
}

const imageObjectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageObject",
  contentUrl: `${BASE_URL}/og/sandbox.png`,
  description: "ClawGuru Live Fix Sandbox — In-Browser Config Testing - Nginx, Docker, Terraform, K8s",
  author: {
    "@type": "Organization",
    name: "ClawGuru",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  width: 1200,
  height: 630,
}

export default function SandboxPage() {
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
            Live Fix Sandbox · v∞
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${QV.gold}, ${QV.coldWhite} 45%, ${QV.violet})`,
              }}
            >
              Live Fix Sandbox
            </span>
          </h1>
          <p
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Test nginx, Docker, Terraform, K8s configs direkt im Browser. Real-time validation + security linting.
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

        {/* ── Supported Config Types ── */}
        <div className="mx-auto w-full max-w-4xl px-4 mb-10">
          <div
            className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4 text-center"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Supported Config Types
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Nginx", icon: "🌐", color: QV.gold },
              { name: "Docker", icon: "🐳", color: QV.blue },
              { name: "Terraform", icon: "🏗️", color: QV.violet },
              { name: "Kubernetes", icon: "☸️", color: QV.green },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-2xl p-4 border text-center"
                style={{ background: QV.glass, borderColor: `${item.color}18` }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-bold" style={{ color: item.color }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Fix Sandbox ── */}
        <div className="mx-auto w-full max-w-4xl px-4 mb-10">
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: QV.glass,
              border: `1px solid ${QV.violet}18`,
              boxShadow: `0 0 60px ${QV.violet}08`,
            }}
          >
            <div
              className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
              style={{ color: `${QV.violet}88` }}
            >
              Live Fix Sandbox
            </div>
            <LiveFixSandbox />
          </div>
        </div>

        {/* ── Use Case Cards ── */}
        <div className="mx-auto w-full max-w-4xl px-4 mb-10">
          <div
            className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Use Cases
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Nginx Security Hardening",
                desc: "Validiere nginx configs für security best practices: server_tokens off, SSL/TLS settings, security headers.",
                color: QV.gold,
              },
              {
                title: "Docker Container Security",
                desc: "Prüfe Dockerfiles auf root user, exposed ports, multi-stage builds, und vulnerability patterns.",
                color: QV.blue,
              },
              {
                title: "Terraform Infrastructure as Code",
                desc: "Linte Terraform configs für AWS/GCP/Azure best practices, encryption, and IAM policies.",
                color: QV.violet,
              },
              {
                title: "Kubernetes Manifest Validation",
                desc: "Validiere K8s YAMLs for resource limits, security contexts, network policies, and RBAC.",
                color: QV.green,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-4 border"
                style={{ background: QV.glass, borderColor: `${item.color}18` }}
              >
                <div className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
              </div>
            ))}
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
            href="/copilot"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: `${QV.gold}10`,
              border: `1px solid ${QV.gold}44`,
              color: QV.gold,
            }}
          >
            Try Prof. ClawGuru →
          </a>
        </div>

        {/* ── Bottom inscription ── */}
        <div className="pb-6 text-center">
          <div
            className="text-[9px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.07)" }}
          >
            Test Configs in Real-Time. · Live Fix Sandbox v∞ · ClawGuru.org
          </div>
        </div>
      </div>
    </>
  )
}
