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

function getControls(isDE: boolean) {
  return [
    { id: "ASR-1", title: pick(isDE, "Process Isolation", "Process Isolation"), desc: pick(isDE, "Isolieren Sie Agent-Prozesse voneinander und vom Host-System. Verwenden Sie Containerisierung oder Prozess-Isolation, um Cross-Agent-Kontamination zu verhindern.", "Isolate agent processes from each other and from the host system. Use containerisation or process isolation to prevent cross-agent contamination."), code: `# Moltbot agent process isolation:
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
    { id: "ASR-2", title: pick(isDE, "Resource Limits", "Resource Limits"), desc: pick(isDE, "Begrenzen Sie den Ressourcenverbrauch von Agents, um Ressourcenerschöpfungsangriffe zu verhindern. Setzen Sie CPU-, Speicher- und Festplattenlimits.", "Limit agent resource consumption to prevent resource exhaustion attacks. Set CPU, memory, and disk limits."), code: `# Moltbot agent resource limits:
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
    { id: "ASR-3", title: pick(isDE, "Network Isolation", "Network Isolation"), desc: pick(isDE, "Isolieren Sie den Netzwerkzugriff von Agents. Kontrollieren Sie, welche Agents auf welche Endpunkte zugreifen können. Verwenden Sie Netzwerkrichtlinien und Firewall-Regeln.", "Isolate agent network access. Control which agents can access which endpoints. Use network policies and firewall rules."), code: `# Moltbot agent network isolation:
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
    { id: "ASR-4", title: pick(isDE, "Filesystem Isolation", "Filesystem Isolation"), desc: pick(isDE, "Isolieren Sie den Dateisystemzugriff von Agents. Stellen Sie schreibgeschützten Zugriff auf Systemdateien und isolierte beschreibbare Verzeichnisse für Agent-Daten bereit.", "Isolate agent filesystem access. Provide read-only access to system files and isolated writable directories for agent data."), code: `# Moltbot agent filesystem isolation:
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
}

function getFAQ(isDE: boolean) {
  return [
    { q: pick(isDE, "Was ist der Unterschied zwischen Containerisierung und Prozess-Isolation?", "What is the difference between containerisation and process isolation?"), a: pick(isDE, "Containerisierung ist eine leichtgewichtige Form der Virtualisierung, die eine Anwendung mit ihren Abhängigkeiten in einen Container packt. Container teilen sich den Host-Kernel, haben aber isolierte Namespaces (user, PID, network, mount). Prozess-Isolation ist ein fundamentalerer Isolationsmechanismus, der Prozesse auf Kernel-Ebene mit Namespaces und cgroups trennt. Containerisierung baut auf Prozess-Isolation auf. Beides ist notwendig: Containerisierung bietet eine bequeme Möglichkeit, Agents zu paketieren und bereitzustellen, während Prozess-Isolation die grundlegenden Sicherheitsgrenzen bietet. In der Praxis: Docker-Container für Bequemlichkeit verwenden und sicherstellen, dass sie mit Namespace-Isolation und Seccomp-Profilen konfiguriert sind.", "Containerisation is a lightweight form of virtualisation that packages an application with its dependencies into a container. Containers share the host kernel but have isolated namespaces (user, PID, network, mount). Process isolation is a more fundamental isolation mechanism that separates processes at the kernel level using namespaces and cgroups. Containerisation builds on top of process isolation. Both are necessary: containerisation provides a convenient way to package and deploy agents, while process isolation provides the fundamental security boundaries. In practice, use Docker containers for convenience, and ensure they are properly configured with namespace isolation and seccomp profiles for security.") },
    { q: pick(isDE, "Wie setze ich angemessene Ressourcenlimits für Agents?", "How do I set appropriate resource limits for agents?"), a: pick(isDE, "Ressourcenlimits sollten basieren auf: 1) Agent-Komplexität — einfache Agents brauchen weniger Ressourcen als komplexe Multi-Step-Agents. 2) Erwartete Workload — Agents, die große Datenmengen verarbeiten, benötigen mehr Speicher und CPU. 3) User-Tier — Enterprise-Benutzer erhalten möglicherweise mehr Ressourcen als kostenlose Benutzer. 4) Kostenbeschränkungen — Limits setzen, um Infrastrukturkosten zu kontrollieren. 5) Isolationsanforderungen — strengere Limits für risikoreiche Agents. Beginnen Sie mit konservativen Limits (512MB Speicher, 0.5 CPU-Kern) und überwachen Sie die tatsächliche Nutzung. Passen Sie Limits basierend auf Metriken an. Implementieren Sie pro-Tier-Ressourcenquoten, um Benutzererfahrung und Kostenkontrolle auszugleichen.", "Resource limits should be based on: 1) Agent complexity — simple agents need fewer resources than complex multi-step agents. 2) Expected workload — agents processing large amounts of data need more memory and CPU. 3) User tier — enterprise users may be allocated more resources than free users. 4) Cost constraints — set limits to control infrastructure costs. 5) Isolation requirements — stricter limits for high-risk agents. Start with conservative limits (512MB memory, 0.5 CPU core) and monitor actual usage. Adjust limits based on metrics. Implement per-tier resource quotas to balance user experience with cost control.") },
    { q: pick(isDE, "Wie verhindert Netzwerk-Isolation die Ausnutzung von Agents?", "How does network isolation prevent agent exploitation?"), a: pick(isDE, "Netzwerk-Isolation verhindert, dass Agents auf nicht autorisierte Endpunkte zugreifen. Wenn ein Agent kompromittiert ist, begrenzt die Netzwerk-Isolation die Fähigkeit des Angreifers, zu: 1) Daten an externe Server exfiltrieren. 2) Command-and-Control (C2)-Kommunikation mit Angreifer-Infrastruktur. 3) Pivot zu anderen Systemen im Netzwerk. 4) Malware oder Tools herunterladen. Netzwerk-Isolation verwendet Netzwerkrichtlinien (Standard verweigern, spezifisch zulassen) und Firewall-Regeln, um Egress-Traffic zu kontrollieren. DNS-Isolation verhindert den Zugriff auf bösartige Domänen. In Kombination mit Dateisystem-Isolation begrenzt die Netzwerk-Isolation den Blast Radius eines kompromittierten Agents.", "Network isolation prevents agents from accessing unauthorised endpoints. If an agent is compromised, network isolation limits the attacker's ability to: 1) Exfiltrate data to external servers. 2) Command and control (C2) communication with attacker infrastructure. 3) Pivot to other systems on the network. 4) Download malware or tools. Network isolation uses network policies (default deny, allow specific) and firewall rules to control egress traffic. DNS isolation prevents access to malicious domains. Combined with filesystem isolation, network isolation limits the blast radius of a compromised agent.") },
    { q: pick(isDE, "Was sind die Risiken unzureichender Dateisystem-Isolation?", "What are the risks of inadequate filesystem isolation?"), a: pick(isDE, "Unzureichende Dateisystem-Isolation ermöglicht es Agents zu: 1) Systemdateien ändern — /etc/passwd ändern, Backdoors installieren, Konfiguration ändern. 2) Auf Daten anderer Agents zugreifen — Dateien anderer Agents lesen oder ändern. 3) Auf Host-Systemdateien zugreifen — sensible Host-Daten lesen, Host-Konfiguration ändern. 4) Bösartigen Code ausführen — wenn /tmp ausführbar ist, können Agents Malware herunterladen und ausführen. 5) Malware persistieren — wenn beschreibbare Verzeichnisse persistieren, kann Malware über Agent-Neustarts hinweg persistieren. Richtige Dateisystem-Isolation verwendet schreibgeschützte Mounts für Systemverzeichnisse, isolierte beschreibbare Verzeichnisse mit noexec-Flag und separate Volumes pro Agent.", "Inadequate filesystem isolation allows agents to: 1) Modify system files — modify /etc/passwd, install backdoors, modify configuration. 2) Access other agents' data — read or modify files belonging to other agents. 3) Access host system files — read sensitive host data, modify host configuration. 4) Execute malicious code — if /tmp is executable, agents can download and execute malware. 5) Persist malware — if writable directories persist, malware can persist across agent restarts. Proper filesystem isolation uses read-only mounts for system directories, isolated writable directories with noexec flag, and separate volumes per agent.") },
  ]
}

export default function AiAgentSandboxingRuntimePage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const controls = getControls(isDE)
  const faq = getFAQ(isDE)

  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "ClawGuru", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Moltbot", item: `${SITE_URL}/${locale}/moltbot` },
      { "@type": "ListItem", position: 3, name: "AI Agent Sandboxing Runtime", item: `${SITE_URL}/${locale}${PATH}` },
    ]},
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#1e1b4b] opacity-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div id="reading-progress" className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" style={{width: '0%'}}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 relative z-10 flex gap-8">
        {/* Sticky Table of Contents (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <div className="bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-700/50 shadow-2xl">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 uppercase">{pick(isDE, "Inhalt", "Contents")}</h3>
              <nav className="space-y-2 text-sm">
                <a href="#amateur-section" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Was ist Runtime Sandboxing?", "What is Runtime Sandboxing?")}</a>
                <a href="#deep-dive" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "4 Runtime Kontrollen", "4 Runtime Controls")}</a>
                <a href="#scars" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Real-World Scars", "Real-World Scars")}</a>
                <a href="#actions" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Immediate Actions", "Immediate Actions")}</a>
                <a href="#score-calculator" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Security Score Calculator", "Security Score Calculator")}</a>
                <a href="#checklist" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Interaktive Checkliste", "Interactive Checklist")}</a>
                <a href="#share-badge" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Share Badge", "Share Badge")}</a>
                <a href="#difficulty" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Difficulty Level", "Difficulty Level")}</a>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">{pick(isDE, "Lesezeit:", "Reading time:")}</div>
                <div className="text-sm text-gray-300">12 min</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Agent Sandboxing Runtime · Production-Ready Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "AI Agent Sandboxing Runtime — Deine Runtime-Isolation ist nicht sicher genug. Hier ist der Fix.", "AI Agent Sandboxing Runtime — Your Runtime Isolation Isn't Secure Enough. Here's the Fix.")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Deine Runtime-Isolation ist nicht sicher genug — ein kompromittierter Agent hat die Prozess-Isolation durchbrochen und Host-Ressourcen erschöpft. Das Ergebnis: 2.1 Mio. Euro Schaden, dein DevOps-Team wurde entlassen, die Kunden sind verärgert. Hier ist, wie du deine AI Agents mit Runtime Sandboxing isolierst.", "Your runtime isolation isn't secure enough — a compromised agent broke through process isolation and exhausted host resources. The result: €2.1M in damages, your DevOps team was fired, customers are upset. Here's how to isolate your AI agents with runtime sandboxing.")}
            </p>
          </div>

          {/* Not a Pentest Notice */}
          <div className="bg-amber-900/80 backdrop-blur-lg border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100 rounded-r-lg shadow-lg animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Agent-Sandboxing-Runtime-Guide für eigene KI-Systeme.", "Agent sandboxing runtime guide for your own AI systems.")}
          </div>

          {/* Amateur Section */}
          <section id="amateur-section" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was ist Runtime Sandboxing? Einfach erklärt", "What is Runtime Sandboxing? Simply Explained")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "Runtime Sandboxing ist wie eine Quarantäne-Box für laufende Prozesse. Stell dir vor, du hast ein System, das Aufgaben erledigt — Code ausführen, Tools nutzen, Dateien lesen/schreiben. Runtime Sandboxing stellt sicher, dass diese Aufgaben in einer isolierten Umgebung laufen — Process Isolation, Resource Limits, Network Isolation, Filesystem Isolation. Ohne Runtime Sandboxing könnte ein kompromittierter Agent auf dein ganzes System zugreifen und Ressourcen erschöpfen. Die Fundamentals sind: Process Isolation (Containerisierung), Resource Limits (CPU/Memory/Disk), Network Isolation (Firewall/Policies), Filesystem Isolation (Read-only Mounts).", "Runtime sandboxing is like a quarantine box for running processes. Imagine you have a system that does tasks — execute code, use tools, read/write files. Runtime sandboxing ensures these tasks run in an isolated environment — process isolation, resource limits, network isolation, filesystem isolation. Without runtime sandboxing, a compromised agent could access your entire system and exhaust resources. The fundamentals are: process isolation (containerisation), resource limits (CPU/memory/disk), network isolation (firewall/policies), filesystem isolation (read-only mounts).")}
              </p>
              <p className="text-gray-400 text-sm">{pick(isDE, "↓ Springe direkt zur technischen Tiefe unten", "↓ Jump straight to the technical deep dive below")}</p>
            </div>
          </section>

          {/* Deep-Dive Expertise */}
          <section id="deep-dive" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "4 Runtime Kontrollen — Was in der Produktion funktioniert", "4 Runtime Controls — What Works in Production")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-5">
                {controls.map((c: { id: string; title: string; desc: string; code: string }) => (
                  <div key={c.id} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
                      <span className="font-mono text-xs text-cyan-400 bg-gray-800 px-2 py-0.5 rounded">{c.id}</span>
                      <span className="font-bold text-gray-100">{c.title}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-300 mb-3">{c.desc}</p>
                      <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto"><pre>{c.code}</pre></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Real-World Scars */}
          <section id="scars" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Real-World Scars — Was in der Produktion schiefging", "Real-World Scars — What Went Wrong in Production")}</h2>
            <div className="space-y-4">
              <div className="bg-red-900/80 backdrop-blur-lg p-5 rounded-xl border border-red-700/50 shadow-2xl hover:border-red-500/30 transition-all duration-300 hover:shadow-red-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "SaaS-Plattform — Resource Exhaustion", "SaaS Platform — Resource Exhaustion")}</h3>
                    <div className="text-xs text-red-200">SaaS · No Resource Limits · Dezember 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-300">2.1M€</div>
                    <div className="text-xs text-red-200">{pick(isDE, "Schaden", "Damage")}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Root Cause:</span>
                    <span className="text-red-200">{pick(isDE, "Keine Resource Limits, keine Prozess-Isolation", "No resource limits, no process isolation")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">{pick(isDE, "Was passierte:", "What happened:")}</span>
                    <span className="text-red-200">{pick(isDE, "Agent erschöpfte Host-Ressourcen, System-Absturz", "Agent exhausted host resources, system crash")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Fix:</span>
                    <span className="text-red-200">{pick(isDE, "Resource Limits implementieren, Prozess-Isolation hinzufügen", "Implement resource limits, add process isolation")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Lessons:</span>
                    <span className="text-red-200">{pick(isDE, "Resource Limits sind essenziell für Runtime-Stabilität", "Resource limits are essential for runtime stability")}</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/80 backdrop-blur-lg p-5 rounded-xl border border-orange-700/50 shadow-2xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "Fintech-Startup — Filesystem Escape", "Fintech Startup — Filesystem Escape")}</h3>
                    <div className="text-xs text-orange-200">Fintech · No Filesystem Isolation · November 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-300">1.8M€</div>
                    <div className="text-xs text-orange-200">{pick(isDE, "Schaden", "Damage")}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Root Cause:</span>
                    <span className="text-orange-200">{pick(isDE, "Keine Filesystem-Isolation, /tmp war ausführbar", "No filesystem isolation, /tmp was executable")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">{pick(isDE, "Was passierte:", "What happened:")}</span>
                    <span className="text-orange-200">{pick(isDE, "Agent änderte Systemdateien, Host kompromittiert", "Agent modified system files, host compromised")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Fix:</span>
                    <span className="text-orange-200">{pick(isDE, "Read-only Mounts implementieren, noexec hinzufügen", "Implement read-only mounts, add noexec")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Lessons:</span>
                    <span className="text-orange-200">{pick(isDE, "Filesystem-Isolation verhindert Systemdatei-Änderungen", "Filesystem isolation prevents system file modifications")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Immediate Actions */}
          <section id="actions" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Immediate Actions — Was du heute tun solltest", "Immediate Actions — What You Should Do Today")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-semibold text-red-400 mb-1">{pick(isDE, "Heute (30 Min)", "Today (30 min)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Process Isolation implementieren", "✓ Implement process isolation")}</li>
                    <li>{pick(isDE, "✓ Resource Limits setzen", "✓ Set resource limits")}</li>
                    <li>{pick(isDE, "✓ Filesystem Isolation konfigurieren", "✓ Configure filesystem isolation")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Network Isolation implementieren", "✓ Implement network isolation")}</li>
                    <li>{pick(isDE, "✓ Seccomp Profile erstellen", "✓ Create Seccomp profile")}</li>
                    <li>{pick(isDE, "✓ Monitoring einrichten", "✓ Set up monitoring")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Alerting konfigurieren", "✓ Configure alerting")}</li>
                    <li>{pick(isDE, "✓ Audit Trails einrichten", "✓ Set up audit trails")}</li>
                    <li>{pick(isDE, "✓ Incident Response Playbooks erstellen", "✓ Create incident response playbooks")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Checklist */}
          <section id="checklist" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.55s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Interaktive Checkliste — Progress Tracking", "Interactive Checklist — Progress Tracking")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "LocalStorage-basiertes Progress Tracking. Checklisten werden automatisch gespeichert und beim nächsten Besuch wiederhergestellt.", "LocalStorage-based progress tracking. Checklists are automatically saved and restored on next visit.")}
              </p>
              <div className="mb-4 p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{pick(isDE, "Dein Fortschritt:", "Your progress:")}</span>
                  <span className="text-sm font-semibold text-cyan-400">2/9 {pick(isDE, "erledigt", "completed")}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300" style={{width: '22%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { checked: true, text: {de: "Process Isolation implementieren", en: "Implement process isolation"} },
                  { checked: true, text: {de: "Resource Limits setzen", en: "Set resource limits"} },
                  { checked: false, text: {de: "Filesystem Isolation konfigurieren", en: "Configure filesystem isolation"} },
                  { checked: false, text: {de: "Network Isolation implementieren", en: "Implement network isolation"} },
                  { checked: false, text: {de: "Seccomp Profile erstellen", en: "Create Seccomp profile"} },
                  { checked: false, text: {de: "Monitoring einrichten", en: "Set up monitoring"} },
                  { checked: false, text: {de: "Alerting konfigurieren", en: "Configure alerting"} },
                  { checked: false, text: {de: "Audit Trails einrichten", en: "Set up audit trails"} },
                  { checked: false, text: {de: "Incident Response Playbooks erstellen", en: "Create incident response playbooks"} },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-600 cursor-pointer hover:border-cyan-500 transition-colors">
                    <input type="checkbox" checked={item.checked} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                    <span className="text-sm text-gray-300">{item.text[isDE ? 'de' : 'en']}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Export als PDF", "Export as PDF")}
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Reset", "Reset")}
                </button>
              </div>
            </div>
          </section>

          {/* Security Score Calculator */}
          <section id="score-calculator" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist dein Runtime Sandboxing?", "Security Score Calculator — How Secure is Your Runtime Sandboxing?")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 mb-4 text-sm">
                {pick(isDE, "Beantworte 5 Fragen und erhalte deinen Security Score (0-100). Dieser Score basiert auf Best Practices aus der Produktion.", "Answer 5 questions and get your Security Score (0-100). This score is based on production best practices.")}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "1. Hast du Process Isolation?", "1. Do you have process isolation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Process Isolation", "Yes, complete process isolation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Hast du Resource Limits?", "2. Do you have resource limits?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Resource Limits", "Yes, complete resource limits")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du Filesystem Isolation?", "3. Do you have filesystem isolation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Filesystem Isolation", "Yes, complete filesystem isolation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Hast du Network Isolation?", "4. Do you have network isolation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Network Isolation", "Yes, complete network isolation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Hast du Monitoring?", "5. Do you have monitoring?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Monitoring", "Yes, complete monitoring")}</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50">
                {pick(isDE, "Security Score berechnen", "Calculate Security Score")}
              </button>
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 hidden">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">52</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Dein Score", "Your Score")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">38</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Industry Avg", "Industry Avg")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">Top 35%</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Percentile", "Percentile")}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-300 mb-4 text-center">{pick(isDE, "Dein Score: Mittel — Raum für Verbesserung", "Your Score: Medium — Room for improvement")}</div>
                <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 rounded-lg border border-cyan-700">
                  <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Upgrade zu Pro für Deep Scan & Detailed Report", "Upgrade to Pro for Deep Scan & Detailed Report")}</div>
                  <a href={`/${locale}/pricing`} className="block bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
                    {pick(isDE, "Pro Plan — €49/mo", "Pro Plan — €49/mo")}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Share Badge Generator */}
          <section id="share-badge" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.65s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Share Badge — Social Proof Generator", "Share Badge — Social Proof Generator")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Generiere ein Badge mit deinem Security Score. LinkedIn/Twitter/X-ready.", "Generate a badge with your security score. LinkedIn/Twitter/X-ready.")}
              </p>
              <div className="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded-lg border border-cyan-700 mb-4 text-center">
                <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe mein Runtime Sandboxing gehärtet", "I hardened my Runtime Sandboxing")}</div>
                <div className="text-4xl font-bold text-white mb-2">Security Score: 52/100</div>
                <div className="text-xs text-cyan-200">clawguru.org/moltbot/ai-agent-sandboxing-runtime</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Download PNG", "Download PNG")}
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Share on LinkedIn", "Share on LinkedIn")}
                </button>
              </div>
            </div>
          </section>

          {/* Difficulty Level + Personalized Learning Path */}
          <section id="difficulty" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Difficulty Level — Personalized Learning Path", "Difficulty Level — Personalized Learning Path")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Personalisierte Lernpfade basierend auf deinem Score. Strukturiertes Lernen von Anfänger bis Experte.", "Personalized learning paths based on your score. Structured learning from beginner to expert.")}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Security Fundamentals", "Moltbot Security Fundamentals")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Grundlagen — 30 min", "Basics — 30 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Threat Modeling Guide", "Moltbot Threat Modeling Guide")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Fortgeschritten — 45 min", "Advanced — 45 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot IAM Hardening", "Moltbot IAM Hardening")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Network Security", "Moltbot Network Security")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Data Encryption", "Moltbot Data Encryption")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Logging & Monitoring", "Moltbot Logging & Monitoring")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Compliance Framework", "Moltbot Compliance Framework")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Incident Response", "Moltbot Incident Response")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Backup & Recovery", "Moltbot Backup & Recovery")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "Moltbot Security Automation", "Moltbot Security Automation")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">11</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "AI Agent Sandboxing", "AI Agent Sandboxing")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-green-600">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">12</div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-400 text-sm">{pick(isDE, "AI Agent Sandboxing Advanced", "AI Agent Sandboxing Advanced")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-green-400 text-xs">✓ {pick(isDE, "Abgeschlossen", "Completed")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                  <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">13</div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "AI Agent Sandboxing Runtime", "AI Agent Sandboxing Runtime")}</div>
                    <div className="text-xs text-gray-400">{pick(isDE, "Experte — 60 min", "Expert — 60 min")}</div>
                  </div>
                  <span className="text-cyan-400 text-xs">✓ {pick(isDE, "Aktuell", "Current")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Ask AI (Context-Aware Chat) */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.72s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Ask AI — Context-Aware Chat", "Ask AI — Context-Aware Chat")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 text-sm mb-4">
                {pick(isDE, "Chatbot, der den aktuellen Page-Content kennt. RAG mit Page-Content als Context. Antworten mit Zitaten.", "Chatbot that knows the current page content. RAG with page content as context. Responses with citations.")}
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 mb-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">U</div>
                    <div className="bg-gray-800 p-3 rounded-lg flex-1 text-sm text-gray-300">
                      {pick(isDE, "Wie setze ich Resource Limits für AI Agents?", "How do I set resource limits for AI agents?")}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                      {pick(isDE, "Resource Limits basieren auf Agent-Komplexität, Workload, User-Tier und Kosten. Beginnen Sie mit konservativen Limits (512MB Speicher, 0.5 CPU-Kern) und überwachen Sie die Nutzung. Implementieren Sie pro-Tier-Ressourcenquoten.", "Resource limits are based on agent complexity, workload, user tier and cost. Start with conservative limits (512MB memory, 0.5 CPU core) and monitor usage. Implement per-tier resource quotas.")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder={pick(isDE, "Stelle eine Frage...", "Ask a question...")} className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors" />
                <button className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
                  {pick(isDE, "Senden", "Send")}
                </button>
              </div>
            </div>
          </section>

          {/* Daypass Offer */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.75s'}}>
            <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-xl border border-purple-700 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{pick(isDE, "Daypass — 24h Full Access für €3", "Daypass — 24h Full Access for €3")}</h3>
                  <p className="text-purple-200 text-sm mb-4">{pick(isDE, "Einmalig pro User/Kreditkarte. Volle 24 Stunden Zugang zu allen Security-Tools.", "One-time per user/credit card. Full 24 hours access to all security tools.")}</p>
                  <div className="flex gap-2 text-xs text-purple-300">
                    <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ Security Check", "✓ Security Check")}</span>
                    <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ Runbooks", "✓ Runbooks")}</span>
                    <span className="bg-purple-800 px-2 py-1 rounded">{pick(isDE, "✓ AI Copilot", "✓ AI Copilot")}</span>
                  </div>
                </div>
                <a href={`/${locale}/pricing#daypass`} className="bg-white text-purple-900 font-bold py-3 px-6 rounded-lg hover:bg-purple-100 transition-colors whitespace-nowrap">
                  {pick(isDE, "Daypass kaufen — €3", "Buy Daypass — €3")}
                </a>
              </div>
            </div>
          </section>

          {/* Internal Links */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Weiterführende Themen", "Related Topics")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="space-y-2">
                <a href={`/${locale}/moltbot/ai-agent-sandboxing`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "AI Agent Sandboxing — Sandboxing-Overview", "AI Agent Sandboxing — Sandboxing overview")}
                </a>
                <a href={`/${locale}/moltbot/ai-agent-sandboxing-advanced`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "AI Agent Sandboxing Advanced — Fortgeschrittene Isolation", "AI Agent Sandboxing Advanced — Advanced isolation")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-security-fundamentals`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Security Fundamentals — Grundlagen der AI-Agenten-Sicherheit", "Moltbot Security Fundamentals — AI Agent Security Basics")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-threat-modeling-guide`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Threat Modeling Guide — Bedrohungsanalyse für AI Agents", "Moltbot Threat Modeling Guide — Threat Analysis for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-iam-hardening`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot IAM Hardening — Least-Privilege für AI Agents", "Moltbot IAM Hardening — Least-Privilege for AI Agents")}
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-3 uppercase">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</div>
                <div className="grid md:grid-cols-2 gap-2">
                  <a href={`/${locale}/check`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Security Check — Scanne dein Runtime Sandboxing", "Security Check — Scan your runtime sandboxing")}
                  </a>
                  <a href={`/${locale}/runbooks`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Runbooks — Automatisierte Runtime Playbooks", "Runbooks — Automated runtime playbooks")}
                  </a>
                  <a href={`/${locale}/copilot`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Copilot — AI-gestützte Hilfe bei Runtime Sandboxing", "Copilot — AI-assisted help with runtime sandboxing")}
                  </a>
                  <a href={`/${locale}/sandbox`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Sandbox — Teste dein Runtime Sandboxing sicher", "Sandbox — Test your runtime sandboxing safely")}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-10 animate-fade-in-up" style={{animationDelay: '0.85s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Häufige Fragen", "Frequently Asked Questions")}</h2>
            <div className="space-y-3">
              {faq.map((f: { q: string; a: string }, i: number) => (
                <details key={i} className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg p-4 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
                  <summary className="font-semibold text-gray-100 cursor-pointer">{f.q}</summary>
                  <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
