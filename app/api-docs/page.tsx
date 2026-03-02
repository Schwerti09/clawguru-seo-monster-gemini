import Container from "@/components/shared/Container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Reference | ClawGuru Enterprise",
  description:
    "OpenAPI reference for ClawGuru Enterprise REST API v1. Endpoints: /v1/check-indicator, /v1/intel-feed/latest, /v1/runbook/{id}. Usage-based billing via Stripe Metered.",
  alternates: { canonical: "/api-docs" },
}

// ── Shared design tokens ──────────────────────────────────────────────────────
const C = {
  green: "#00ff9d",
  cyan: "#00b8ff",
  orange: "#ff9500",
  red: "#ff3d5a",
  border: "rgba(255,255,255,0.07)",
  card: "rgba(255,255,255,0.03)",
  tag: {
    get: { bg: "rgba(0,184,255,0.14)", text: "#00b8ff" },
    post: { bg: "rgba(0,255,157,0.14)", text: "#00ff9d" },
    delete: { bg: "rgba(255,61,90,0.14)", text: "#ff3d5a" },
  },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ method }: { method: "GET" | "POST" | "DELETE" }) {
  const s = method === "GET" ? C.tag.get : method === "POST" ? C.tag.post : C.tag.delete
  return (
    <span
      className="inline-block px-2 py-[2px] text-[11px] font-black font-mono rounded tracking-wider uppercase"
      style={{ background: s.bg, color: s.text }}
    >
      {method}
    </span>
  )
}

function StatusBadge({ code }: { code: number }) {
  const color = code < 300 ? C.green : code < 400 ? C.cyan : code < 500 ? C.orange : C.red
  return (
    <span className="text-xs font-mono font-bold" style={{ color }}>
      {code}
    </span>
  )
}

function Code({ children, language = "json" }: { children: string; language?: string }) {
  return (
    <pre
      className="rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed mt-3"
      style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${C.border}`, color: "#e2e8f0" }}
    >
      <code className={`language-${language}`}>{children.trim()}</code>
    </pre>
  )
}

function ParamRow({
  name,
  type,
  required,
  description,
}: {
  name: string
  type: string
  required?: boolean
  description: string
}) {
  return (
    <tr className="border-t" style={{ borderColor: C.border }}>
      <td className="py-2 pr-4 font-mono text-xs align-top" style={{ color: C.green }}>
        {name}
        {required && (
          <span className="ml-1 text-[9px] font-black uppercase tracking-widest" style={{ color: C.red }}>
            *
          </span>
        )}
      </td>
      <td className="py-2 pr-4 font-mono text-xs align-top text-gray-400">{type}</td>
      <td className="py-2 text-xs align-top text-gray-300">{description}</td>
    </tr>
  )
}

function EndpointCard({
  method,
  path,
  title,
  description,
  params,
  requestBody,
  responses,
}: {
  method: "GET" | "POST" | "DELETE"
  path: string
  title: string
  description: string
  params?: { name: string; type: string; required?: boolean; description: string; location: "path" | "query" | "header" | "body" }[]
  requestBody?: string
  responses: { code: number; description: string; example: string }[]
}) {
  const pathParams = params?.filter((p) => p.location === "path") ?? []
  const queryParams = params?.filter((p) => p.location === "query") ?? []
  const headerParams = params?.filter((p) => p.location === "header") ?? []
  const bodyParams = params?.filter((p) => p.location === "body") ?? []

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: C.card, border: `1px solid ${C.border}` }}
    >
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Badge method={method} />
        <span className="font-mono text-sm font-bold text-white">{path}</span>
      </div>
      <div className="text-base font-bold text-white mb-1">{title}</div>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      {headerParams.length > 0 && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Headers</div>
          <table className="w-full mb-4">
            <tbody>
              {headerParams.map((p) => (
                <ParamRow key={p.name} name={p.name} type={p.type} required={p.required} description={p.description} />
              ))}
            </tbody>
          </table>
        </>
      )}

      {pathParams.length > 0 && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Path Parameters</div>
          <table className="w-full mb-4">
            <tbody>
              {pathParams.map((p) => (
                <ParamRow key={p.name} name={p.name} type={p.type} required={p.required} description={p.description} />
              ))}
            </tbody>
          </table>
        </>
      )}

      {queryParams.length > 0 && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Query Parameters</div>
          <table className="w-full mb-4">
            <tbody>
              {queryParams.map((p) => (
                <ParamRow key={p.name} name={p.name} type={p.type} required={p.required} description={p.description} />
              ))}
            </tbody>
          </table>
        </>
      )}

      {bodyParams.length > 0 && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Request Body Fields</div>
          <table className="w-full mb-4">
            <tbody>
              {bodyParams.map((p) => (
                <ParamRow key={p.name} name={p.name} type={p.type} required={p.required} description={p.description} />
              ))}
            </tbody>
          </table>
        </>
      )}

      {requestBody && (
        <>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">Example Request Body</div>
          <Code>{requestBody}</Code>
        </>
      )}

      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mt-5 mb-2">Responses</div>
      {responses.map((r) => (
        <div key={r.code} className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge code={r.code} />
            <span className="text-xs text-gray-400">{r.description}</span>
          </div>
          <Code>{r.example}</Code>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-2 text-xs font-mono tracking-[0.3em] uppercase" style={{ color: C.cyan }}>
          Enterprise REST API · OpenAPI Reference
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          ClawGuru API <span style={{ color: C.green }}>v1</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl">
          Integrate ClawGuru Security-Intel directly into your SIEM, SOAR, or CI/CD pipeline.
          Authenticated with API keys. Usage-based billing via Stripe Metered.
        </p>

        {/* Base URL */}
        <div className="rounded-xl px-5 py-4 mb-10" style={{ background: C.card, border: `1px solid ${C.border}` }}>
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">Base URL</div>
          <code className="text-sm font-mono" style={{ color: C.cyan }}>https://clawguru.org/api/v1</code>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4">Authentication</h2>
          <p className="text-gray-400 text-sm mb-4">
            All endpoints require an Enterprise API key. Pass it in the{" "}
            <code className="text-xs px-1 py-[1px] rounded" style={{ background: "rgba(0,184,255,0.12)", color: C.cyan }}>X-Api-Key</code>{" "}
            header or as a Bearer token.
          </p>
          <Code language="bash">{`# Option A – X-Api-Key header (recommended)
curl -H "X-Api-Key: cg_live_your_key_here" \\
     https://clawguru.org/api/v1/intel-feed/latest

# Option B – Bearer token
curl -H "Authorization: Bearer cg_live_your_key_here" \\
     https://clawguru.org/api/v1/intel-feed/latest`}</Code>
        </section>

        {/* Usage-Based Billing */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4">Usage-Based Billing</h2>
          <p className="text-gray-400 text-sm mb-4">
            ClawGuru API uses <strong className="text-white">Stripe Metered Billing</strong>. Each successful API call
            is automatically reported as one unit of usage to your Stripe subscription.
            You are only billed for what you use — no seat licenses, no flat-fee waste.
          </p>
          <div
            className="rounded-xl p-5 mb-4"
            style={{ background: "rgba(0,255,157,0.04)", border: `1px solid rgba(0,255,157,0.15)` }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: C.green }}>
              Billing Architecture
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span style={{ color: C.green }}>→</span>
                Each API call reports 1 unit to your{" "}
                <code className="text-xs px-1 rounded" style={{ background: "rgba(0,184,255,0.1)", color: C.cyan }}>
                  SubscriptionItem
                </code>{" "}
                via <code className="text-xs px-1 rounded" style={{ background: "rgba(0,184,255,0.1)", color: C.cyan }}>
                  stripe.subscriptionItems.createUsageRecord()
                </code>
              </li>
              <li className="flex gap-2">
                <span style={{ color: C.green }}>→</span>
                Stripe aggregates usage and bills at the end of each billing period
              </li>
              <li className="flex gap-2">
                <span style={{ color: C.green }}>→</span>
                Price per call is defined in your Stripe Price object (
                <code className="text-xs">billing_scheme: per_unit, usage_type: metered</code>)
              </li>
              <li className="flex gap-2">
                <span style={{ color: C.green }}>→</span>
                Overage alerts and spend caps are configurable in the Stripe dashboard
              </li>
            </ul>
          </div>
          <Code language="typescript">{`// Stripe Metered Billing setup (server-side)
const price = await stripe.prices.create({
  currency: "usd",
  unit_amount: 5,          // $0.05 per API call (in cents)
  billing_scheme: "per_unit",
  recurring: {
    interval: "month",
    usage_type: "metered", // aggregated per billing period
    aggregate_usage: "sum",
  },
  product: "prod_ClawGuruEnterpriseAPI",
})

// Each API call increments usage by 1 unit:
await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
  quantity: 1,
  timestamp: Math.floor(Date.now() / 1000),
  action: "increment",
})`}</Code>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th className="pb-2 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Plan</th>
                  <th className="pb-2 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Requests / minute</th>
                  <th className="pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Monthly cap (default)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="py-3 pr-4 font-bold text-white">Starter</td>
                  <td className="py-3 pr-4 text-gray-300">60 req/min</td>
                  <td className="py-3 text-gray-300">10,000 calls</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="py-3 pr-4 font-bold text-white">Growth</td>
                  <td className="py-3 pr-4 text-gray-300">300 req/min</td>
                  <td className="py-3 text-gray-300">100,000 calls</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold text-white">Enterprise</td>
                  <td className="py-3 pr-4 text-gray-300">Unlimited</td>
                  <td className="py-3 text-gray-300">Custom SLA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <h2 className="text-2xl font-black text-white mb-6">Endpoints</h2>

          <EndpointCard
            method="POST"
            path="/v1/check-indicator"
            title="Check Security Indicator"
            description="Assess the risk level of a security indicator (IP address, domain, file hash, or URL) against ClawGuru threat intelligence. Returns a risk score, tags, and recommended actions."
            params={[
              { name: "X-Api-Key", type: "string", required: true, location: "header", description: "Your Enterprise API key" },
              { name: "indicator", type: "string", required: true, location: "body", description: "The indicator to assess (IP, domain, hash, or URL)" },
              { name: "type", type: `"ip" | "domain" | "hash" | "url"`, required: false, location: "body", description: 'Indicator type. Defaults to "domain"' },
            ]}
            requestBody={`{
  "indicator": "192.0.2.1",
  "type": "ip"
}`}
            responses={[
              {
                code: 200,
                description: "Risk assessment returned",
                example: `{
  "indicator": "192.0.2.1",
  "type": "ip",
  "risk": "high",
  "score": 82,
  "tags": ["threat-intel", "active-ioc", "immediate-action"],
  "summary": "Indicator \\"192.0.2.1\\" matches known threat-intel patterns. Immediate containment recommended.",
  "actions": [
    "Block indicator in firewall / SIEM rule immediately",
    "Scan internal logs for historic matches",
    "Rotate credentials if indicator interacted with auth systems",
    "Open incident ticket and notify SOC"
  ],
  "timestamp": "2026-03-01T22:00:00.000Z"
}`,
              },
              {
                code: 400,
                description: "Missing or invalid input",
                example: `{ "error": "Missing required field: indicator" }`,
              },
              {
                code: 401,
                description: "Missing API key",
                example: `{ "error": "Missing API key. Provide X-Api-Key header or Authorization: Bearer <key>." }`,
              },
              {
                code: 403,
                description: "Invalid API key",
                example: `{ "error": "Invalid API key." }`,
              },
            ]}
          />

          <EndpointCard
            method="GET"
            path="/v1/intel-feed/latest"
            title="Latest Intel Feed"
            description="Returns the latest curated security intelligence items from ClawGuru's threat analysts. Optionally filtered by severity and category. Ideal for feeding IOC data directly into SIEM detection rules."
            params={[
              { name: "X-Api-Key", type: "string", required: true, location: "header", description: "Your Enterprise API key" },
              { name: "severity", type: `"high" | "medium" | "low"`, required: false, location: "query", description: "Filter by severity level" },
              { name: "category", type: `"exposure" | "websocket" | "secrets" | "supply-chain" | "ops"`, required: false, location: "query", description: "Filter by threat category" },
              { name: "limit", type: "integer (1–50)", required: false, location: "query", description: "Maximum number of items to return (default: 20)" },
            ]}
            responses={[
              {
                code: 200,
                description: "Intel feed returned",
                example: `{
  "items": [
    {
      "id": "ioc-001",
      "title": "Exposed Gateway (public) → Token Leakage",
      "severity": "high",
      "category": "exposure",
      "when": "2026-02-25T12:00:00Z",
      "summary": "Public gateway endpoints without private networking + weak auth repeatedly lead to key/token leaks.",
      "actions": ["Enforce private subnet/VPN", "Firewall deny-by-default", "Rotate all keys", "Enable auth-fail alerts"],
      "tags": ["gateway", "token", "exposure", "critical-infrastructure"]
    }
  ],
  "total": 1,
  "updatedAt": "2026-03-01T22:00:00.000Z"
}`,
              },
              {
                code: 401,
                description: "Missing API key",
                example: `{ "error": "Missing API key. Provide X-Api-Key header or Authorization: Bearer <key>." }`,
              },
              {
                code: 403,
                description: "Invalid API key",
                example: `{ "error": "Invalid API key." }`,
              },
            ]}
          />

          <EndpointCard
            method="GET"
            path="/v1/runbook/{id}"
            title="Get Runbook by ID"
            description="Returns the full content of a ClawGuru runbook by its slug identifier. Runbooks contain step-by-step remediation guides, FAQ entries, and related playbooks — ready to be ingested by SOAR automation engines."
            params={[
              { name: "X-Api-Key", type: "string", required: true, location: "header", description: "Your Enterprise API key" },
              { name: "id", type: "string", required: true, location: "path", description: "Runbook slug (e.g. ssh-hardening-ubuntu, docker-firewall-setup)" },
            ]}
            responses={[
              {
                code: 200,
                description: "Runbook returned",
                example: `{
  "id": "ssh-hardening-ubuntu",
  "title": "SSH Hardening: Ubuntu 22.04",
  "summary": "Step-by-step SSH lockdown for Ubuntu: keys-only auth, fail2ban, port change.",
  "tags": ["ssh", "hardening", "ubuntu", "security"],
  "clawScore": 94,
  "steps": [
    "Disable password authentication in /etc/ssh/sshd_config",
    "Generate and deploy SSH key pairs",
    "Change SSH port from 22 to a non-standard port",
    "Install and configure fail2ban",
    "Restrict SSH to specific IP ranges via UFW"
  ],
  "faq": [
    {
      "q": "Should I always disable root SSH login?",
      "a": "Yes. Disable PermitRootLogin in sshd_config and use sudo for privileged operations."
    }
  ],
  "relatedIds": ["firewall-ufw-ubuntu", "fail2ban-setup"],
  "updatedAt": "2026-02-25"
}`,
              },
              {
                code: 404,
                description: "Runbook not found",
                example: `{ "error": "Runbook not found" }`,
              },
              {
                code: 401,
                description: "Missing API key",
                example: `{ "error": "Missing API key. Provide X-Api-Key header or Authorization: Bearer <key>." }`,
              },
              {
                code: 403,
                description: "Invalid API key",
                example: `{ "error": "Invalid API key." }`,
              },
            ]}
          />
        </section>

        {/* Error Codes */}
        <section className="mt-12 mb-12">
          <h2 className="text-2xl font-black text-white mb-4">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th className="pb-2 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Status</th>
                  <th className="pb-2 pr-4 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Code</th>
                  <th className="pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { status: 400, code: "BAD_REQUEST", desc: "Invalid input — check required fields and types" },
                  { status: 401, code: "UNAUTHORIZED", desc: "Missing API key in request headers" },
                  { status: 403, code: "FORBIDDEN", desc: "Invalid or revoked API key" },
                  { status: 404, code: "NOT_FOUND", desc: "Resource does not exist (e.g. unknown runbook ID)" },
                  { status: 429, code: "RATE_LIMITED", desc: "Too many requests — retry after the Retry-After header value" },
                  { status: 500, code: "INTERNAL_ERROR", desc: "Unexpected server error — contact support if persistent" },
                ].map((e) => (
                  <tr key={e.status} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td className="py-3 pr-4"><StatusBadge code={e.status} /></td>
                    <td className="py-3 pr-4 font-mono text-xs" style={{ color: C.cyan }}>{e.code}</td>
                    <td className="py-3 text-xs text-gray-400">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(0,184,255,0.08) 0%, rgba(0,255,157,0.06) 100%)", border: `1px solid rgba(0,255,157,0.2)` }}
        >
          <div className="text-2xl font-black text-white mb-2">Ready to integrate?</div>
          <p className="text-gray-400 text-sm mb-6">
            Get your Enterprise API key and start querying threat intel in minutes.
          </p>
          <a
            href="/enterprise-api"
            className="inline-block px-8 py-3 rounded-xl font-black text-sm text-black transition-all duration-200 hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${C.cyan}, ${C.green})` }}
          >
            Enterprise API Overview →
          </a>
        </div>
      </div>
    </Container>
  )
}
