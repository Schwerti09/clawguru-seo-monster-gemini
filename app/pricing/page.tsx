import Container from "@/components/shared/Container"
import BuyButton from "@/components/commerce/BuyButton"
import EnterpriseConciergeButton from "@/components/enterprise/EnterpriseConciergeButton"
import { SEO_TARGET_KEYWORDS_2026 } from "@/lib/seo/targets"
import { TIER_LIMITS } from "@/lib/feature-gating"
import { headers } from "next/headers"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"

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

function getDayPassGroups(dict: Awaited<ReturnType<typeof getDictionary>>): FeatureGroup[] {
  return [
    {
      heading: dict.pricing.grpSecurity,
      items: [
        { label: "Live Security Score – Top-3 in 30s" },
        { label: "Zero-Knowledge Check (privacy-first)", isNew: true },
        { label: "Config Validator: Docker, Nginx, YAML", isNew: true },
        { label: "Security Badge Generator (shareable)" },
      ]
    },
    {
      heading: dict.pricing.grpOps,
      items: [
        { label: "OpsWall Live – Trends & Hot Fixes" },
        { label: "ThreatMap – Real-Time Threat Visualisation", isNew: true },
        { label: "Mission Control Dashboard", isNew: true },
        { label: "Incident Playbooks" },
      ]
    },
    {
      heading: dict.pricing.grpKnowledge,
      items: [
        { label: "Vault: 500+ Runbooks & Blueprints" },
        { label: "Hardening, Recovery, Stripe/Webhooks & more" },
        { label: "Copilot Chat – AI assistant for Debug & Ops" },
      ]
    },
    {
      heading: dict.pricing.grpLimits,
      items: [
        { label: `Max. ${TIER_LIMITS.daypass.maxSavedChecks} Saved Security Checks` },
        { label: `Voice Copilot: ${dict.pricing.voiceCopilotLimited}`, isComing: true },
        { label: "No Private Nodes / Private Forks" },
      ]
    },
  ]
}

function getProGroups(dict: Awaited<ReturnType<typeof getDictionary>>): FeatureGroup[] {
  return [
    {
      heading: dict.pricing.grpAllDayPass,
      items: [
        { label: "Permanent full access (no expiry)" },
        { label: "All Security & Ops Tools without time limit" },
      ]
    },
    {
      heading: dict.pricing.grpFeatureUnlocks,
      items: [
        { label: "Unlimited Saved Security Checks", isNew: true },
        { label: "Private Nodes & Private Forks", isComing: true },
        { label: "Voice Copilot – unlimited", isComing: true },
        { label: "Darwinian Feed – personalised Intel Feed", isNew: true },
      ]
    },
    {
      heading: dict.pricing.grpIntelligence,
      items: [
        { label: "Temporal Intelligence – time-based Threats", isNew: true },
        { label: "Neuro Intelligence – AI-driven Insights", isNew: true },
        { label: "ClawVerse – semantic Knowledge Graph", isNew: true },
        { label: "Living Mycelium – 1M+ Knowledge Nodes", isNew: true },
      ]
    },
    {
      heading: dict.pricing.grpDeployment,
      items: [
        { label: "SWARM Deployment Simulator", isComing: true },
        { label: "Provenance Chain – Source Tracking", isNew: true },
        { label: "Issue Tracker + Fix Repository", isNew: true },
      ]
    },
    {
      heading: dict.pricing.grpProExtras,
      items: [
        { label: "Pro Runbooks – ongoing updates" },
        { label: "Copilot: higher limits (fair-use)" },
        { label: "Priority: new features & topics first" },
      ]
    },
  ]
}

function getTeamGroups(dict: Awaited<ReturnType<typeof getDictionary>>): FeatureGroup[] {
  return [
    {
      heading: dict.pricing.grpAllPro,
      items: [
        { label: "Full access to all Intelligence & Ops Layers" },
        { label: "All SWARM, Neuro & Provenance Features" },
      ]
    },
    {
      heading: dict.pricing.grpTeamCollab,
      items: [
        { label: "Shared Runbook Links & Playbooks", isComing: true },
        { label: "Shared Mission Control (Team Dashboard)", isComing: true },
        { label: "Higher limits for all members (fair-use)" },
      ]
    },
    {
      heading: dict.pricing.grpRoadmap,
      items: [
        { label: "Roadmap Votes – determines what gets built next", isComing: true },
        { label: "Early Access to new features" },
      ]
    },
  ]
}

function getEnterpriseGroups(dict: Awaited<ReturnType<typeof getDictionary>>): FeatureGroup[] {
  return [
    {
      heading: dict.pricing.grpAllPro,
      items: [
        { label: "Full access to all Pro Features" },
      ]
    },
    {
      heading: dict.pricing.grpEnterpriseUnlocks,
      items: [
        { label: "SSO / SAML Integration", isComing: true },
        { label: "Team Sharing & Shared Dashboards", isComing: true },
        { label: "Custom Runbooks – own Runbook Builder", isComing: true },
      ]
    },
    {
      heading: dict.pricing.grpIntelFeedApi,
      items: [
        { label: "REST/JSON API – directly integratable into SIEM", isNew: true },
        { label: "API Key Authentication (Bearer / X-API-Key)", isNew: true },
        { label: "Filter by Severity & Category", isNew: true },
        { label: "Machine-readable Timestamps & Tags (STIX-compatible)", isNew: true },
      ]
    },
    {
      heading: dict.pricing.grpEnterpriseSupport,
      items: [
        { label: "Dedicated API Key (revocable)", isNew: true },
        { label: "SLA Guarantee & Priority Support" },
        { label: "Custom Onboarding & Integration Calls" },
      ]
    },
  ]
}

export default async function PricingPage() {
  const h = headers()
  const locale = (h.get("x-claw-locale") ?? DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  const DAY_PASS_GROUPS = getDayPassGroups(dict)
  const PRO_GROUPS = getProGroups(dict)
  const TEAM_GROUPS = getTeamGroups(dict)
  const ENTERPRISE_GROUPS = getEnterpriseGroups(dict)
  return (
    <main className="min-h-screen bg-[#05060A]">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-10 text-center px-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,184,255,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}>
            {dict.pricing.accessBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-heading text-white leading-tight">
            {dict.pricing.title}
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            {dict.pricing.subtitle}
          </p>
          {/* Emergency nudge */}
          <div className="mt-5 inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border"
            style={{ borderColor: "rgba(220,38,38,0.35)", color: "#f87171", background: "rgba(220,38,38,0.06)" }}>
            🔥 {dict.pricing.emergencyText}{" "}
            <a href={`${prefix}/emergency`} className="underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
              {dict.pricing.emergencyLink}
            </a>
          </div>
        </div>
      </section>

      <Container>
        <div className="pb-20">


          

          {/* ── Feature Comparison Table ── */}
          <section id="compare" className="mb-12 overflow-x-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500 mb-5 text-center">
              {dict.pricing.featureComparison}
            </div>
            <table className="w-full min-w-[640px] text-sm border-separate border-spacing-y-0">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-mono text-xs uppercase tracking-widest w-1/2">Feature</th>
                  <th className="py-3 px-4 text-center font-black text-[#00b8ff] text-xs uppercase tracking-wider">Day Pass<br /><span className="font-normal text-gray-500 normal-case">9 € / 24h</span></th>
                  <th className="py-3 px-4 text-center font-black text-[#a78bfa] text-xs uppercase tracking-wider">Pro<br /><span className="font-normal text-gray-500 normal-case">49 € / Mo</span></th>
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
                    daypass: dict.pricing.voiceCopilotLimited,
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
                      {dict.pricing.dayPassBadge}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Day Pass</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.08)" }}>
                    24h Access
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">9€</span>
                  <span className="text-sm text-gray-400 pb-2">{dict.pricing.dayPassOnce}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {dict.pricing.dayPassDesc}
                </p>

                <FeatureList groups={DAY_PASS_GROUPS} newBadge={dict.pricing.newBadge} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="daypass"
                    label={"Day Pass kaufen (9€) → Stripe"}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #00b8ff 0%, #0077ff 100%)", boxShadow: "0 0 30px rgba(0,184,255,0.3)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {dict.pricing.dayPassMeta}
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
                {dict.pricing.mostPopular}
              </div>
              <div className="h-full rounded-3xl p-7 flex flex-col" style={{ background: "#0d0a18" }}>
                <div className="flex items-start justify-between gap-3 mt-3">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "#a78bfa" }}>
                      {dict.pricing.proBadge}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Pro</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.1)" }}>
                    Pro
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">49€</span>
                  <span className="text-sm text-gray-400 pb-2">{dict.pricing.monthly}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {dict.pricing.proDesc}
                </p>

                <FeatureList groups={PRO_GROUPS} newBadge={dict.pricing.newBadge} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="pro"
                    label={"Pro starten (49€/Monat) → Stripe"}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #a78bfa 0%, #00ff9d 100%)", boxShadow: "0 0 30px rgba(139,92,246,0.35)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {dict.pricing.cancelable}
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
                      {dict.pricing.teamBadge}
                    </div>
                    <div className="text-xl font-black text-white font-heading">ClawGuru Teams</div>
                  </div>
                  <div className="shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                    style={{ borderColor: "rgba(0,255,157,0.3)", color: "#00ff9d", background: "rgba(0,255,157,0.06)" }}>
                    Teams
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-black text-white">129€</span>
                  <span className="text-sm text-gray-400 pb-2">{dict.pricing.monthly}</span>
                </div>

                <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                  {dict.pricing.teamDesc}
                </p>

                <FeatureList groups={TEAM_GROUPS} newBadge={dict.pricing.newBadge} />

                <div className="mt-auto pt-6">
                  <BuyButton
                    product="team"
                    label={"Teams starten (129€/Monat) → Stripe"}
                    className="w-full py-3 px-6 rounded-2xl font-black text-sm text-white border transition-all duration-300 hover:bg-white/5 disabled:opacity-60"
                    style={{ borderColor: "rgba(0,255,157,0.4)", boxShadow: "0 0 20px rgba(0,255,157,0.1)" }}
                  />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {dict.pricing.cancelable}
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
                    <span className="text-sm text-gray-400 pb-2">{dict.pricing.monthly}</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    {dict.pricing.enterpriseDesc}
                  </p>
                  <EnterpriseConciergeButton />
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    {dict.pricing.enterpriseContact}
                  </div>
                </div>

                {/* Right: features */}
                <div className="flex-1">
                  <FeatureList groups={ENTERPRISE_GROUPS} newBadge={dict.pricing.newBadge} />

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

          {/* Info strip */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              [dict.pricing.instantAccess, dict.pricing.instantAccessDesc],
              [dict.pricing.noAccount, dict.pricing.noAccountDesc],
              [dict.pricing.paymentIssue, dict.pricing.paymentIssueDesc],
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
                <div className="font-semibold text-white">{dict.pricing.faqDuration}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqDurationA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{dict.pricing.faqTransfer}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqTransferA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{dict.pricing.faqNoAccess}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqNoAccessA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{dict.pricing.faqCancel}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqCancelA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{dict.pricing.faqNewPro}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqNewProA}</p>
              </div>
              <div>
                <div className="font-semibold text-white">{dict.pricing.faqIntelligence}</div>
                <p className="mt-1 text-gray-400">{dict.pricing.faqIntelligenceA}</p>
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
              [`${prefix}/recover`, dict.pricing.recoverLink],
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
