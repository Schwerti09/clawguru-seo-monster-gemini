import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-sandboxing-advanced"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE
    ? "AI Agent Sandboxing Advanced: Fortgeschrittene Isolation für AI-Agents | ClawGuru"
    : "AI Agent Sandboxing Advanced: Advanced Isolation for AI Agents | ClawGuru"
  const description = isDE
    ? "Fortgeschrittene AI Agent Sandboxing für Moltbot-Deployments. Docker Isolation, Capability Dropping, Network Restriction und Blast Radius Limitation. Mit Moltbot automatisierbar."
    : "Advanced AI agent sandboxing for Moltbot deployments. Docker isolation, capability dropping, network restriction and blast radius limitation. Automatable with Moltbot."
  return {
    title,
    description,
    keywords: [
      "ai agent sandboxing", "docker isolation", "capability dropping",
      "network restriction", "blast radius", "container security",
      "moltbot security", "ai agent isolation", "sandboxing 2026",
      "security check", "runbooks", "openclaw"
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

export default function AIAgentSandboxingAdvancedPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">
            {isDE ? "AI Agent Sandboxing Advanced" : "AI Agent Sandboxing Advanced"}
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            {isDE
              ? "Fortgeschrittene AI Agent Sandboxing für Moltbot-Deployments. Docker Isolation, Capability Dropping, Network Restriction und Blast Radius Limitation."
              : "Advanced AI agent sandboxing for Moltbot deployments. Docker isolation, capability dropping, network restriction and blast radius limitation."}
          </p>
        </div>

        {/* Not a Pentest Notice */}
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE
            ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools."
            : "This guide is for hardening your own systems. No attack tools."}
        </div>

        {/* Core Concepts */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Kernkonzepte" : "Core Concepts"}
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "1. Docker Isolation" : "1. Docker Isolation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Container-basierte Isolation für AI-Agents. Read-only Dateisysteme, Resource Limits und Security Options."
                  : "Container-based isolation for AI agents. Read-only file systems, resource limits and security options."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "2. Capability Dropping" : "2. Capability Dropping"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Linux Capabilities für minimale Privilegien. Entfernen von unnötigen Capabilities für AI-Agent-Container."
                  : "Linux capabilities for minimal privileges. Remove unnecessary capabilities for AI agent containers."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "3. Network Restriction" : "3. Network Restriction"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Netzwerk-Isolation für AI-Agents. User-defined Networks, Firewall-Regeln und Egress-Filtering."
                  : "Network isolation for AI agents. User-defined networks, firewall rules and egress filtering."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "4. Blast Radius Limitation" : "4. Blast Radius Limitation"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "Blast Radius Limitation durch Multi-Tenant Isolation. Namespace-Isolation und Resource Quotas."
                  : "Blast radius limitation through multi-tenant isolation. Namespace isolation and resource quotas."}
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="font-bold text-cyan-400 mb-2">
                {isDE ? "5. Seccomp & AppArmor" : "5. Seccomp & AppArmor"}
              </h3>
              <p className="text-sm text-gray-300">
                {isDE
                  ? "System Call Filtering mit Seccomp und AppArmor Profiles für AI-Agents. Eingeschränkte System Calls."
                  : "System call filtering with Seccomp and AppArmor profiles for AI agents. Restricted system calls."}
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Techniques */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}
          </h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="font-semibold text-green-300 mb-2">
                {isDE ? "Rootless Containers" : "Rootless Containers"}
              </h3>
              <p className="text-sm text-green-200">
                {isDE
                  ? "Rootless Container für AI-Agents. Container ohne Root-Privilegien für maximale Isolation."
                  : "Rootless containers for AI agents. Containers without root privileges for maximum isolation."}
              </p>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="font-semibold text-blue-300 mb-2">
                {isDE ? "gVisor Integration" : "gVisor Integration"}
              </h3>
              <p className="text-sm text-blue-200">
                {isDE
                  ? "gVisor User-Space Kernel für Container-Security. Isolierter Kernel-Space für AI-Agents."
                  : "gVisor user-space kernel for container security. Isolated kernel space for AI agents."}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isDE ? "Kata Containers" : "Kata Containers"}
              </h3>
              <p className="text-sm text-yellow-200">
                {isDE
                  ? "Lightweight VMs für Container-Isolation. Hardware-basierte Isolation für kritische AI-Agents."
                  : "Lightweight VMs for container isolation. Hardware-based isolation for critical AI agents."}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="font-semibold text-red-300 mb-2">
                {isDE ? "Firecracker MicroVMs" : "Firecracker MicroVMs"}
              </h3>
              <p className="text-sm text-red-200">
                {isDE
                  ? "Firecracker MicroVMs für maximale Isolation. Multi-Tenant AI-Agent-Deployments mit Hardware-Isolation."
                  : "Firecracker microVMs for maximum isolation. Multi-tenant AI agent deployments with hardware isolation."}
              </p>
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Implementierungsschritte" : "Implementation Steps"}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Docker Security Options konfigurieren" : "Configure Docker security options"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Konfigurieren Sie Docker Security Options für AI-Agent-Container. Read-only, no-new-privileges, drop capabilities."
                    : "Configure Docker security options for AI agent containers. Read-only, no-new-privileges, drop capabilities."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Seccomp Profile erstellen" : "Create Seccomp profile"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Erstellen Sie Seccomp Profile für AI-Agents. Filtern Sie System Calls auf minimum."
                    : "Create Seccomp profiles for AI agents. Filter system calls to minimum."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Network Isolation implementieren" : "Implement network isolation"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Implementieren Sie Network Isolation mit User-defined Networks und Firewall-Regeln."
                    : "Implement network isolation with user-defined networks and firewall rules."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Resource Limits setzen" : "Set resource limits"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Setzen Sie Resource Limits für CPU, Memory und Disk für AI-Agent-Container."
                    : "Set resource limits for CPU, memory and disk for AI agent containers."}
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <div className="font-semibold text-gray-100 mb-2">
                  {isDE ? "Monitoring & Auditing" : "Monitoring & Auditing"}
                </div>
                <div className="text-sm text-gray-300">
                  {isDE
                    ? "Überwachen Sie AI-Agent-Container und führen Sie Audits für Sandbox-Konfigurationen durch."
                    : "Monitor AI agent containers and perform audits for sandbox configurations."}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Further Resources */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">
            {isDE ? "Weiterführende Ressourcen" : "Further Resources"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Security Check" : "Security Check"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Überprüfen Sie Ihre Infrastruktur auf Schwachstellen" : "Check your infrastructure for vulnerabilities"}
              </div>
            </a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Runbooks" : "Runbooks"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "KI-generierte Security Runbooks" : "AI-generated security runbooks"}
              </div>
            </a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "OpenClaw" : "OpenClaw"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}
              </div>
            </a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="font-semibold text-cyan-400">
                {isDE ? "Roast My Moltbot" : "Roast My Moltbot"}
              </div>
              <div className="text-sm text-gray-300">
                {isDE ? "Moltbot Security Testing" : "Moltbot security testing"}
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
