import type { Metadata } from "next"

import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import Container from "@/components/shared/Container"
import MyceliumView from "@/components/visual/MyceliumView"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import { getDictionary } from "@/lib/getDictionary"
import { buildMyceliumGraph, type RunbookSummary } from "@/lib/mycelium"

export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const params = props.params
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale

  return {
    alternates: { canonical: `/${locale}/mycelium` },
  }
}

export default async function LocaleMyceliumPage(props: { params: { lang: string } }) {
  const lang = props?.params?.lang
  const locale = (SUPPORTED_LOCALES.includes(lang as Locale) ? lang : DEFAULT_LOCALE) as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  let runbooks: any[] = []
  try {
    const mod = await import("@/lib/pseo")
    const list = (mod as { RUNBOOKS?: any[] }).RUNBOOKS ?? []
    if (Array.isArray(list) && list.length > 0) runbooks = list
  } catch {}

  if (runbooks.length === 0) {
    runbooks = [
      { slug: "hetzner-ssh-hardening-2026", title: "Hetzner: SSH Hardening 2026", summary: "Key-only, Root aus, Rate-Limits, sichere Admin-Zugänge.", tags: ["hetzner","ssh","security","hardening"], clawScore: 90, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "aws-firewall-baseline-2026", title: "AWS: Firewall Baseline 2026", summary: "Default deny, minimal offene Ports, sichere Defaults.", tags: ["aws","firewall","security"], clawScore: 88, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "nginx-502-bad-gateway-2026", title: "Nginx: 502 Bad Gateway Fix 2026", summary: "Timeouts, Upstream-Health, Buffering – schnell triagieren und fixen.", tags: ["nginx","error:502","fix"], clawScore: 84, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "docker-secrets-management-2026", title: "Docker: Secrets Management 2026", summary: "Kein .env in Git – sichere Secret Stores nutzen.", tags: ["docker","secrets","security"], clawScore: 86, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "cloudflare-waf-baseline-2026", title: "Cloudflare: WAF Baseline 2026", summary: "Managed Rules + Rate Limits – sinnvolle Defaults.", tags: ["cloudflare","waf","security"], clawScore: 83, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "kubernetes-rbac-2026", title: "Kubernetes: RBAC Hardening 2026", summary: "Least privilege, Service Accounts, Audit Logs.", tags: ["kubernetes","rbac","security"], clawScore: 85, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "stripe-webhook-verify-2026", title: "Stripe: Webhook Verify 2026", summary: "Signaturen prüfen, Replay verhindern, Idempotency.", tags: ["stripe","webhook","security"], clawScore: 82, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "redis-auth-tls-2026", title: "Redis: Auth + TLS 2026", summary: "Redis nicht öffentlich – Auth + TLS erzwingen.", tags: ["redis","security","tls"], clawScore: 81, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "postgres-backup-restore-2026", title: "Postgres: Backup/Restore Drill 2026", summary: "PITR, WAL, regelmäßige Restore-Tests.", tags: ["postgres","backup","drill"], clawScore: 87, howto: { steps: ["","",""] }, relatedSlugs: [] },
      { slug: "security-headers-csp-2026", title: "Security Headers & CSP 2026", summary: "HSTS, CSP, XFO, Referrer Policy – richtig setzen.", tags: ["security","headers","csp"], clawScore: 80, howto: { steps: ["","",""] }, relatedSlugs: [] },
    ]
  }

  const graph = buildMyceliumGraph(runbooks, 250)
  const summaries: Record<string, RunbookSummary> = {}
  for (const r of runbooks) {
    summaries[r.slug] = { title: r.title, summary: r.summary ?? "", tags: r.tags }
  }

  return (
    <>
      <div className="border-b border-white/10 bg-gradient-to-b from-gray-950 to-[#050608] py-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="flex-1">
              <div className="text-xs font-mono text-[#00ff9d] tracking-widest mb-2 uppercase">
                {dict.hero.badge}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                The{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #00ff9d, #00b8ff, #b464ff)" }}
                >
                  Living Mycelium
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Every runbook is a mycel-node. Edges are semantic relationships: <em className="text-[#00ff9d] not-italic">prevents</em>, <em className="text-[#ff4646] not-italic">causes</em>, <em className="text-[#00b8ff] not-italic">depends-on</em>, <em className="text-[#b464ff] not-italic">evolves-from</em>, <em className="text-[#ffc800] not-italic">mutates-into</em>. The network grows, learns, and evolves autonomously through Darwinian selection.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 shrink-0">
              {[
                { label: "Library Size", value: `${(runbooks.length).toLocaleString()}+`, color: "#00ff9d" },
                { label: "Active Nodes", value: graph.nodes.length.toString(), color: "#00b8ff" },
                { label: "Synapses", value: graph.edges.length.toString(), color: "#b464ff" },
                { label: "Evolved", value: graph.nodes.filter((n) => n.evolved).length.toString(), color: "#ffc800" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black font-mono" style={{ color }}>{value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {["⚡ Force-directed graph", "🧬 Genetic evolution engine", "♾️ Autopoietic self-maintenance", "🔮 Oracle mode", "📡 Live mutation feed"].map((feat) => (
              <span key={feat} className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{feat}</span>
            ))}
          </div>
        </Container>
      </div>

      <div className="px-4 py-4">
        <MyceliumView graph={graph} summaries={summaries} totalRunbooks={runbooks.length} />
      </div>

      <div className="border-t border-white/10 mt-4">
        <Container>
          <div className="py-12 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-[#00ff9d] font-black text-lg mb-2">🧬 Darwinian Breeding</div>
              <p className="text-gray-400 text-sm leading-relaxed">Every hour, the top 1,000 runbooks are paired for genetic crossover. Steps are recombined, commands mutated, fitness re-scored through Quality Gate 2.0. Successful mutants earn the <span className="text-[#ffc800]">★ Evolved</span> badge.</p>
            </div>
            <div>
              <div className="text-[#00b8ff] font-black text-lg mb-2">♾️ Autopoietic Repair</div>
              <p className="text-gray-400 text-sm leading-relaxed">Runbooks scoring below 85 are automatically &ldquo;fed&rdquo; by their three strongest neighbours — knowledge is transferred via the mycelial network until the weak node reaches elite fitness or is gracefully recombined.</p>
            </div>
            <div>
              <div className="text-[#b464ff] font-black text-lg mb-2">🔮 Singularity Oracle</div>
              <p className="text-gray-400 text-sm leading-relaxed">Describe any ops problem. The oracle traces the optimal path through the semantic graph — scoring nodes on content similarity × evolutionary fitness — and returns the most evolved runbook for your exact scenario.</p>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-8 border-t border-white/5">
        <Container>
          <MyceliumShareCard locale={locale} title="Live Ops Wall · ClawGuru" pageUrl={`${prefix}/mycelium`} className="max-w-2xl" />
        </Container>
      </div>
    </>
  )
}
