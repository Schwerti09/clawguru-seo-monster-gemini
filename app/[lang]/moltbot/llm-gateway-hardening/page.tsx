import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/llm-gateway-hardening"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "Self-Hosted LLM Gateway Hardening Guide 2026 | ClawGuru"
  const description = "Complete hardening guide for self-hosted LLM gateways (Ollama, LocalAI, LiteLLM). Authentication, rate limiting, audit logging, and network isolation for production AI deployments."
  return {
    title,
    description,
    keywords: ["llm gateway hardening", "ollama security", "localai hardening", "litellm security", "self-hosted llm security", "moltbot llm gateway", "ai gateway authentication"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const GATEWAY_RISKS = [
  { risk: "Unauthenticated API", severity: "CRITICAL", detail: "Default Ollama/LocalAI installations expose port 11434 with no authentication. Anyone on the network can query your models." },
  { risk: "No Rate Limiting", severity: "HIGH", detail: "Unlimited requests drain GPU resources, run up cloud bills, and enable model extraction attacks." },
  { risk: "Plain HTTP", severity: "HIGH", detail: "LLM traffic (including prompt contents) transmitted in plaintext — interceptable on local network or by co-tenant in cloud." },
  { risk: "No Audit Logging", severity: "HIGH", detail: "Zero visibility into who queried what, when, with what prompts. Forensically blind." },
  { risk: "Wide Network Access", severity: "MEDIUM", detail: "LLM gateway accessible from all subnets instead of only application services that need it." },
]

const HARDENING_STEPS = [
  { step: "1. Bind to localhost, not 0.0.0.0", cmd: `# Ollama
OLLAMA_HOST=127.0.0.1:11434 ollama serve

# LocalAI config.yaml
address: "127.0.0.1:8080"  # NOT 0.0.0.0

# Verify — should ONLY show 127.0.0.1
ss -tlnp | grep 11434` },
  { step: "2. Reverse proxy with authentication", cmd: `# nginx config for LLM gateway
server {
  listen 443 ssl;
  server_name llm.internal.example.com;
  
  # mTLS — only trusted clients
  ssl_client_certificate /etc/nginx/certs/internal-ca.crt;
  ssl_verify_client on;
  
  # OR API key auth
  location / {
    auth_request /validate-key;
    proxy_pass http://127.0.0.1:11434;
  }
  
  location = /validate-key {
    internal;
    proxy_pass http://127.0.0.1:8081/validate;
  }
}` },
  { step: "3. Rate limiting per API key", cmd: `# nginx rate limiting
limit_req_zone $http_x_api_key zone=llm_per_key:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=llm_per_ip:10m rate=30r/m;

location /api/ {
  limit_req zone=llm_per_key burst=5 nodelay;
  limit_req zone=llm_per_ip burst=10 nodelay;
  proxy_pass http://127.0.0.1:11434;
}` },
  { step: "4. Audit logging via proxy", cmd: `// LLM gateway audit middleware (Node.js/Express)
app.use('/api', async (req, res, next) => {
  const start = Date.now()
  const logEntry = {
    ts: new Date().toISOString(),
    apiKey: hashKey(req.headers['x-api-key']),
    ip: req.ip,
    model: req.body?.model,
    promptHash: sha256(req.body?.prompt ?? ''),
    promptLength: (req.body?.prompt ?? '').length,
  }
  res.on('finish', () => {
    logEntry.duration = Date.now() - start
    logEntry.status = res.statusCode
    auditLog.write(logEntry)
  })
  next()
})` },
  { step: "5. Network isolation with iptables/nftables", cmd: `# Allow only app server to reach LLM gateway
iptables -A INPUT -p tcp --dport 11434 -s 10.0.1.5 -j ACCEPT   # app server IP
iptables -A INPUT -p tcp --dport 11434 -j DROP                    # block all others

# Verify
iptables -L INPUT -n -v | grep 11434` },
]

export default function LlmGatewayHardeningPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: This guide is for hardening your own self-hosted LLM infrastructure. Defensive use only.
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Self-Hosted LLM Gateway Hardening Guide 2026</h1>
        <p className="text-lg text-gray-300 mb-8">
          Default Ollama installations expose port 11434 to all interfaces with zero authentication. If your LLM gateway is accessible on your local network, it's accessible to every device on that network — including attacker-controlled ones. This guide closes every gap.
        </p>

        <div className="bg-red-900 border border-red-700 p-5 rounded-lg mb-10">
          <h3 className="font-bold text-red-300 mb-2">🚨 Default State Is Dangerous</h3>
          <p className="text-sm text-red-200 mb-2">
            Running <code className="bg-red-950 px-1 rounded">ollama serve</code> out of the box listens on <code className="bg-red-950 px-1 rounded">0.0.0.0:11434</code> with no auth. Anyone who can reach your machine can:
          </p>
          <ul className="text-sm text-red-200 space-y-1">
            <li>• Query your models for free (at your GPU cost)</li>
            <li>• Extract model behavior systematically</li>
            <li>• Inject malicious prompts into your pipeline</li>
            <li>• Read your chat history if not isolated per-user</li>
          </ul>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Risk Assessment: Default LLM Gateway</h2>
          <div className="space-y-3">
            {GATEWAY_RISKS.map((r) => (
              <div key={r.risk} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-start gap-4">
                <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${r.severity === 'CRITICAL' ? 'bg-red-900 text-red-300' : r.severity === 'HIGH' ? 'bg-orange-900 text-orange-300' : 'bg-yellow-900 text-yellow-300'}`}>{r.severity}</span>
                <div>
                  <div className="font-semibold text-cyan-400 mb-1">{r.risk}</div>
                  <p className="text-sm text-gray-300">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardening Steps</h2>
          <div className="space-y-6">
            {HARDENING_STEPS.map((s) => (
              <div key={s.step} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-3">{s.step}</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{s.cmd}</pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">LiteLLM Proxy as Secure Gateway</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">LiteLLM Proxy provides a hardened, unified gateway for multiple LLM providers with built-in auth, rate limiting, and spend tracking:</p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{`# litellm_config.yaml
model_list:
  - model_name: "moltbot-llm"
    litellm_params:
      model: "ollama/mistral"
      api_base: "http://127.0.0.1:11434"

general_settings:
  master_key: "sk-\${LITELLM_MASTER_KEY}"  # from env var
  
litellm_settings:
  max_budget: 100          # USD spend limit
  budget_duration: "1mo"
  success_callback: ["langfuse"]  # audit trail
  
router_settings:
  routing_strategy: "usage-based-routing"
  num_retries: 3`}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Protect against LLM input attacks</div>
            </a>
            <a href={`/${locale}/openclaw/reverse-proxy-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Reverse Proxy Security</div>
              <div className="text-sm text-gray-300">Nginx/Caddy hardening guide</div>
            </a>
            <a href={`/${locale}/neuro`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Stack MRI</div>
              <div className="text-sm text-gray-300">Scan your LLM stack for open ports</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 — full defense map</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
            { "@type": "Question", name: "Is Ollama secure by default?", acceptedAnswer: { "@type": "Answer", text: "No. Default Ollama installations bind to 0.0.0.0:11434 with no authentication, exposing your LLM to the entire local network. You must bind to localhost and add a reverse proxy with authentication before any production use." } },
            { "@type": "Question", name: "How do I add authentication to a self-hosted LLM?", acceptedAnswer: { "@type": "Answer", text: "Use a reverse proxy (nginx or Caddy) in front of your LLM gateway. Add API key validation or mTLS client certificate authentication. LiteLLM Proxy provides a production-ready solution with built-in auth, rate limiting, and spend tracking." } },
            { "@type": "Question", name: "What is LiteLLM and why use it for LLM gateway security?", acceptedAnswer: { "@type": "Answer", text: "LiteLLM Proxy is an open-source unified LLM gateway that adds authentication, rate limiting, budget controls, and audit logging in front of any LLM provider. It's the fastest way to get a production-hardened LLM gateway for Moltbot deployments." } },
          ]},
          { "@context": "https://schema.org", "@type": "HowTo", name: "Harden a Self-Hosted LLM Gateway",
            description: "Step-by-step hardening for Ollama, LocalAI, and LiteLLM gateway deployments.",
            totalTime: "PT45M",
            step: [
              { "@type": "HowToStep", name: "Bind to localhost", text: "Set OLLAMA_HOST=127.0.0.1:11434. Verify with ss -tlnp that no 0.0.0.0 binding exists." },
              { "@type": "HowToStep", name: "Deploy reverse proxy with auth", text: "Configure nginx with API key validation or mTLS. Only authenticated clients can reach the LLM." },
              { "@type": "HowToStep", name: "Add rate limiting", text: "Configure nginx limit_req per API key and per IP. Set burst limits to prevent model extraction." },
              { "@type": "HowToStep", name: "Enable audit logging", text: "Log all requests with API key hash, prompt length, model, and response status." },
              { "@type": "HowToStep", name: "Apply network isolation", text: "Use iptables to restrict LLM gateway access to only application server IPs." },
            ]
          }
        ]) }} />
      </div>
    </div>
  )
}
