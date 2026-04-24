import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/openclaw/ebpf-security-monitoring"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const title = pick(isDE, "eBPF Security Monitoring: Kernel-Level-Sicherheit für Kubernetes | ClawGuru", "eBPF Security Monitoring: Kernel-Level Security for Kubernetes | ClawGuru")
  const description = pick(isDE, "eBPF-basiertes Security Monitoring für Kubernetes und Container: Cilium Tetragon, Falco eBPF, Syscall-Überwachung, Network-Policy-Enforcement und Runtime-Threat-Detection ohne Kernel-Module.", "eBPF-based security monitoring for Kubernetes and containers: Cilium Tetragon, Falco eBPF, syscall monitoring, network policy enforcement and runtime threat detection without kernel modules.")
  return {
    title, description,
    keywords: ["ebpf security monitoring", "ebpf kubernetes security", "cilium tetragon", "falco ebpf", "ebpf runtime security", "ebpf container monitoring"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: `${SITE_URL}/${locale}${PATH}`, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

const EBPF_TOOLS = [
  { id: "T1", name: "Cilium Tetragon", category: "Runtime Enforcement", desc: "Kernel-level security enforcement with eBPF. Tetragon executes security policies in-kernel — blocking malicious syscalls before they complete, not just alerting after.", code: `# Install Tetragon via Helm
helm repo add cilium https://helm.cilium.io
helm install tetragon cilium/tetragon -n kube-system

# TracingPolicy: alert on shell execution inside containers
apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: block-shell-in-containers
spec:
  kprobes:
  - call: "sys_execve"
    syscall: true
    args:
    - index: 0
      type: "string"
    selectors:
    - matchArgs:
      - index: 0
        operator: "Postfix"
        values: ["/sh", "/bash", "/ash", "/dash"]
      matchNamespaces:
      - namespace: Pid
        operator: NotIn
        values: ["host_ns"]   # Container processes only
      matchActions:
      - action: Sigkill        # KILL the process — not just alert
        # or action: Override with argError: -1 for syscall override` },
  { id: "T2", name: "Falco + eBPF Driver", category: "Threat Detection", desc: "Falco with eBPF driver instead of kernel module — same detection capabilities without loading a kernel module (safer, works in managed K8s where modules are blocked).", code: `# Deploy Falco with eBPF driver (no kernel module required)
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco \\
  --set driver.kind=ebpf \\
  --set falcosidekick.enabled=true \\
  --set falcosidekick.config.webhook.address=http://openclaw-webhook:9000

# Key Falco rules for container security:
- rule: Unexpected shell in container
  condition: >
    spawned_process and container and
    shell_procs and not proc.pname in (allowed_parent_processes)
  output: Shell spawned in container (proc=%proc.name parent=%proc.pname
    container=%container.name image=%container.image.repository)
  priority: WARNING

- rule: Write below /etc in container
  condition: >
    open_write and container and
    fd.name startswith /etc
  output: File below /etc written in container (file=%fd.name
    container=%container.name)
  priority: ERROR

- rule: Outbound connection to unexpected IP
  condition: >
    outbound and container and
    not fd.sip in (allowed_outbound_ips)
  output: Unexpected outbound connection (sip=%fd.sip dport=%fd.sport
    container=%container.name)
  priority: WARNING` },
  { id: "T3", name: "Cilium Network Policies (L7)", category: "Network Enforcement", desc: "Cilium uses eBPF to enforce network policies at Layer 7 (HTTP/gRPC/DNS) — blocking specific API calls or DNS queries, not just TCP connections.", code: `# Cilium L7 policy: allow only specific HTTP paths
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: moltbot-agent-l7-policy
  namespace: moltbot-agents
spec:
  endpointSelector:
    matchLabels:
      app: moltbot-agent
  egress:
  - toEndpoints:
    - matchLabels:
        app: llm-gateway
    toPorts:
    - ports:
      - port: "8080"
        protocol: TCP
      rules:
        http:
        - method: "POST"
          path: "/v1/chat/completions"  # Only allow LLM API calls
        # BLOCKED: GET /, POST /admin, all other paths

  - toFQDNs:
    - matchName: "api.openai.com"
    toPorts:
    - ports:
      - port: "443"
        protocol: TCP
      rules:
        http:
        - method: "POST"
          path: "/v1/chat/completions"

  # Block metadata API (cloud credential theft prevention)
  egressDeny:
  - toCIDRSet:
    - cidr: "169.254.169.254/32"` },
  { id: "T4", name: "eBPF Syscall Audit Trail", category: "Forensics & Compliance", desc: "Record every syscall from every container process with full context — process, arguments, return value. Immutable audit trail for incident response and compliance.", code: `# Tetragon: comprehensive syscall audit with JSON export
apiVersion: cilium.io/v1alpha1
kind: TracingPolicy
metadata:
  name: audit-sensitive-syscalls
spec:
  kprobes:
  - call: "sys_ptrace"      # Process tracing (escape vector)
    syscall: true
    return: true
  - call: "sys_mount"       # Filesystem mount (escape vector)
    syscall: true
    return: true
  - call: "sys_clone"       # Namespace creation (escape vector)
    syscall: true
    args:
    - index: 0
      type: "uint64"  # flags
    return: true
  - call: "sys_setuid"      # Privilege escalation
    syscall: true
    return: true

# Export audit events to SIEM:
# Tetragon exports JSON to stdout → ship via Fluent Bit to SIEM
# Each event includes: timestamp, pod, namespace, process, args, return_val
# Cryptographic integrity: sign log stream with Falco/Tetragon + HMAC` },
]

const FAQ = [
  { q: "What is eBPF and why is it better than kernel modules for security?", a: "eBPF (extended Berkeley Packet Filter) is a Linux kernel technology that allows running sandboxed programs in the kernel without loading kernel modules. Security advantages over kernel modules: Safety: eBPF programs are verified by the kernel's verifier before execution — they cannot crash the kernel. Kernel modules can cause kernel panics. Portability: eBPF programs work across kernel versions without recompilation. Kernel modules often break on updates. Managed Kubernetes: GKE, EKS, AKS block kernel module loading. eBPF works without special permissions. Observability: eBPF can observe any kernel event (syscalls, network packets, function calls) with minimal overhead (~1-5% CPU for comprehensive monitoring). Performance: eBPF executes in-kernel — no context switches between kernel and userspace for each event." },
  { q: "What is Cilium Tetragon and how does it differ from Falco?", a: "Both use eBPF but with different approaches: Falco: observe-and-alert model. Detects policy violations and sends alerts. Cannot block malicious actions — only report them. Rich rule language (Falco rules). Easy to deploy and tune. Cilium Tetragon: enforce-and-kill model. Executes security policy in-kernel and can block/kill malicious processes before the syscall completes. Uses TracingPolicy CRDs. More complex to configure. Can prevent attacks in real-time, not just detect them. Use case: Falco for threat detection and SIEM integration. Tetragon for runtime enforcement where zero-tolerance is required (e.g., production containers that should never spawn shells). Best practice: run both — Falco for detection coverage, Tetragon for enforcement on critical workloads." },
  { q: "Does eBPF security monitoring work with AI agent containers?", a: "Yes, and it's particularly valuable: AI agent containers (Moltbot) often have broad network access and tool capabilities — eBPF monitoring provides visibility into exactly what syscalls and network connections agents make. Key use cases: 1) Detect prompt injection that leads to shell execution (agent spawns unexpected process). 2) Monitor outbound connections — alert if agent connects to unexpected external IPs. 3) Enforce L7 network policy — agent can only POST to /v1/chat/completions, not browse arbitrary endpoints. 4) Audit tool calls at syscall level — file reads, network connections attributable to specific agent requests. 5) Detect model inference anomalies — unusual process patterns during model loading or inference." },
  { q: "What is the performance overhead of eBPF security monitoring?", a: "Production-measured overhead (typical Kubernetes workload): Falco with eBPF driver: 1-3% CPU overhead for most workloads. Spikes to 5-10% during high-syscall periods (heavy file I/O, fork-heavy workloads). Cilium network policies: ~1% overhead for L3/L4 policies. L7 policy inspection adds ~3-5% for HTTP workloads. Cilium Tetragon (syscall enforcement): 2-5% overhead with comprehensive TracingPolicy. Can be higher for shell/exec-heavy workloads. Optimization tips: scope TracingPolicy to specific namespaces (not cluster-wide). Use matchNamespace selectors to exclude system namespaces. Tune Falco rules to drop high-frequency benign events. For AI inference workloads: eBPF overhead is usually negligible compared to model inference time." },
]

export default function EbpfSecurityMonitoringPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  if (!SUPPORTED_LOCALES.includes(locale)) notFound()
  const isDE = locale === "de"

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "OpenClaw", item: `${SITE_URL}/${locale}/openclaw` },
      { "@type": "ListItem", position: 3, name: "eBPF Security Monitoring", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  const categoryColors: Record<string, string> = {
    "Runtime Enforcement": "bg-red-900 text-red-300",
    "Threat Detection": "bg-orange-900 text-orange-300",
    "Network Enforcement": "bg-blue-900 text-blue-300",
    "Forensics & Compliance": "bg-purple-900 text-purple-300",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "eBPF-Monitoring-Guide für eigene Kubernetes-Infrastruktur.", "eBPF monitoring guide for your own Kubernetes infrastructure.")}
        </div>
        <div className="mb-3"><span className="text-xs font-bold uppercase tracking-widest text-cyan-400">OpenClaw · Batch 6</span></div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "eBPF Security Monitoring", "eBPF Security Monitoring")}
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          {pick(isDE, "eBPF ermöglicht Kernel-Level-Sicherheit ohne Kernel-Module — sicherer, portabler, in managed Kubernetes verfügbar. Vier Tools: Cilium Tetragon (Enforcement), Falco eBPF (Detection), L7-Network-Policies und Syscall-Audit-Trail.", "eBPF enables kernel-level security without kernel modules — safer, more portable, available in managed Kubernetes. Four tools: Cilium Tetragon (enforcement), Falco eBPF (detection), L7 network policies and syscall audit trail.")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { value: "eBPF", label: pick(isDE, "Kein Kernel-Modul", "No kernel module") },
            { value: "L7", label: pick(isDE, "HTTP/DNS-Policy", "HTTP/DNS policy") },
            { value: "SIGKILL", label: pick(isDE, "In-Kernel-Block", "In-kernel block") },
            { value: "~3%", label: pick(isDE, "CPU-Overhead", "CPU overhead") },
          ].map((s) => (
            <div key={s.label} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 eBPF Security Tools", "4 eBPF Security Tools")}</h2>
          <div className="space-y-5">
            {EBPF_TOOLS.map((t) => (
              <div key={t.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                  <span className="font-mono text-xs text-cyan-400 bg-gray-900 px-2 py-0.5 rounded">{t.id}</span>
                  <span className="font-bold text-gray-100">{t.name}</span>
                  <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded ${categoryColors[t.category]}`}>{t.category}</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-300 mb-3">{t.desc}</p>
                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{t.code}</pre></div>
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
            <a href={`/${locale}/openclaw/runtime-policy-enforcement`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Runtime Policy Enforcement</div>
              <div className="text-sm text-gray-300">{pick(isDE, "OPA + Falco + Cilium", "OPA + Falco + Cilium")}</div>
            </a>
            <a href={`/${locale}/openclaw/container-escape-prevention`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Container Escape Prevention</div>
              <div className="text-sm text-gray-300">{pick(isDE, "eBPF als Escape-Blocker", "eBPF as escape blocker")}</div>
            </a>
            <a href={`/${locale}/openclaw/network-segmentation-guide`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Network Segmentation</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Cilium + NetworkPolicy", "Cilium + NetworkPolicy")}</div>
            </a>
            <a href={`/${locale}/solutions/kubernetes-security-hardening`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">Kubernetes Hardening</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Vollständiges K8s Hardening", "Full K8s hardening")}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
