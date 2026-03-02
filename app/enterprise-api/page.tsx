import Container from "@/components/shared/Container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Enterprise API | ClawGuru – Security Intel for SIEM & SOAR",
  description:
    "Integrate ClawGuru Security-Intel feeds directly into your SIEM or SOAR system via REST API. Usage-based pricing, OpenAPI-documented, enterprise-grade reliability.",
  alternates: { canonical: "/enterprise-api" },
}

const C = {
  green: "#00ff9d",
  cyan: "#00b8ff",
  orange: "#ff9500",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.03)",
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-black text-white text-base mb-2">{title}</div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

// ── Use Case Row ──────────────────────────────────────────────────────────────
function UseCaseRow({ number, title, description, code }: { number: string; title: string; description: string; code: string }) {
  return (
    <div
      className="rounded-2xl p-6 mb-4"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 size-9 rounded-full flex items-center justify-center text-sm font-black"
          style={{ background: "rgba(0,184,255,0.15)", color: C.cyan }}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-white mb-1">{title}</div>
          <p className="text-sm text-gray-400 mb-3">{description}</p>
          <pre
            className="rounded-xl p-3 text-xs font-mono overflow-x-auto"
            style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${C.border}`, color: "#e2e8f0" }}
          >
            <code>{code.trim()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

// ── Pricing Tier ──────────────────────────────────────────────────────────────
function PricingTier({
  name,
  price,
  unit,
  included,
  features,
  highlighted,
}: {
  name: string
  price: string
  unit: string
  included: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{
        background: highlighted ? "rgba(0,255,157,0.05)" : C.card,
        border: `1px solid ${highlighted ? "rgba(0,255,157,0.3)" : C.border}`,
      }}
    >
      {highlighted && (
        <div
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 self-start px-2 py-[3px] rounded-full"
          style={{ background: "rgba(0,255,157,0.15)", color: C.green }}
        >
          Most Popular
        </div>
      )}
      <div className="font-black text-white text-lg mb-1">{name}</div>
      <div className="mb-1">
        <span className="text-3xl font-black text-white">{price}</span>
        <span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-gray-500 mb-4">{included}</div>
      <ul className="space-y-2 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="shrink-0 mt-[2px] size-[16px] rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "rgba(0,255,157,0.12)", color: C.green }}>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EnterpriseApiPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden border-b"
        style={{ borderColor: C.border, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,184,255,0.07) 0%, transparent 70%), #060608" }}
      >
        <Container>
          <div className="py-24 text-center max-w-4xl mx-auto">
            <div className="mb-4 text-xs font-mono tracking-[0.3em] uppercase" style={{ color: C.cyan }}>
              Enterprise API · For CTOs, Security Engineers &amp; SIEM/SOAR Teams
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.04] tracking-tight mb-6">
              Security Intel,<br />
              <span style={{ color: C.green }}>Delivered as API</span>
            </h1>

            {/* CTO Pitch Text */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Stop copying IOCs from a browser tab into your SIEM. ClawGuru&apos;s REST API puts
              curated threat intelligence, automated indicator checks, and battle-tested remediation
              runbooks directly inside your security stack — <strong className="text-white">where
              decisions actually happen</strong>.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/api-docs"
                className="inline-block px-8 py-4 rounded-2xl font-black text-sm text-black transition-all duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  background: `linear-gradient(135deg, ${C.cyan}, ${C.green})`,
                }}
              >
                View API Reference →
              </a>
              <a
                href="/pricing"
                className="inline-block px-8 py-4 rounded-2xl font-black text-sm text-white border transition-all duration-200 hover:bg-white/5"
                style={{ borderColor: C.border }}
              >
                See Pricing
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Pitch: Why API over Web UI */}
      <section className="py-20 border-b" style={{ borderColor: C.border }}>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: C.green }}>
              Why API-First?
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
              Your SIEM doesn&apos;t have a browser tab.
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,61,90,0.04)", border: "1px solid rgba(255,61,90,0.15)" }}
              >
                <div className="text-sm font-black text-red-400 mb-3">Web UI approach (what most teams do)</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {[
                    "Analyst manually copies IOC from threat report",
                    "Pastes it into ClawGuru web UI",
                    "Reads assessment, then manually creates SIEM rule",
                    "Zero audit trail from intel source to detection rule",
                    "Doesn't scale beyond 10 indicators/day",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-red-400 shrink-0">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(0,255,157,0.04)", border: "1px solid rgba(0,255,157,0.15)" }}
              >
                <div className="text-sm font-black mb-3" style={{ color: C.green }}>ClawGuru API approach</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  {[
                    "SOAR ingests IOC, auto-calls /v1/check-indicator",
                    "Risk score + tags returned in &lt;200ms",
                    "SIEM rule created automatically from API response",
                    "Full audit trail: indicator → intel source → detection rule",
                    "Scales to 100,000+ indicators/day with metered billing",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="shrink-0" style={{ color: C.green }}>✓</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-gray-400 text-base">
              Enterprise security teams run at machine speed. When a phishing campaign hits at 2 AM,
              you don&apos;t want a human opening a browser — you want your SOAR to automatically
              score every new IOC, pull the relevant runbook, and trigger remediation within seconds.
              That&apos;s what the ClawGuru API is built for.
            </p>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-20 border-b" style={{ borderColor: C.border }}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: C.cyan }}>
              API Capabilities
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-10">Three endpoints. Unlimited power.</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon="🎯"
                title="Indicator Check"
                description="POST /v1/check-indicator — assess any IP, domain, hash, or URL against ClawGuru threat intel in real time. Returns risk score, tags, and SIEM-ready action recommendations."
              />
              <FeatureCard
                icon="📡"
                title="Intel Feed"
                description="GET /v1/intel-feed/latest — subscribe to curated, analyst-reviewed threat intelligence. Filter by severity and category. Pipe directly into Splunk, Elastic SIEM, or Microsoft Sentinel."
              />
              <FeatureCard
                icon="📖"
                title="Runbook Retrieval"
                description="GET /v1/runbook/{'{id}'} — programmatically fetch step-by-step remediation playbooks. Your SOAR can attach the right runbook to every incident ticket automatically."
              />
              <FeatureCard
                icon="💳"
                title="Usage-Based Billing"
                description="Pay only for what you use. Each API call reports one unit to Stripe Metered Billing. No seat licenses. No upfront commitments. Scale from 100 to 10 million calls without renegotiating a contract."
              />
              <FeatureCard
                icon="🔐"
                title="Enterprise Security"
                description="API key authentication with per-key rate limiting and usage tracking. Keys are scoped to Stripe subscription items for isolated billing per team or product."
              />
              <FeatureCard
                icon="📐"
                title="OpenAPI Documented"
                description="Full OpenAPI/Swagger-style reference. Generate client SDKs in any language with a single command. Integrate into your existing API gateway or service mesh in under an hour."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Integration Examples */}
      <section className="py-20 border-b" style={{ borderColor: C.border }}>
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: C.green }}>
              Integration Examples
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
              From zero to integrated in &lt; 1 hour.
            </h2>

            <UseCaseRow
              number="1"
              title="SIEM: Auto-enrich alerts with threat context"
              description="Add ClawGuru enrichment to every Splunk, Elastic, or Sentinel alert containing an IP or domain. One lookup. Full context."
              code={`# Splunk SOAR Playbook (Python)
import requests

def enrich_indicator(indicator, indicator_type):
    resp = requests.post(
        "https://clawguru.org/api/v1/check-indicator",
        headers={"X-Api-Key": os.environ["CLAWGURU_API_KEY"]},
        json={"indicator": indicator, "type": indicator_type},
        timeout=5,
    )
    data = resp.json()
    return {
        "risk": data["risk"],
        "score": data["score"],
        "tags": data["tags"],
        "actions": data["actions"],
    }`}
            />

            <UseCaseRow
              number="2"
              title="SOAR: Attach the right runbook to every incident"
              description="When your SOAR creates an incident ticket, automatically fetch and attach the relevant ClawGuru runbook as a remediation guide."
              code={`// SOAR Automation (TypeScript / Tines)
const runbook = await fetch(
  \`https://clawguru.org/api/v1/runbook/\${incidentType}\`,
  { headers: { "X-Api-Key": process.env.CLAWGURU_API_KEY } }
).then(r => r.json())

await jira.createComment(ticketId, \`
## Remediation Runbook: \${runbook.title}
\${runbook.steps.map((s, i) => \`\${i+1}. \${s}\`).join("\\n")}
\`)`}
            />

            <UseCaseRow
              number="3"
              title="CI/CD: Block deploys containing risky dependencies"
              description="Integrate ClawGuru into your GitHub Actions pipeline to check domain/hash indicators from npm audit or trivy scans before deploying."
              code={`# GitHub Actions – Indicator Check Step
- name: Check suspicious domain
  run: |
    RESULT=$(curl -s -X POST \\
      -H "X-Api-Key: \${{ secrets.CLAWGURU_API_KEY }}" \\
      -H "Content-Type: application/json" \\
      -d '{"indicator":"'\$DOMAIN'","type":"domain"}' \\
      https://clawguru.org/api/v1/check-indicator)
    RISK=$(echo $RESULT | jq -r '.risk')
    if [ "$RISK" = "high" ]; then
      echo "High-risk indicator detected. Blocking deploy."
      exit 1
    fi`}
            />
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="py-20 border-b" style={{ borderColor: C.border }}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: C.cyan }}>
              API Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Usage-based. No surprises.
            </h2>
            <p className="text-gray-400 text-base mb-10 max-w-xl">
              Powered by Stripe Metered Billing. Each API call is one unit.
              Bills are generated at the end of each monthly period.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <PricingTier
                name="Starter"
                price="$0.05"
                unit="per call"
                included="Up to 10,000 calls/mo"
                features={[
                  "All 3 API endpoints",
                  "60 req/min rate limit",
                  "Standard support",
                  "OpenAPI docs",
                  "Usage dashboard",
                ]}
              />
              <PricingTier
                name="Growth"
                price="$0.03"
                unit="per call"
                included="10k–100k calls/mo"
                features={[
                  "All 3 API endpoints",
                  "300 req/min rate limit",
                  "Priority support",
                  "Webhook usage alerts",
                  "Volume discount above 100k",
                ]}
                highlighted
              />
              <PricingTier
                name="Enterprise"
                price="Custom"
                unit="SLA"
                included="100,000+ calls/mo"
                features={[
                  "All 3 API endpoints",
                  "Unlimited rate limit",
                  "Dedicated SLA",
                  "Custom Intel Feed filters",
                  "On-premises option",
                ]}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <Container>
          <div
            className="max-w-3xl mx-auto rounded-3xl p-12 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,184,255,0.08) 0%, rgba(0,255,157,0.06) 100%)",
              border: "1px solid rgba(0,255,157,0.2)",
            }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: C.green }}>
              Ready to integrate?
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Get your Enterprise API key today.
            </h2>
            <p className="text-gray-400 text-base mb-8 max-w-xl mx-auto">
              Start with the API reference, then reach out for an Enterprise key.
              First 500 calls are on us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/api-docs"
                className="inline-block px-8 py-4 rounded-2xl font-black text-sm text-black transition-all duration-200 hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.green})` }}
              >
                API Reference →
              </a>
              <a
                href="mailto:enterprise@clawguru.org"
                className="inline-block px-8 py-4 rounded-2xl font-black text-sm text-white border transition-all duration-200 hover:bg-white/5"
                style={{ borderColor: C.border }}
              >
                Contact Enterprise Sales
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
