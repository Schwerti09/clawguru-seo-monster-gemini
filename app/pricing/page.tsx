import { cookies } from "next/headers"
import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"
import EnterpriseContact from "@/components/marketing/EnterpriseContact"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { TIER_LIMITS } from "@/lib/feature-gating"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

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
  title: "Day Pass | ClawGuru – Sofortzugang für Security Incidents",
  description:
    "Security Incident? Day Pass: 24h Vollzugriff auf alle Runbooks, Log4j-Check, Ransomware Playbooks, Copilot & mehr. Einmal zahlen, sofort loslegen – kein Abo-Approval nötig.",
  keywords: PRICING_KEYWORDS,
  alternates: { canonical: "/pricing" }
}

type Feature = { label: string; isNew?: boolean }
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
                  style={{ background: "rgba(0,255,157,0.12)", color: "#00ff9d" }} aria-hidden="true">✓</span>
                <span className="leading-snug">
                  {item.label}
                  {item.isNew && (
                    <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-[6px] py-[2px] rounded-full align-middle"
                      style={{ background: "rgba(0,184,255,0.18)", color: "#00b8ff" }}>
                      {newBadge}
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

function getDayPassGroups(locale: Locale): FeatureGroup[] {
  return [
    {
      heading: t(locale, "pricingGrpSecurity"),
      items: [
        { label: "Live Security Score – Top-3 in 30s" },
        { label: "Zero-Knowledge Check (privacy-first)", isNew: true },
        { label: "Config Validator: Docker, Nginx, YAML", isNew: true },
        { label: "Security Badge Generator (shareable)" },
      ]
    },
    {
      heading: t(locale, "pricingGrpOps"),
      items: [
        { label: "OpsWall Live – Trends & Hot Fixes" },
        { label: "ThreatMap – Real-Time Threat Visualisation", isNew: true },
        { label: "Mission Control Dashboard", isNew: true },
        { label: "Incident Playbooks" },
      ]
    },
    {
      heading: t(locale, "pricingGrpKnowledge"),
      items: [
        { label: "Vault: 500+ Runbooks & Blueprints" },
        { label: "Hardening, Recovery, Stripe/Webhooks & more" },
        { label: "Copilot Chat – AI assistant for Debug & Ops" },
      ]
    },
    {
      heading: t(locale, "pricingGrpLimits"),
      items: [
        { label: `Max. ${TIER_LIMITS.daypass.maxSavedChecks} Saved Security Checks` },
        { label: `Voice Copilot: ${t(locale, "pricingVoiceCopilotLimited")}` },
        { label: "No Private Nodes / Private Forks" },
      ]
    },
  ]
}

function getProGroups(locale: Locale): FeatureGroup[] {
  return [
    {
      heading: t(locale, "pricingGrpAllDayPass"),
      items: [
        { label: "Permanent full access (no expiry)" },
        { label: "All Security & Ops Tools without time limit" },
      ]
    },
    {
      heading: t(locale, "pricingGrpFeatureUnlocks"),
      items: [
        { label: "Unlimited Saved Security Checks", isNew: true },
        { label: "Private Nodes & Private Forks", isNew: true },
        { label: "Voice Copilot – unlimited", isNew: true },
        { label: "Darwinian Feed – personalised Intel Feed", isNew: true },
      ]
    },
    {
      heading: t(locale, "pricingGrpIntelligence"),
      items: [
        { label: "Temporal Intelligence – time-based Threats", isNew: true },
        { label: "Neuro Intelligence – AI-driven Insights", isNew: true },
        { label: "ClawVerse – semantic Knowledge Graph", isNew: true },
        { label: "Living Mycelium – 1M+ Knowledge Nodes", isNew: true },
      ]
    },
    {
      heading: t(locale, "pricingGrpDeployment"),
      items: [
        { label: "SWARM Deployment Simulator", isNew: true },
        { label: "Provenance Chain – Source Tracking", isNew: true },
        { label: "Issue Tracker + Fix Repository", isNew: true },
      ]
    },
    {
      heading: t(locale, "pricingGrpProExtras"),
      items: [
        { label: "Pro Runbooks – ongoing updates" },
        { label: "Copilot: higher limits (fair-use)" },
        { label: "Priority: new features & topics first" },
      ]
    },
  ]
}

function getTeamGroups(locale: Locale): FeatureGroup[] {
  return [
    {
      heading: t(locale, "pricingGrpAllPro"),
      items: [
        { label: "Full access to all Intelligence & Ops Layers" },
        { label: "All SWARM, Neuro & Provenance Features" },
      ]
    },
    {
      heading: t(locale, "pricingGrpTeamCollab"),
      items: [
        { label: "Shared Runbook Links & Playbooks", isNew: true },
        { label: "Shared Mission Control (Team Dashboard)", isNew: true },
        { label: "Higher limits for all members (fair-use)" },
      ]
    },
    {
      heading: t(locale, "pricingGrpRoadmap"),
      items: [
        { label: "Roadmap Votes – determines what gets built next" },
        { label: "Early Access to new features" },
      ]
    },
  ]
}

function getEnterpriseGroups(locale: Locale): FeatureGroup[] {
  return [
    {
      heading: t(locale, "pricingGrpAllPro"),
      items: [
        { label: "Full access to all Pro Features" },
      ]
    },
    {
      heading: t(locale, "pricingGrpEnterpriseUnlocks"),
      items: [
        { label: "SSO / SAML Integration", isNew: true },
        { label: "Team Sharing & Shared Dashboards", isNew: true },
        { label: "Custom Runbooks – own Runbook Builder", isNew: true },
      ]
    },
    {
      heading: t(locale, "pricingGrpIntelFeedApi"),
      items: [
        { label: "REST/JSON API – directly integratable into SIEM", isNew: true },
        { label: "API Key Authentication (Bearer / X-API-Key)", isNew: true },
        { label: "Filter by Severity & Category", isNew: true },
        { label: "Machine-readable Timestamps & Tags (STIX-compatible)", isNew: true },
      ]
    },
    {
      heading: t(locale, "pricingGrpEnterpriseSupport"),
      items: [
        { label: "Dedicated API Key (revocable)", isNew: true },
        { label: "SLA Guarantee & Priority Support" },
        { label: "Custom Onboarding & Integration Calls" },
      ]
    },
  ]
}

export default async function PricingPage() {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("cg_locale")?.value
  const locale: Locale = SUPPORTED_LOCALES.includes(localeCookie as Locale) ? (localeCookie as Locale) : "de"

  const DAY_PASS_GROUPS = getDayPassGroups(locale)
  const PRO_GROUPS = getProGroups(locale)
  const TEAM_GROUPS = getTeamGroups(locale)
  const ENTERPRISE_GROUPS = getEnterpriseGroups(locale)
  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,184,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}>
            {t(locale, "pricingAccessBadge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            {t(locale, "pricingTitle")}
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            {t(locale, "pricingSubtitle")}
          </p>
          {/* Emergency nudge */}
          <div className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border"
            style={{ borderColor: "rgba(220,38,38,0.35)", color: "#f87171", background: "rgba(220,38,38,0.06)" }}>
            🔥 {t(locale, "pricingEmergencyText")} <a href="/emergency" className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">{t(locale, "pricingEmergencyLink")}</a>
          </div>
        </div>
      </section>

      <Container>
        <div className="pb-20">

          {/* ── Feature Comparison Table ── */}
          <section id="compare" className="mb-12 overflow-x-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-5 text-center">
              {t(locale, "pricingFeatureComparison")}
            </div>
            <table className="w-full min-w-[640px] text-sm border-separate border-spacing-y-0">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-mono text-xs uppercase tracking-widest w-1/2">Feature</th>
                  <th className="py-3 px-4 text-center font-black text-[#00b8ff] text-xs uppercase tracking-wider">Day Pass<br /><span className="font-normal text-gray-500 normal-case">7 € / 24h</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#a78bfa] text-xs uppercase tracking-wider">Pro<br /><span className="font-normal text-gray-500 normal-case">14,99 € / Mo</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#ffaa00] text-xs uppercase tracking-wider">Enterprise<br /><span className="font-normal text-gray-500 normal-case">Custom</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Saved Security Checks",
                    daypass: `Max. ${TIER_LIMITS.daypass.maxSavedChecks}`,
                    pro: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    label: "Private Nodes / Private Fork",
                    daypass: "✕",
                    pro: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Voice Copilot",
                    daypass: t(locale, "pricingVoiceCopilotLimited"),
                    pro: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    label: "Darwinian Feed",
                    daypass: "✕",
                    pro: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "SSO / SAML",
                    daypass: "✕",
                    pro: "✕",
                    enterprise: "✓",
                  },
                  {
                    label: "Team Sharing & Shared Dashboards",
                    daypass: "✕",
                    pro: "✕",
                    enterprise: "✓",
                  },
                  {
                    label: "Custom Runbooks",
                    daypass: "✕",
                    pro: "✕",
                    enterprise: "✓",
                  },
                  {
                    label: "Runbooks & Vault Zugang",
                    daypass: "✓",
                    pro: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Security Check / OpsWall",
                    daypass: "✓",
                    pro: "✓",
                    enterprise: "✓",
                  },
                  {
                    label: "Copilot Chat",
                    daypass: "✓",
                    pro: "✓",
                    enterprise: "✓",
                  },
                ].map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="py-3 px-4 text-gray-300 rounded-l-xl">{row.label}</td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.daypass === "✕" ? "#4b5563" : "#00b8ff" }}>
                      {row.daypass}
                    </td>
                    <td className="py-3 px-4 text-center rounded-none"
                      style={{ color: row.pro === "✕" ? "#4b5563" : "#a78bfa" }}>
                      {row.pro}
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

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">

            {/* ── Day Pass ── */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,184,255,0.5) 0%, rgba(0,184,255,0.05) 100%)" }}>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0a0f18" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#00b8ff" }}>
                      {t(locale, "pricingDayPassBadge")}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Day Pass</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.08)" }}>
                    24h Access
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">7€</span>
                  <span className="text-sm text-gray-400 pb-2">{t(locale, "pricingDayPassOnce")}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {t(locale, "pricingDayPassDesc")}
                </p>

                <FeatureList groups={DAY_PASS_GROUPS} newBadge={t(locale, "pricingNewBadge")} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="daypass"
                    label={t(locale, "pricingDayPassBtn")}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #00b8ff 0%, #0077ff 100%)", boxShadow: "0 0 30px rgba(0,184,255,0.3)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {t(locale, "pricingDayPassMeta")}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pro ── (most popular) */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(0,255,157,0.3) 100%)" }}>
              {/* Popular badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full text-black"
                style={{ background: "linear-gradient(90deg, #00ff9d, #00b8ff)" }}>
                {t(locale, "pricingMostPopular")}
              </div>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0d0a18" }}>
                <div className="flex items-start justify-between gap-3 mt-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#a78bfa" }}>
                      {t(locale, "pricingProBadge")}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Pro</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.1)" }}>
                    Pro
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">14,99€</span>
                  <span className="text-sm text-gray-400 pb-2">{t(locale, "pricingMonthly")}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {t(locale, "pricingProDesc")}
                </p>

                <FeatureList groups={PRO_GROUPS} newBadge={t(locale, "pricingNewBadge")} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="pro"
                    label={t(locale, "pricingProBtn")}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #a78bfa 0%, #00ff9d 100%)", boxShadow: "0 0 30px rgba(139,92,246,0.35)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {t(locale, "pricingCancelable")}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Teams ── */}
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(0,255,157,0.4) 0%, rgba(0,255,157,0.05) 100%)" }}>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#080f0c" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#00ff9d" }}>
                      {t(locale, "pricingTeamBadge")}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Teams</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,255,157,0.3)", color: "#00ff9d", background: "rgba(0,255,157,0.06)" }}>
                    Teams
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">29,99€</span>
                  <span className="text-sm text-gray-400 pb-2">{t(locale, "pricingMonthly")}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {t(locale, "pricingTeamDesc")}
                </p>

                <FeatureList groups={TEAM_GROUPS} newBadge={t(locale, "pricingNewBadge")} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="team"
                    label={t(locale, "pricingTeamBtn")}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-white border transition-all duration-300 hover:bg-white/5 disabled:opacity-60"
                    style={{ borderColor: "rgba(0,255,157,0.4)", boxShadow: "0 0 20px rgba(0,255,157,0.1)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {t(locale, "pricingCancelable")}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    <span className="text-5xl font-black text-white">299€</span>
                    <span className="text-sm text-gray-400 pb-2">{t(locale, "pricingMonthly")}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    {t(locale, "pricingEnterpriseDesc")}
                  </p>
                  <a
                    href="mailto:enterprise@clawguru.org?subject=Enterprise%20Intel%20Feed%20API"
                    className="mt-6 inline-block w-full text-center py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #ffaa00 0%, #ff5000 100%)", boxShadow: "0 0 30px rgba(255,165,0,0.3)" }}
                  >
                    {t(locale, "pricingEnterpriseBtn")}
                  </a>
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {t(locale, "pricingEnterpriseContact")}
                  </div>
                </div>

                {/* Right: features */}
                <div className="flex-1">
                  <FeatureList groups={ENTERPRISE_GROUPS} newBadge={t(locale, "pricingNewBadge")} />

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

          {/* ── Contact Sales ── */}
          <div className="mt-10 relative rounded-3xl p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,165,0,0.4) 0%, rgba(255,80,0,0.1) 100%)" }}>
            <div className="rounded-3xl p-8" style={{ background: "#0f0a05" }}>
              <div className="max-w-xl mx-auto">
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2 text-center" style={{ color: "#ffaa00" }}>
                  Enterprise · Contact Sales
                </div>
                <h2 className="text-2xl font-black text-white font-heading text-center mb-2">
                  {t(locale, "pricingContactSectionTitle")}
                </h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                  {t(locale, "pricingContactSectionDesc")}
                </p>
                <EnterpriseContact />
              </div>
            </div>
          </div>

          {/* Info strip */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              [t(locale, "pricingInstantAccess"), t(locale, "pricingInstantAccessDesc")],
              [t(locale, "pricingNoAccount"), t(locale, "pricingNoAccountDesc")],
              [t(locale, "pricingPaymentIssue"), t(locale, "pricingPaymentIssueDesc")],
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
                <div className="font-semibold text-white">{t(locale, "pricingFaqDuration")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqDurationA")}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{t(locale, "pricingFaqTransfer")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqTransferA")}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{t(locale, "pricingFaqNoAccess")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqNoAccessA")}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{t(locale, "pricingFaqCancel")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqCancelA")}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{t(locale, "pricingFaqNewPro")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqNewProA")}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{t(locale, "pricingFaqIntelligence")}</div>
                <p className="mt-1 text-gray-400">{t(locale, "pricingFaqIntelligenceA")}</p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center text-sm">
            {[
              ["/check", "Security Check"],
              ["/score", "Score + Badge"],
              ["/runbooks", "Runbooks"],
              ["/live", "OpsWall Live"],
              ["/mission-control", "Mission Control"],
              ["/threatmap", "ThreatMap"],
              ["/recover", t(locale, "pricingRecoverLink")],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200">
                {label}
              </a>
            ))}
          </div>

        </div>
      </Container>
    </main>
  )
}
