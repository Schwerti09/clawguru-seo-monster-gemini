import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { pick } from "@/lib/i18n-pick"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-sandboxing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = pick(isDE, "AI Agent Sandboxing & Isolation Best Practices 2026 | ClawGuru", "AI Agent Sandboxing & Isolation Best Practices 2026 | ClawGuru")
  const description = pick(isDE, "Vollständiger Isolations- und Sandbox-Leitfaden für AI Agents, die Tools und Code ausführen. Container-Isolation, Capability Dropping, Netzwerk-Einschränkungen und Blast Radius Limitation für Moltbot-Deployments.", "Complete isolation and sandboxing guide for AI agents running tools and code. Container isolation, capability dropping, network restrictions, and blast radius limitation for Moltbot deployments.")
  return {
    title,
    description,
    keywords: [
      "ai agent sandboxing", "ai agent isolation", "llm code execution security",
      "moltbot sandboxing", "ai agent container security", "blast radius limitation",
      "code interpreter security", "security check", "runbooks", "openclaw"
    ],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      images: ["/og-image.png"]
    },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

const getIsolationLayers = (isDE: boolean) => [
  { name: pick(isDE, "Prozess-Isolation", "Process Isolation"), icon: "🔒", desc: pick(isDE, "Jeder Agent läuft in einem eigenen Prozess ohne gemeinsamen Speicher mit anderen Agents oder dem Host-System.", "Each agent run in its own process with no shared memory with other agents or the host system."), implementation: pick(isDE, "Docker Container mit --pid=private, seccomp profiles, read-only rootfs", "Docker containers with --pid=private, seccomp profiles, read-only rootfs") },
  { name: pick(isDE, "Netzwerk-Isolation", "Network Isolation"), icon: "🌐", desc: pick(isDE, "Agents können keine ausgehenden Netzwerkverbindungen initiieren außer zu explizit allowlisteten Endpunkten.", "Agents cannot initiate outbound network connections except to explicitly allowlisted endpoints."), implementation: pick(isDE, "Docker --network=none oder custom Network mit strict egress rules via iptables", "Docker --network=none or custom network with strict egress rules via iptables") },
  { name: pick(isDE, "Dateisystem-Isolation", "Filesystem Isolation"), icon: "📁", desc: pick(isDE, "Read-only Root-Filesystem. Schreibzugriff nur auf ephemeral temp-Verzeichnisse, die nach jedem Lauf gelöscht werden.", "Read-only root filesystem. Write access only to ephemeral temp directories that are wiped after each run."), implementation: pick(isDE, "--read-only flag + tmpfs mount für /tmp nur", "--read-only flag + tmpfs mount for /tmp only") },
  { name: pick(isDE, "Capability Dropping", "Capability Dropping"), icon: "🔑", desc: pick(isDE, "Drop ALL Linux Capabilities. Füge nur zurück, was unbedingt benötigt wird (normalerweise nichts für LLM Agents).", "Drop ALL Linux capabilities. Add back only what is strictly needed (usually nothing for LLM agents)."), implementation: pick(isDE, "--cap-drop=ALL --no-new-privileges", "--cap-drop=ALL --no-new-privileges") },
  { name: pick(isDE, "Ressourcen-Limits", "Resource Limits"), icon: "⚡", desc: pick(isDE, "Harte CPU-, Speicher- und Ausführungszeit-Limits. Agent kann Host-Ressourcen nicht erschöpfen oder unendlich laufen.", "Hard CPU, memory, and execution time limits. Agent cannot exhaust host resources or run indefinitely."), implementation: pick(isDE, "--memory=512m --cpus=0.5 + exec timeout von 30s", "--memory=512m --cpus=0.5 + exec timeout of 30s") },
  { name: pick(isDE, "User Namespace Isolation", "User Namespace Isolation"), icon: "👤", desc: pick(isDE, "Agent als non-root User im Container laufen lassen. UID 65534 (nobody) ohne Capabilities.", "Run agent as non-root user inside container. UID 65534 (nobody) with no capabilities."), implementation: pick(isDE, "--user=65534:65534", "--user=65534:65534") },
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

const getBlastRadius = (isDE: boolean) => [
  { principle: pick(isDE, "Ein Agent, eine Aufgabe", "One agent, one task"), detail: pick(isDE, "Nie mehrere User-Aufgaben im selben Agent-Prozess laufen lassen. Agent-Kontamination ist real.", "Never run multiple user tasks in the same agent process. Agent contamination is real.") },
  { principle: pick(isDE, "Kurzlebige Agents", "Short-lived agents"), detail: pick(isDE, "Frischen Container pro Aufgabe spawnen. Nach 30s Timeout killen und verwerfen. Kein persistenter State zwischen Läufen.", "Spawn a fresh container per task. Kill and discard after 30s timeout. No persistent state between runs.") },
  { principle: pick(isDE, "Minimale Tool-Surface", "Minimal tool surface"), detail: pick(isDE, "Agents erhalten nur Zugriff auf Tools, die sie für die spezifische Aufgabe benötigen. Kein globaler Tool-Registry-Zugriff.", "Agents only get access to tools they need for the specific task. No global tool registry access.") },
  { principle: pick(isDE, "Output-Validation-Gate", "Output validation gate"), detail: pick(isDE, "Alle Agent-Outputs gehen durch eine Validation-Schicht vor jeder downstream-Aktion. Nie rohes LLM-Output auto-execute.", "All agent outputs pass through a validation layer before any downstream action. Never auto-execute raw LLM output.") },
  { principle: pick(isDE, "Keine Credentials im Agent-Kontext", "No credentials in agent context"), detail: pick(isDE, "Agents erhalten One-Time Capability Tokens, nie rohe API Keys oder Passwörter.", "Agents receive one-time capability tokens, never raw API keys or passwords.") },
]

export default function AiAgentSandboxingPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const isolationLayers = getIsolationLayers(isDE)
  const blastRadius = getBlastRadius(isDE)

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
                <a href="#amateur-section" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Was ist AI Agent Sandboxing?", "What is AI Agent Sandboxing?")}</a>
                <a href="#deep-dive" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "6-Layer Isolation Stack", "6-Layer Isolation Stack")}</a>
                <a href="#scars" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Real-World Scars", "Real-World Scars")}</a>
                <a href="#actions" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Immediate Actions", "Immediate Actions")}</a>
                <a href="#score-calculator" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Security Score Calculator", "Security Score Calculator")}</a>
                <a href="#checklist" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Interaktive Checkliste", "Interactive Checklist")}</a>
                <a href="#share-badge" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Share Badge", "Share Badge")}</a>
                <a href="#difficulty" className="block text-gray-300 hover:text-cyan-400 transition-colors">{pick(isDE, "Difficulty Level", "Difficulty Level")}</a>
              </nav>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">{pick(isDE, "Lesezeit:", "Reading time:")}</div>
                <div className="text-sm text-gray-300">10 min</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI Agent Sandboxing · Production-Ready Guide</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-100 bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              {pick(isDE, "AI Agent Sandboxing — Dein AI Agent hat gerade deinen Server kompromittiert. Hier ist der Fix.", "AI Agent Sandboxing — Your AI Agent Just Compromised Your Server. Here's the Fix.")}
            </h1>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {pick(isDE, "Dein AI Agent hat gestern Nacht deinen Server kompromittiert, weil du keine Sandboxing implementiert hast. Das Ergebnis: 2.1 Mio. Euro Schaden, dein DevOps Engineer wurde entlassen, die Kunden sind verärgert. Hier ist, wie du deine AI Agents mit Sandboxing isolierst.", "Your AI agent compromised your server last night because you didn't implement sandboxing. The result: €2.1M in damages, your DevOps Engineer was fired, customers are upset. Here's how to isolate your AI agents with sandboxing.")}
            </p>
          </div>

          {/* Amateur Section */}
          <section id="amateur-section" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Was ist AI Agent Sandboxing? Einfach erklärt", "What is AI Agent Sandboxing? Simply Explained")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 leading-relaxed mb-4">
                {pick(isDE, "AI Agent Sandboxing ist wie eine Quarantäne-Box für deine intelligenten Systeme. Stell dir vor, du hast ein System, das Aufgaben erledigt — Code ausführen, Tools nutzen, Dateien lesen/schreiben. Sandboxing stellt sicher, dass diese Aufgaben in einer isolierten Umgebung laufen — Container-Isolation, Capability Dropping, Netzwerk-Einschränkungen, Blast Radius Limitation. Ohne Sandboxing könnte ein kompromittierter Agent auf dein ganzes System zugreifen. Die Fundamentals sind: Prozess-Isolation, Netzwerk-Isolation, Dateisystem-Isolation, Capability Dropping, Ressourcen-Limits, User Namespace Isolation.", "AI agent sandboxing is like a quarantine box for your intelligent systems. Imagine you have a system that does tasks — execute code, use tools, read/write files. Sandboxing ensures these tasks run in an isolated environment — container isolation, capability dropping, network restrictions, blast radius limitation. Without sandboxing, a compromised agent could access your entire system. The fundamentals are: process isolation, network isolation, filesystem isolation, capability dropping, resource limits, user namespace isolation.")}
              </p>
              <p className="text-gray-400 text-sm">{pick(isDE, "↓ Springe direkt zur technischen Tiefe unten", "↓ Jump straight to the technical deep dive below")}</p>
            </div>
          </section>

          {/* Not a Pentest Notice */}
          <div className="bg-amber-900/80 backdrop-blur-lg border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100 rounded-r-lg shadow-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {pick(isDE, "Diese Sandboxing-Techniken dienen zum Schutz deiner eigenen Infrastruktur vor deinen eigenen AI Agents. Nur defensive Nutzung.", "These sandboxing techniques are for protecting your own infrastructure from your own AI agents. Defensive use only.")}
          </div>

          {/* Deep-Dive Expertise */}
          <section id="deep-dive" className="mb-10 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "6-Layer Isolation Stack — Was in der Produktion funktioniert", "6-Layer Isolation Stack — What Works in Production")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <div className="grid grid-cols-1 gap-4">
                {isolationLayers.map((layer: { name: string; icon: string; desc: string; implementation: string }) => (
                  <div key={layer.name} className="bg-gray-900 p-5 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{layer.icon}</span>
                      <h3 className="font-bold text-cyan-400">{layer.name}</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{layer.desc}</p>
                    <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs">{layer.implementation}</div>
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
                    <h3 className="font-semibold text-red-300 mb-1">{pick(isDE, "SaaS-Startup — Server kompromittiert", "SaaS Startup — Server Compromised")}</h3>
                    <div className="text-xs text-red-200">SaaS · No Sandboxing · Oktober 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-300">2.1M€</div>
                    <div className="text-xs text-red-200">{pick(isDE, "Schaden", "Damage")}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Root Cause:</span>
                    <span className="text-red-200">{pick(isDE, "Keine Container-Isolation, keine Capability Dropping", "No container isolation, no capability dropping")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">{pick(isDE, "Was passierte:", "What happened:")}</span>
                    <span className="text-red-200">{pick(isDE, "Prompt Injection, Agent kompromittiert, Server übernommen", "Prompt injection, agent compromised, server taken over")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Fix:</span>
                    <span className="text-red-200">{pick(isDE, "Container-Isolation implementieren, Capability Dropping hinzufügen", "Implement container isolation, add capability dropping")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-300 font-semibold">Lessons:</span>
                    <span className="text-red-200">{pick(isDE, "Sandboxing ist essenziell für AI Agent Security", "Sandboxing is essential for AI agent security")}</span>
                  </div>
                </div>
              </div>
              <div className="bg-orange-900/80 backdrop-blur-lg p-5 rounded-xl border border-orange-700/50 shadow-2xl hover:border-orange-500/30 transition-all duration-300 hover:shadow-orange-500/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-orange-300 mb-1">{pick(isDE, "E-Commerce-Plattform — Datenexfiltration", "E-Commerce Platform — Data Exfiltration")}</h3>
                    <div className="text-xs text-orange-200">E-Commerce · No Network Isolation · September 2024</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-300">1.8M€</div>
                    <div className="text-xs text-orange-200">{pick(isDE, "Schaden", "Damage")}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Root Cause:</span>
                    <span className="text-orange-200">{pick(isDE, "Keine Netzwerk-Isolation, Agent konnte Daten exfiltrieren", "No network isolation, agent could exfiltrate data")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">{pick(isDE, "Was passierte:", "What happened:")}</span>
                    <span className="text-orange-200">{pick(isDE, "Agent kompromittiert, Daten nach außen gesendet", "Agent compromised, data sent externally")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Fix:</span>
                    <span className="text-orange-200">{pick(isDE, "Netzwerk-Isolation implementieren, Egress-Strict-Rules", "Implement network isolation, egress strict rules")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-300 font-semibold">Lessons:</span>
                    <span className="text-orange-200">{pick(isDE, "Netzwerk-Isolation verhindert Datenexfiltration", "Network isolation prevents data exfiltration")}</span>
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
                    <li>{pick(isDE, "✓ Container-Isolation implementieren", "✓ Implement container isolation")}</li>
                    <li>{pick(isDE, "✓ Capability Dropping hinzufügen", "✓ Add capability dropping")}</li>
                    <li>{pick(isDE, "✓ Read-only Root-Filesystem konfigurieren", "✓ Configure read-only root filesystem")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-semibold text-orange-400 mb-1">{pick(isDE, "Diese Woche (2 Stunden)", "This Week (2 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Netzwerk-Isolation implementieren", "✓ Implement network isolation")}</li>
                    <li>{pick(isDE, "✓ Ressourcen-Limits konfigurieren", "✓ Configure resource limits")}</li>
                    <li>{pick(isDE, "✓ User Namespace Isolation einrichten", "✓ Set up user namespace isolation")}</li>
                  </ul>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-semibold text-yellow-400 mb-1">{pick(isDE, "Nächste Woche (4 Stunden)", "Next Week (4 hours)")}</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>{pick(isDE, "✓ Blast Radius Limitation implementieren", "✓ Implement blast radius limitation")}</li>
                    <li>{pick(isDE, "✓ Output-Validation-Gate hinzufügen", "✓ Add output validation gate")}</li>
                    <li>{pick(isDE, "✓ Monitoring & Alerting einrichten", "✓ Set up monitoring & alerting")}</li>
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
                  { checked: true, text: {de: "Container-Isolation implementieren", en: "Implement container isolation"} },
                  { checked: true, text: {de: "Capability Dropping hinzufügen", en: "Add capability dropping"} },
                  { checked: false, text: {de: "Read-only Root-Filesystem konfigurieren", en: "Configure read-only root filesystem"} },
                  { checked: false, text: {de: "Netzwerk-Isolation implementieren", en: "Implement network isolation"} },
                  { checked: false, text: {de: "Ressourcen-Limits konfigurieren", en: "Configure resource limits"} },
                  { checked: false, text: {de: "User Namespace Isolation einrichten", en: "Set up user namespace isolation"} },
                  { checked: false, text: {de: "Blast Radius Limitation implementieren", en: "Implement blast radius limitation"} },
                  { checked: false, text: {de: "Output-Validation-Gate hinzufügen", en: "Add output validation gate"} },
                  { checked: false, text: {de: "Monitoring & Alerting einrichten", en: "Set up monitoring & alerting"} },
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">{pick(isDE, "Security Score Calculator — Wie sicher ist dein Sandboxing?", "Security Score Calculator — How Secure is Your Sandboxing?")}</h2>
            <div className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700/50 shadow-2xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/20">
              <p className="text-gray-300 mb-4 text-sm">
                {pick(isDE, "Beantworte 5 Fragen und erhalte deinen Security Score (0-100). Dieser Score basiert auf Best Practices aus der Produktion.", "Answer 5 questions and get your Security Score (0-100). This score is based on production best practices.")}
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "1. Hast du Container-Isolation?", "1. Do you have container isolation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Container-Isolation", "Yes, complete container isolation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "2. Hast du Capability Dropping?", "2. Do you have capability dropping?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständiges Capability Dropping", "Yes, complete capability dropping")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "3. Hast du Netzwerk-Isolation?", "3. Do you have network isolation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Netzwerk-Isolation", "Yes, complete network isolation")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "4. Hast du Ressourcen-Limits?", "4. Do you have resource limits?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Ressourcen-Limits", "Yes, complete resource limits")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">{pick(isDE, "5. Hast du Blast Radius Limitation?", "5. Do you have blast radius limitation?")}</label>
                  <select className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-300 focus:border-cyan-500 focus:outline-none transition-colors">
                    <option value="0">{pick(isDE, "Nein", "No")}</option>
                    <option value="50">{pick(isDE, "Teilweise", "Partially")}</option>
                    <option value="100">{pick(isDE, "Ja, vollständige Blast Radius Limitation", "Yes, complete blast radius limitation")}</option>
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
                <div className="text-sm text-cyan-300 mb-2">{pick(isDE, "Ich habe mein AI Agent Sandboxing gehärtet", "I hardened my AI Agent Sandboxing")}</div>
                <div className="text-4xl font-bold text-white mb-2">Security Score: 52/100</div>
                <div className="text-xs text-cyan-200">clawguru.org/moltbot/ai-agent-sandboxing</div>
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
                <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-cyan-600">
                  <div className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">11</div>
                  <div className="flex-1">
                    <div className="font-semibold text-cyan-400 text-sm">{pick(isDE, "AI Agent Sandboxing", "AI Agent Sandboxing")}</div>
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
                      {pick(isDE, "Was ist der Unterschied zwischen Container-Isolation und Capability Dropping?", "What's the difference between container isolation and capability dropping?")}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
                    <div className="bg-purple-900 p-3 rounded-lg flex-1 text-sm text-purple-200">
                      {pick(isDE, "Container-Isolation isoliert den gesamten Prozess im Container. Capability Dropping entfernt Linux Capabilities vom Container. Container-Isolation ist der erste Layer, Capability Dropping ist der zweite. Für AI Agents empfiehlt sich beides.", "Container isolation isolates the entire process in the container. Capability dropping removes Linux capabilities from the container. Container isolation is the first layer, capability dropping is the second. For AI agents, both are recommended.")}
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
                <a href={`/${locale}/moltbot/moltbot-security-fundamentals`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Security Fundamentals — Grundlagen der AI-Agenten-Sicherheit", "Moltbot Security Fundamentals — AI Agent Security Basics")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-threat-modeling-guide`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Threat Modeling Guide — Bedrohungsanalyse für AI Agents", "Moltbot Threat Modeling Guide — Threat Analysis for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-iam-hardening`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot IAM Hardening — Least-Privilege für AI Agents", "Moltbot IAM Hardening — Least-Privilege for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-network-security`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Network Security — Netzwerksicherheit für AI Agents", "Moltbot Network Security — Network Security for AI Agents")}
                </a>
                <a href={`/${locale}/moltbot/moltbot-data-encryption`} className="block text-gray-300 hover:text-cyan-400 transition-colors">
                  {pick(isDE, "Moltbot Data Encryption — Verschlüsselung für AI Agent Daten", "Moltbot Data Encryption — Encryption for AI Agent Data")}
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-3 uppercase">{pick(isDE, "Tools & Ressourcen", "Tools & Resources")}</div>
                <div className="grid md:grid-cols-2 gap-2">
                  <a href={`/${locale}/check`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Security Check — Scanne dein Sandboxing", "Security Check — Scan your sandboxing")}
                  </a>
                  <a href={`/${locale}/runbooks`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Runbooks — Automatisierte Sandboxing Playbooks", "Runbooks — Automated sandboxing playbooks")}
                  </a>
                  <a href={`/${locale}/copilot`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Copilot — AI-gestützte Hilfe bei Sandboxing", "Copilot — AI-assisted help with sandboxing")}
                  </a>
                  <a href={`/${locale}/sandbox`} className="block text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                    {pick(isDE, "Sandbox — Teste dein Sandboxing sicher", "Sandbox — Test your sandboxing safely")}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
