import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-sandboxing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = "AI Agent Sandboxing & Isolation Best Practices 2026 | ClawGuru"
  const description = "Complete isolation and sandboxing guide for AI agents running tools and code. Container isolation, capability dropping, network restrictions, and blast radius limitation for Moltbot deployments."
  return {
    title,
    description,
    keywords: ["ai agent sandboxing", "ai agent isolation", "llm code execution security", "moltbot sandboxing", "ai agent container security", "blast radius limitation", "code interpreter security"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const ISOLATION_LAYERS = [
  { name: "Process Isolation", icon: "🔒", desc: "Each agent run in its own process with no shared memory with other agents or the host system.", implementation: "Docker containers with --pid=private, seccomp profiles, read-only rootfs" },
  { name: "Network Isolation", icon: "🌐", desc: "Agents cannot initiate outbound network connections except to explicitly allowlisted endpoints.", implementation: "Docker --network=none or custom network with strict egress rules via iptables" },
  { name: "Filesystem Isolation", icon: "📁", desc: "Read-only root filesystem. Write access only to ephemeral temp directories that are wiped after each run.", implementation: "--read-only flag + tmpfs mount for /tmp only" },
  { name: "Capability Dropping", icon: "🔑", desc: "Drop ALL Linux capabilities. Add back only what is strictly needed (usually nothing for LLM agents).", implementation: "--cap-drop=ALL --no-new-privileges" },
  { name: "Resource Limits", icon: "⚡", desc: "Hard CPU, memory, and execution time limits. Agent cannot exhaust host resources or run indefinitely.", implementation: "--memory=512m --cpus=0.5 + exec timeout of 30s" },
  { name: "User Namespace Isolation", icon: "👤", desc: "Run agent as non-root user inside container. UID 65534 (nobody) with no capabilities.", implementation: "--user=65534:65534" },
]

const DOCKER_HARDENED = `# Hardened agent container run command
docker run \\
  --rm \\                           # auto-remove after run
  --read-only \\                    # read-only rootfs
  --tmpfs /tmp:noexec,nosuid,size=50m \\  # limited writable tmp
  --network=none \\                 # no network access
  --cap-drop=ALL \\                 # drop all capabilities
  --no-new-privileges \\           # prevent privilege escalation
  --user=65534:65534 \\            # run as nobody
  --memory=512m \\                  # max 512MB RAM
  --memory-swap=512m \\            # no swap
  --cpus=0.5 \\                    # max 50% of one CPU core
  --pids-limit=100 \\              # max 100 processes
  --security-opt=no-new-privileges \\
  --security-opt="seccomp=/etc/docker/seccomp-agent.json" \\
  moltbot-agent:latest \\
  timeout 30 node agent.js        # 30s hard timeout`

const KUBERNETES_POLICY = `# Kubernetes PodSecurityContext for AI agents
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 65534
    runAsGroup: 65534
    fsGroup: 65534
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: moltbot-agent
    image: moltbot-agent:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"
        ephemeral-storage: "100Mi"
    volumeMounts:
    - name: tmp-dir
      mountPath: /tmp
  volumes:
  - name: tmp-dir
    emptyDir:
      sizeLimit: 50Mi`

const BLAST_RADIUS = [
  { principle: "One agent, one task", detail: "Never run multiple user tasks in the same agent process. Agent contamination is real." },
  { principle: "Short-lived agents", detail: "Spawn a fresh container per task. Kill and discard after 30s timeout. No persistent state between runs." },
  { principle: "Minimal tool surface", detail: "Agents only get access to tools they need for the specific task. No global tool registry access." },
  { principle: "Output validation gate", detail: "All agent outputs pass through a validation layer before any downstream action. Never auto-execute raw LLM output." },
  { principle: "No credentials in agent context", detail: "Agents receive one-time capability tokens, never raw API keys or passwords." },
]

export default function AiAgentSandboxingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: These sandboxing techniques are for protecting your own infrastructure from your own AI agents. Defensive use only.
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot AI Security</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">AI Agent Sandboxing & Isolation Best Practices 2026</h1>
        <p className="text-lg text-gray-300 mb-8">
          AI agents that execute code, run tools, or access filesystems are running untrusted computation. A single successful prompt injection or jailbreak can pivot to your host system — unless you contain the blast radius. This guide gives you the exact isolation stack.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {[
            { label: "Isolation layers", value: "6" },
            { label: "Blast radius principles", value: "5" },
            { label: "Container security flags", value: "10+" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-orange-900 border border-orange-700 p-5 rounded-lg mb-10">
          <h3 className="font-bold text-orange-300 mb-2">The Core Problem: Agents Execute Code</h3>
          <p className="text-sm text-orange-200">
            When your Moltbot agent runs a code interpreter, executes shell commands, or reads/writes files, it's executing <strong>untrusted computation</strong> on your infrastructure. If the agent is compromised via prompt injection, the attacker has whatever access the agent has. The only safe default: agents have <strong>no access until explicitly granted</strong>.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">6 Isolation Layers</h2>
          <div className="grid grid-cols-1 gap-4">
            {ISOLATION_LAYERS.map((layer) => (
              <div key={layer.name} className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{layer.icon}</span>
                  <h3 className="font-bold text-cyan-400">{layer.name}</h3>
                </div>
                <p className="text-sm text-gray-300 mb-2">{layer.desc}</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">{layer.implementation}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Hardened Docker Run Command</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{DOCKER_HARDENED}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Kubernetes Pod Security Policy</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>{KUBERNETES_POLICY}</pre>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Blast Radius Limitation Principles</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {BLAST_RADIUS.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</div>
                  <div>
                    <div className="font-semibold text-gray-100">{b.principle}</div>
                    <div className="text-sm text-gray-300">{b.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Further Resources</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/prompt-injection-defense`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Prompt Injection Defense</div>
              <div className="text-sm text-gray-300">Input-layer attack prevention</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-communication`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Communication</div>
              <div className="text-sm text-gray-300">mTLS & capability tokens</div>
            </a>
            <a href={`/${locale}/openclaw/docker-swarm-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Docker Swarm Hardening</div>
              <div className="text-sm text-gray-300">Production container security</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-security`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Security Hub</div>
              <div className="text-sm text-gray-300">OWASP LLM Top 10 — full defense map</div>
            </a>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
            { "@type": "Question", name: "Why do AI agents need sandboxing?", acceptedAnswer: { "@type": "Answer", text: "AI agents that execute tools, code, or access files run untrusted computation. A successful prompt injection or jailbreak can pivot through an unsandboxed agent to the host system. Sandboxing limits the blast radius to just the isolated container." } },
            { "@type": "Question", name: "How do I sandbox a Moltbot agent in Docker?", acceptedAnswer: { "@type": "Answer", text: "Use: --read-only (read-only rootfs), --network=none (no network), --cap-drop=ALL (drop all capabilities), --user=65534 (non-root), --memory=512m (memory limit), timeout 30 (execution timeout). Start from this baseline and add back only what's absolutely needed." } },
            { "@type": "Question", name: "Can a sandboxed AI agent still be useful?", acceptedAnswer: { "@type": "Answer", text: "Yes. Most LLM agent tasks (text processing, structured data extraction, API calls to allowlisted endpoints) work fine within a hardened sandbox. Grant specific capabilities per task type rather than running agents with broad access." } },
          ]},
          { "@context": "https://schema.org", "@type": "HowTo", name: "Sandbox AI Agents in Docker and Kubernetes",
            description: "Step-by-step isolation of AI agent containers to limit blast radius from prompt injection and jailbreaks.",
            totalTime: "PT60M",
            step: [
              { "@type": "HowToStep", name: "Add --read-only flag", text: "Make the container rootfs read-only. Mount a tmpfs for /tmp with noexec flag." },
              { "@type": "HowToStep", name: "Drop all capabilities", text: "Add --cap-drop=ALL --no-new-privileges to prevent any privilege escalation." },
              { "@type": "HowToStep", name: "Isolate networking", text: "Use --network=none or a custom network with explicit egress allowlist." },
              { "@type": "HowToStep", name: "Set resource limits", text: "Add --memory=512m --cpus=0.5 --pids-limit=100 to prevent resource exhaustion." },
              { "@type": "HowToStep", name: "Add execution timeout", text: "Wrap agent invocation in timeout 30 to prevent infinite loops." },
            ]
          }
        ]) }} />
      </div>
    </div>
  )
}
