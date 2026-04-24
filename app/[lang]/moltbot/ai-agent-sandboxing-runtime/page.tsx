import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-sandboxing-runtime"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Sandboxing Runtime: KI-Agenten-Sandboxing-Laufzeit | ClawGuru Moltbot", "AI Agent Sandboxing Runtime: AI Agent Sandboxing Runtime | ClawGuru Moltbot")
  const description = pick(isDE, "KI-Agenten-Sandboxing-Laufzeit: Process Isolation, Resource Limits, Network Isolation und Filesystem Isolation für KI-Agenten-Sandboxing zur Laufzeit.", "AI agent sandboxing runtime: process isolation, resource limits, network isolation and filesystem isolation for AI agent sandboxing at runtime.")
  return {
    title, description,
    keywords: ["ai agent sandboxing runtime", "agent process isolation", "agent resource limits", "agent network isolation", "agent filesystem sandbox", "moltbot sandboxing"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const CONTROLS = [
  { id: "ASR-1", title: "Process Isolation", desc: "Isolate agent processes from each other and from the host system. Use containerisation or process isolation to prevent cross-agent contamination.", code: `# Moltbot agent process isolation:
process_isolation:
  enabled: true

  # Containerisation:
  containerisation:
    # Use Docker containers for each agent
    # Each agent runs in its own container
    enabled: true

    # Container isolation:
    # - User namespace isolation
    # - PID namespace isolation
    # - Network namespace isolation
    # - Mount namespace isolation
    namespaces:
      - user
      - pid
      - network
      - mount

    # Seccomp profiles:
    # Restrict system calls available to agent
    # Only allow necessary syscalls for agent operation
    seccomp:
      enabled: true
      profile: "agent-profile.json"

  # Process hardening:
  hardening:
    # Drop privileges
    # Run agent as non-root user
    drop_privileges: true
    user: "agent-user"
    group: "agent-group"

    # Enable security features:
    # - ASLR (Address Space Layout Randomisation)
    # - PIE (Position Independent Executable)
    # - Stack canaries
    security_features:
      aslr: true
      pie: true
      stack_canary: true` },
  { id: "ASR-2", title: "Resource Limits", desc: "Limit agent resource consumption to prevent resource exhaustion attacks. Set CPU, memory, and disk limits.", code: `# Moltbot agent resource limits:
resource_limits:
  enabled: true

  # CPU limits:
  cpu:
    # Limit CPU usage per agent
    cpu_quota: "0.5"  # 50% of one CPU core
    cpu_period: 100000  # 100ms period

  # Memory limits:
  memory:
    # Limit memory usage per agent
    memory_limit: "512m"  # 512MB
    memory_swap: "512m"  # No swap
    oom_kill_disable: false  # Kill on OOM

  # Disk limits:
  disk:
    # Limit disk usage per agent
    disk_quota: "100m"  # 100MB
    inode_quota: 10000  # 10000 inodes

  # File descriptor limits:
  file_descriptors:
    # Limit number of open file descriptors
    nofile: 1024

  # Process limits:
  processes:
    # Limit number of processes per agent
    nproc: 64` },
  { id: "ASR-3", title: "Network Isolation", desc: "Isolate agent network access. Control which agents can access which endpoints. Use network policies and firewall rules.", code: `# Moltbot agent network isolation:
network_isolation:
  enabled: true

  # Network policies:
  policies:
    # Default deny all egress traffic
    default_policy: "deny"

    # Allow specific egress traffic:
    allowed_egress:
      - destination: "api.openai.com"
        ports: [443]
        protocol: "https"
      - destination: "api.anthropic.com"
        ports: [443]
        protocol: "https"
      - destination: "internal-api.internal"
        ports: [443, 8080]
        protocol: "https"

  # Firewall rules:
  firewall:
    # Use iptables or nftables to enforce network policies
    enabled: true
    rules:
      - action: "deny"
        destination: "0.0.0.0/0"
        except_allowed: true

  # DNS isolation:
  dns:
    # Use custom DNS resolver for agents
    # Block access to malicious domains
    custom_resolver: "10.0.0.53"
    block_malicious: true` },
  { id: "ASR-4", title: "Filesystem Isolation", desc: "Isolate agent filesystem access. Provide read-only access to system files and isolated writable directories for agent data.", code: `# Moltbot agent filesystem isolation:
filesystem_isolation:
  enabled: true

  # Read-only system:
  read_only_system:
    # Mount system directories as read-only
    # Prevent agent from modifying system files
    paths:
      - "/usr:ro"
      - "/bin:ro"
      - "/lib:ro"
      - "/etc:ro"

  # Isolated writable directories:
  writable_dirs:
    # Provide isolated writable directories for agent data
    # Each agent has its own writable directory
    path: "/agent-data"
    # Mount with noexec flag to prevent execution
    options: "noexec,nosuid,nodev"

  # Volume isolation:
  volumes:
    # Use separate volumes for each agent
    # Prevent cross-agent data access
    enabled: true
    # Each agent gets its own volume
    volume_per_agent: true

  # Temporary directory isolation:
  tmp:
    # Use isolated /tmp directory for each agent
    # Clear on agent termination
    isolated_tmp: true
    clear_on_termination: true` },
]

const FAQ = [
  { q: "What is the difference between containerisation and process isolation?", a: "Containerisation is a lightweight form of virtualisation that packages an application with its dependencies into a container. Containers share the host kernel but have isolated namespaces (user, PID, network, mount). Process isolation is a more fundamental isolation mechanism that separates processes at the kernel level using namespaces and cgroups. Containerisation builds on top of process isolation. Both are necessary: containerisation provides a convenient way to package and deploy agents, while process isolation provides the fundamental security boundaries. In practice, use Docker containers for convenience, and ensure they are properly configured with namespace isolation and seccomp profiles for security." },
  { q: "How do I set appropriate resource limits for agents?", a: "Resource limits should be based on: 1) Agent complexity — simple agents need fewer resources than complex multi-step agents. 2) Expected workload — agents processing large amounts of data need more memory and CPU. 3) User tier — enterprise users may be allocated more resources than free users. 4) Cost constraints — set limits to control infrastructure costs. 5) Isolation requirements — stricter limits for high-risk agents. Start with conservative limits (512MB memory, 0.5 CPU core) and monitor actual usage. Adjust limits based on metrics. Implement per-tier resource quotas to balance user experience with cost control." },
  { q: "How does network isolation prevent agent exploitation?", a: "Network isolation prevents agents from accessing unauthorised endpoints. If an agent is compromised, network isolation limits the attacker's ability to: 1) Exfiltrate data to external servers. 2) Command and control (C2) communication with attacker infrastructure. 3) Pivot to other systems on the network. 4) Download malware or tools. Network isolation uses network policies (default deny, allow specific) and firewall rules to control egress traffic. DNS isolation prevents access to malicious domains. Combined with filesystem isolation, network isolation limits the blast radius of a compromised agent." },
  { q: "What are the risks of inadequate filesystem isolation?", a: "Inadequate filesystem isolation allows agents to: 1) Modify system files — modify /etc/passwd, install backdoors, modify configuration. 2) Access other agents' data — read or modify files belonging to other agents. 3) Access host system files — read sensitive host data, modify host configuration. 4) Execute malicious code — if /tmp is executable, agents can download and execute malware. 5) Persist malware — if writable directories persist, malware can persist across agent restarts. Proper filesystem isolation uses read-only mounts for system directories, isolated writable directories with noexec flag, and separate volumes per agent." },
]

export default function AiAgentSandboxingRuntimePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Sandboxing Runtime", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Agent-Sandboxing-Runtime-Guide für eigene KI-Systeme.", "Agent sandboxing runtime guide for your own AI systems.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Moltbot · Batch 18</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">{pick(isDE, "AI Agent Sandboxing Runtime", "AI Agent Sandboxing Runtime")}</h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "KI-Agenten ohne Sandbox-Isolation zur Laufzeit können System-Resourcen erschöpfen und Host-Systeme kompromittieren. Vier Kontrollen: Process Isolation, Resource Limits, Network Isolation und Filesystem Isolation.", "AI agents without sandbox isolation at runtime can exhaust system resources and compromise host systems. Four controls: process isolation, resource limits, network isolation and filesystem isolation.")}
        </p>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Agent-Sandboxing-Runtime-Kontrollen", "4 Agent Sandboxing Runtime Controls")}</h2>
          <div className="space-y-5">
            {CONTROLS.map((c) => (
              <div key={c.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{c.id}</span>
                  <span className="font-bold text-gray-100">{c.title}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Ressourcen", "Further Resources")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent Sandboxing</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Sandboxing-Overview", "Sandboxing overview")}</div>
            </a>
            <a href={`/${locale}/moltbot/secure-agent-deployment`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Secure Agent Deployment</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Container-Security", "Container security")}</div>
            </a>
            <a href={`/${locale}/moltbot/ai-agent-rbac`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">AI Agent RBAC</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Process-Permissions", "Process permissions")}</div>
            </a>
            <a href={`/${locale}/moltbot/zero-trust-ai-agents`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Zero-Trust AI Agents</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Network-Isolation", "Network isolation")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
