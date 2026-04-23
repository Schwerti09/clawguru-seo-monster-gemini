import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"
import SocialProofBlock from "@/components/commerce/SocialProofBlock"
import EnterpriseConciergeButton from "@/components/enterprise/EnterpriseConciergeButton"
import ExitIntentPopup from "@/components/marketing/ExitIntentPopup"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { TIER_LIMITS } from "@/lib/feature-gating"
import { SOCIAL_PROOF_CONFIG } from "@/lib/social-proof-config"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
import dynamic from "next/dynamic"

const CouponBanner = dynamic(() => import("@/components/marketing/CouponBanner"), { ssr: false })
const BillingToggle = dynamic(() => import("@/components/commerce/BillingToggle"), { ssr: false })

const PRICING_KEYWORDS = [
  ...SEO_TARGET_KEYWORDS_2026,
  "Day Pass Security",
  "Log4j quick check",
  "Ransomware runbook download",
  "incident response sofort",
  "Security Notfall Zugang",
  "CVE check",
  "emergency runbook",
]

export const metadata = {
  title: "Preise & Pläne | ClawGuru – Security Check Platform",
  description:
    "ClawGuru Preise: Kostenloser Security Check, Starter ab 29€/Monat, Pro ab 99€/Monat, Scale ab 249€/Monat. KI-gestützte Security-Automation für Self-Hosted Teams.",
  keywords: PRICING_KEYWORDS,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Preise & Pläne | ClawGuru",
    description: "Security Check kostenlos. Starter, Pro, Scale und Enterprise für autonome Infrastruktur-Sicherheit.",
    url: "https://clawguru.org/de/pricing",
    type: "website" as const,
  },
}

type Feature = { label: string; isNew?: boolean; isComing?: boolean }
type FeatureGroup = { heading: string; items: Feature[] }

function FeatureList({ groups, newBadge }: { groups: FeatureGroup[]; newBadge: string }) {
  return (
    <div className="mt-5 space-y-4">
      {groups.map((g) => (
        <div key={g.heading}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">
            {g.heading}
          </div>
          <ul className="space-y-[7px]">
            {g.items.map((item) => (
              <li key={item.label} className="flex items-start gap-2 text-sm text-gray-200">
                <span className="mt-[2px] shrink-0 size-[18px] rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: item.isComing ? "rgba(255,165,0,0.10)" : "rgba(0,255,157,0.12)", color: item.isComing ? "#ffaa00" : "#00ff9d" }} aria-hidden="true">
                  {item.isComing ? "▷" : "✓"}
                </span>
                <span className="leading-snug" style={{ color: item.isComing ? "#9ca3af" : undefined }}>
                  {item.label}
                  {item.isNew && !item.isComing && (
                    <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-[6px] py-[2px] rounded-full align-middle"
                      style={{ background: "rgba(0,184,255,0.18)", color: "#00b8ff" }}>
                      {newBadge}
                    </span>
                  )}
                  {item.isComing && (
                    <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-[6px] py-[2px] rounded-full align-middle"
                      style={{ background: "rgba(255,165,0,0.15)", color: "#ffaa00" }}>
                      Soon
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default async function PricingPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`
  const isDE = locale === "de"
  const pricing = dict.pricing as any

  function getDayPassGroups(): FeatureGroup[] {
    return [
      {
        heading: pricing.grpSecurity,
        items: [
          { label: "Live Security Score – Top-3 in 30s" },
          { label: "Zero-Knowledge Check (privacy-first)", isNew: true },
          { label: "Config Validator: Docker, Nginx, YAML", isNew: true },
          { label: "Security Badge Generator (shareable)" },
        ]
      },
      {
        heading: pricing.grpOps,
        items: [
          { label: "OpsWall Live – Trends & Hot Fixes" },
          { label: "ThreatMap – Real-Time Threat Visualisation", isNew: true },
          { label: "Mission Control Dashboard", isNew: true },
          { label: "Incident Playbooks" },
        ]
      },
      {
        heading: pricing.grpKnowledge,
        items: [
          { label: "Vault: 500+ Runbooks & Blueprints" },
          { label: "Hardening, Recovery, Stripe/Webhooks & more" },
          { label: "Copilot Chat – AI assistant for Debug & Ops" },
        ]
      },
      {
        heading: pricing.grpLimits,
        items: [
          { label: `Max. ${TIER_LIMITS.daypass.maxSavedChecks} Saved Security Checks` },
          { label: `Voice Copilot: ${pricing.voiceCopilotLimited}`, isComing: true },
          { label: "No Private Nodes / Private Forks" },
        ]
      },
    ]
  }

  function getProGroups(): FeatureGroup[] {
    return [
      {
        heading: pricing.grpAllDayPass,
        items: [
          { label: "Permanent full access (no expiry)" },
          { label: "All Security & Ops Tools without time limit" },
        ]
      },
      {
        heading: pricing.grpFeatureUnlocks,
        items: [
          { label: "Unlimited Saved Security Checks", isNew: true },
          { label: "Private Nodes & Private Forks", isComing: true },
          { label: "Voice Copilot – unlimited", isComing: true },
          { label: "Darwinian Feed – personalised Intel Feed", isNew: true },
        ]
      },
      {
        heading: pricing.grpIntelligence,
        items: [
          { label: "Temporal Intelligence – time-based Threats", isNew: true },
          { label: "Neuro Intelligence – AI-driven Insights", isNew: true },
          { label: "ClawVerse – semantic Knowledge Graph", isNew: true },
          { label: "Living Mycelium – 1M+ Knowledge Nodes", isNew: true },
        ]
      },
      {
        heading: pricing.grpDeployment,
        items: [
          { label: "SWARM Deployment Simulator", isComing: true },
          { label: "Provenance Chain – Source Tracking", isNew: true },
          { label: "Issue Tracker + Fix Repository", isNew: true },
        ]
      },
      {
        heading: pricing.grpProExtras,
        items: [
          { label: "Pro Runbooks – ongoing updates" },
          { label: "Copilot: higher limits (fair-use)" },
          { label: "Priority: new features & topics first" },
        ]
      },
    ]
  }

  function getTeamGroups(): FeatureGroup[] {
    return [
      {
        heading: pricing.grpAllPro,
        items: [
          { label: "Full access to all Intelligence & Ops Layers" },
          { label: "All SWARM, Neuro & Provenance Features" },
        ]
      },
      {
        heading: pricing.grpTeamCollab,
        items: [
          { label: "Shared Runbook Links & Playbooks", isComing: true },
          { label: "Shared Mission Control (Team Dashboard)", isComing: true },
          { label: "Higher limits for all members (fair-use)" },
        ]
      },
      {
        heading: pricing.grpRoadmap,
        items: [
          { label: "Roadmap Votes – determines what gets built next", isComing: true },
          { label: "Early Access to new features" },
        ]
      },
    ]
  }

  function getEnterpriseGroups(): FeatureGroup[] {
    return [
      {
        heading: pricing.grpAllPro,
        items: [
          { label: "Full access to all Pro Features" },
        ]
      },
      {
        heading: pricing.grpEnterpriseUnlocks,
        items: [
          { label: "SSO / SAML Integration", isComing: true },
          { label: "Team Sharing & Shared Dashboards", isComing: true },
          { label: "Custom Runbooks – own Runbook Builder", isComing: true },
        ]
      },
      {
        heading: pricing.grpIntelFeedApi,
        items: [
          { label: "REST/JSON API – directly integratable into SIEM", isNew: true },
          { label: "API Key Authentication (Bearer / X-API-Key)", isNew: true },
          { label: "Filter by Severity & Category", isNew: true },
          { label: "Machine-readable Timestamps & Tags (STIX-compatible)", isNew: true },
        ]
      },
      {
        heading: pricing.grpEnterpriseSupport,
        items: [
          { label: "Dedicated API Key (revocable)", isNew: true },
          { label: "SLA Guarantee & Priority Support" },
          { label: "Custom Onboarding & Integration Calls" },
        ]
      },
    ]
  }

  const DAY_PASS_GROUPS = getDayPassGroups()
  const PRO_GROUPS = getProGroups()
  const TEAM_GROUPS = getTeamGroups()
  const ENTERPRISE_GROUPS = getEnterpriseGroups()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: "What is ClawGuru?", acceptedAnswer: { '@type': 'Answer', text: "ClawGuru is an AI-powered security intelligence platform for self-hosted infrastructure." } },
      { '@type': 'Question', name: "How does pricing work?", acceptedAnswer: { '@type': 'Answer', text: "We offer Free, Starter, Pro, Scale, and Enterprise plans with automation-first feature tiers." } },
      { '@type': 'Question', name: "Can I cancel anytime?", acceptedAnswer: { '@type': 'Answer', text: "Yes, you can cancel your subscription at any time. No long-term commitment required." } },
      { '@type': 'Question', name: "Do you offer a free trial?", acceptedAnswer: { '@type': 'Answer', text: "Yes, we offer a free trial for our Pro and Team plans. Try before you commit." } },
    ],
  }

  return (
    <main className="min-h-screen bg-[#05060A]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,184,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}>
            {pricing.accessBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            {pricing.title}
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            {pricing.subtitle}
          </p>
          {/* Free CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`${prefix}/securitycheck`}
              className="px-8 py-3.5 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%)", boxShadow: "0 0 30px rgba(0,255,157,0.25)" }}>
              {(pricing as any).heroFreeCta || "Start Free Trial"}
            </a>
            <a href="#compare"
              className="px-6 py-3 rounded-2xl font-semibold text-sm text-gray-300 border border-white/10 hover:border-white/25 transition-all duration-200">
              {(pricing as any).heroComparePlans || "Compare Plans"}
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#00ff9d" }}>✓</span> {pricing.trustNoCard}
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#00ff9d" }}>✓</span> {pricing.trustGdpr}
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#00ff9d" }}>✓</span> {pricing.trustCancelable}
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "#00ff9d" }}>✓</span> {pricing.trustSelfHosted}
            </span>
          </div>

          {/* TASK A9: Social Proof Counter */}
          <div className="mt-6 max-w-lg mx-auto">
            <SocialProofCounter variant="compact" />
          </div>

          {/* Emergency nudge */}
          <div className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border"
            style={{ borderColor: "rgba(220,38,38,0.35)", color: "#f87171", background: "rgba(220,38,38,0.06)" }}>
            🔥 {pricing.emergencyText}{" "}
            <a href={`${prefix}/emergency`} className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
              {pricing.emergencyLink}
            </a>
          </div>
        </div>
      </section>

      <Container>
        <div className="pb-20">

          {/* Coupon banner — appears when ?coupon=CODE is in URL */}
          <CouponBanner />

          {/* ── Feature Comparison Table ── */}
          <section id="compare" className="mb-12 overflow-x-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-5 text-center">
              {pricing.featureComparison}
            </div>
            <table className="w-full min-w-[900px] text-sm border-separate border-spacing-y-0">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-mono text-xs uppercase tracking-widest w-2/5">Feature</th>
                  <th className="py-3 px-4 text-center font-black text-[#00ff9d] text-xs uppercase tracking-wider">Free<br /><span className="font-normal text-gray-500 normal-case">0 € / immer</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#00b8ff] text-xs uppercase tracking-wider">Starter<br /><span className="font-normal text-gray-500 normal-case">29 € / Mo</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#a78bfa] text-xs uppercase tracking-wider">Pro<br /><span className="font-normal text-gray-500 normal-case">99 € / Mo</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#22c55e] text-xs uppercase tracking-wider">Scale<br /><span className="font-normal text-gray-500 normal-case">249 € / Mo</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#ffaa00] text-xs uppercase tracking-wider">Enterprise<br /><span className="font-normal text-gray-500 normal-case">Custom</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Security Check (Score + Headers)",
                    free: "✓",
                    daypass: "✓",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "CVE Fix Guides (30+)",
                    free: "✓",
                    daypass: "✓",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Public Runbooks Browse",
                    free: "3 / Monat",
                    daypass: "✓",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Copilot Chat",
                    free: "✕",
                    daypass: "✓",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Saved Security Checks",
                    free: "✕",
                    daypass: `Max. ${TIER_LIMITS.daypass.maxSavedChecks}`,
                    pro: "Unlimited",
                    team: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    label: "Full Remediation Reports",
                    free: "✕",
                    daypass: "✓",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Darwinian Intel Feed",
                    free: "✕",
                    daypass: "✕",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Private Nodes / Private Fork",
                    free: "✕",
                    daypass: "✕",
                    pro: "✓",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Team Sharing & Dashboards",
                    free: "✕",
                    daypass: "✕",
                    pro: "✕",
                    team: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "SSO / SAML",
                    free: "✕",
                    daypass: "✕",
                    pro: "✕",
                    team: "✕",
                    enterprise: "✓",
                  },
                  {
                    label: "Custom Runbooks & API",
                    free: "✕",
                    daypass: "✕",
                    pro: "✕",
                    team: "✕",
                    enterprise: "✓",
                  },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="py-3 px-4 text-gray-300 rounded-l-xl">{row.label}</td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.free === "✕" ? "#4b5563" : "#00ff9d" }}>
                      {row.free}
                    </td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.daypass === "✕" ? "#4b5563" : "#00b8ff" }}>
                      {row.daypass}
                    </td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.pro === "✕" ? "#4b5563" : "#a78bfa" }}>
                      {row.pro}
                    </td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.team === "✕" ? "#4b5563" : "#22c55e" }}>
                      {row.team}
                    </td>
                    <td className="py-3 px-4 text-center rounded-r-xl"
                      style={{ color: row.enterprise === "✕" ? "#4b5563" : "#00ff9d" }}>
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ── Free Explorer Card ── */}
          <div className="mb-8 relative rounded-3xl p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,255,157,0.3) 0%, rgba(0,184,255,0.15) 100%)" }}>
            <div className="rounded-3xl p-7" style={{ background: "#060d0a" }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "#00ff9d" }}>
                      {pricing.freeForeverLabel}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: "rgba(0,255,157,0.1)", color: "#00ff9d", border: "1px solid rgba(0,255,157,0.25)" }}>
                      {pricing.freeNoAccount}
                    </div>
                  </div>
                  <div className="text-xl font-black text-white font-heading">ClawGuru Explorer</div>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">0€</span>
                    <span className="text-sm text-gray-400 pb-1">{pricing.freeForeverPrice}</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-300 leading-relaxed max-w-lg">
                    {pricing.freeExplorerDesc}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-3 md:shrink-0">
                  <a href={`${prefix}/securitycheck`}
                    className="px-8 py-3 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 whitespace-nowrap"
                    style={{ background: "linear-gradient(135deg, #00ff9d 0%, #00b8ff 100%)", boxShadow: "0 0 25px rgba(0,255,157,0.2)" }}>
                    {pricing.freeStartCheckCta}
                  </a>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>✓ {pricing.freeBenefit1}</span>
                    <span>✓ {pricing.freeBenefit2}</span>
                    <span>✓ {pricing.freeBenefit3}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Starter trial card ── */}
          <div className="mb-8 relative rounded-3xl p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(0,184,255,0.5) 0%, rgba(0,184,255,0.05) 100%)" }}>
            <div className="rounded-3xl p-7 flex flex-col md:flex-row md:items-center gap-6" style={{ background: "#0a0f18" }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: "#00b8ff" }}>
                    {pricing.dayPassBadge}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.08)" }}>
                    24h Access
                  </div>
                </div>
                <div className="text-xl font-black text-white font-heading mb-2">Autopilot Starter Trial</div>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-4xl font-black text-white">9€</span>
                  <span className="text-sm text-gray-400 pb-1">{pricing.dayPassOnce}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
                  {pricing.dayPassDesc}
                </p>
              </div>
              <div className="flex flex-col gap-3 md:shrink-0 md:min-w-[220px]">
                <SocialProofBlock locale={locale} />
                <BuyButton
                  product="daypass"
                  label={pricing.dayPassBuyLabel}
                  autoRecommend
                  upgradeSignals={{ workspaces: 1, needsApiExports: false, needsPolicyControls: false }}
                  className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #00b8ff 0%, #0077ff 100%)", boxShadow: "0 0 30px rgba(0,184,255,0.3)" }}
                />
                <div className="text-xs text-gray-500 text-center">{pricing.dayPassMeta}</div>
              </div>
            </div>
          </div>

          {/* ── Pro + Scale with annual/monthly toggle ── */}
          <BillingToggle locale={locale} isDE={isDE} prefix={prefix} />

          {/* ── Who is Pro for? ── */}
          <section className="mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6 text-center">
              {pricing.proWhoFor}
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(SOCIAL_PROOF_CONFIG.proPersonas[locale as keyof typeof SOCIAL_PROOF_CONFIG.proPersonas] || SOCIAL_PROOF_CONFIG.proPersonas.de).map((persona, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
                  <div className="font-semibold text-gray-100 text-base mb-2">{persona.title}</div>
                  <div className="text-sm text-gray-300">{persona.description}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Enterprise API ── */}
          <div id="enterprise" className="mt-10 relative rounded-3xl p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,165,0,0.6) 0%, rgba(255,80,0,0.2) 100%)" }}>
            <div className="rounded-3xl p-8" style={{ background: "#0f0a05" }}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                {/* Left: header + price */}
                <div className="lg:w-64 shrink-0">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#ffaa00" }}>
                    Enterprise · API
                  </div>
                  <div className="text-2xl font-black text-white font-heading">ClawGuru Enterprise</div>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-black text-white">Custom</span>
                    <span className="text-sm text-gray-400 pb-2">{pricing.monthly}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    {pricing.enterpriseDesc}
                  </p>
                  <EnterpriseConciergeButton />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {pricing.enterpriseContact}
                  </div>
                </div>

                {/* Right: features */}
                <div className="flex-1">
                  <FeatureList groups={ENTERPRISE_GROUPS} newBadge={pricing.newBadge} />

                  {/* API quick-start snippet */}
                  <div className="mt-6 rounded-2xl border border-orange-900/40 bg-black/40 p-4">
                    <div className="text-xs font-mono uppercase tracking-[0.15em] text-orange-400 mb-3">
                      API Quick-Start
                    </div>
                    <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`# Alle High-Severity Events abrufen
curl https://clawguru.com/api/intel/feeds \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G --data-urlencode "severity=high"

# Response (JSON – direkt in SIEM importierbar)
{
  "object": "list",
  "total": 3,
  "updatedAt": "2026-02-20T12:00:00Z",
  "items": [
    {
      "id": "inc-001",
      "title": "Exposed Gateway → Token Leakage",
      "severity": "high",
      "category": "exposure",
      "when": "2026-02-20T00:00:00Z",
      "actions": [...],
      "tags": ["gateway", "token", "firewall"]
    }
  ]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Social Proof + Conversion Nudge ── */}
          <div className="mt-10 rounded-3xl border border-white/8 p-8 text-center"
            style={{ background: "rgba(255,255,255,0.015)" }}>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-4">
              Trusted by Security Teams
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <div className="text-3xl font-black text-white">25k+</div>
                <div className="text-xs text-gray-400 mt-1">Indexierte Seiten</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">500+</div>
                <div className="text-xs text-gray-400 mt-1">Runbooks & Playbooks</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">16</div>
                <div className="text-xs text-gray-400 mt-1">Sprachen</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">30+</div>
                <div className="text-xs text-gray-400 mt-1">CVE Fix Guides</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
                style={{ background: "rgba(0,255,157,0.04)" }}>
                <span style={{ color: "#00ff9d" }}>🛡</span>
                <span className="text-gray-300">DSGVO / GDPR konform</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
                style={{ background: "rgba(0,184,255,0.04)" }}>
                <span style={{ color: "#00b8ff" }}>🔒</span>
                <span className="text-gray-300">Zero-Knowledge Checks</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
                style={{ background: "rgba(139,92,246,0.04)" }}>
                <span style={{ color: "#a78bfa" }}>⚡</span>
                <span className="text-gray-300">Self-Hosted ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10"
                style={{ background: "rgba(255,165,0,0.04)" }}>
                <span style={{ color: "#ffaa00" }}>🇪🇺</span>
                <span className="text-gray-300">EU-first, kein Cloud Lock-in</span>
              </div>
            </div>
          </div>

          {/* ── Testimonials Section ── */}
          <div className="mt-10">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6 text-center">
              Was Security Teams sagen
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-sm text-gray-300 leading-relaxed mb-4">
                  "ClawGuru hat uns 3 CVEs entdeckt, die wir komplett übersehen hatten. Die Runbooks waren direkt anwendbar — 2 Stunden später war alles gepatcht."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    MK
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Michael K.</div>
                    <div className="text-xs text-gray-500">DevOps Lead, FinTech Startup</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-sm text-gray-300 leading-relaxed mb-4">
                  "Der Security Check ist brutal schnell. 30 Sekunden und wir wissen, ob unsere K8s Cluster exposed sind. Pro ist jeden Cent wert."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    SL
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Sarah L.</div>
                    <div className="text-xs text-gray-500">Platform Engineer, SaaS Company</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="text-sm text-gray-300 leading-relaxed mb-4">
                  "Endlich eine Security-Plattform, die DSGVO-konform ist und keine Cloud-Abhängigkeiten. ClawGuru passt perfekt zu unserer Self-Hosted Strategie."
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                    TW
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Thomas W.</div>
                    <div className="text-xs text-gray-500">CTO, Enterprise Software</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              [pricing.instantAccess, pricing.instantAccessDesc],
              [pricing.noAccount, pricing.noAccountDesc],
              [pricing.paymentIssue, pricing.paymentIssueDesc],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/8 p-5"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="font-semibold text-white text-sm">{title}</div>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12 rounded-3xl border border-white/10 p-8" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-6">FAQ</div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-gray-300">
              <div>
                <div className="font-semibold text-white">{pricing.faqDuration}</div>
                <p className="mt-1 text-gray-400">{pricing.faqDurationA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{pricing.faqTransfer}</div>
                <p className="mt-1 text-gray-400">{pricing.faqTransferA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{pricing.faqNoAccess}</div>
                <p className="mt-1 text-gray-400">{pricing.faqNoAccessA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{pricing.faqCancel}</div>
                <p className="mt-1 text-gray-400">{pricing.faqCancelA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{pricing.faqNewPro}</div>
                <p className="mt-1 text-gray-400">{pricing.faqNewProA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{pricing.faqIntelligence}</div>
                <p className="mt-1 text-gray-400">{pricing.faqIntelligenceA}</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            {[
              [`${prefix}/check`, "Security Check"],
              [`${prefix}/score`, "Score + Badge"],
              [`${prefix}/runbooks`, "Runbooks"],
              [`${prefix}/live`, "OpsWall Live"],
              [`${prefix}/mission-control`, "Mission Control"],
              [`${prefix}/threatmap`, "ThreatMap"],
              [`${prefix}/recover`, pricing.recoverLink],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200">
                {label}
              </a>
            ))}
          </div>

        </div>
      </Container>

      {/* TASK A3: Exit-Intent Popup with €5 discount */}
      <ExitIntentPopup couponCode="SAVE5" discountAmount="€5" />
    </main>
  )
}
