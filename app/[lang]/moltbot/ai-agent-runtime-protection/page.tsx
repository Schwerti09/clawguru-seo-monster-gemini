import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-runtime-protection"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Runtime Protection: Laufzeitschutz für AI-Agents | ClawGuru" : "AI Agent Runtime Protection: Runtime Protection for AI Agents | ClawGuru"
  const description = isDE ? "AI Agent Runtime Protection für Moltbot. RASP, eBPF-basierter Laufzeitschutz, Syscall Filtering und Behavioral Monitoring für AI-Agent-Prozesse." : "AI agent runtime protection for Moltbot. RASP, eBPF-based runtime protection, syscall filtering and behavioral monitoring for AI agent processes."
  return {
    title, description,
    keywords: ["ai agent runtime protection", "rasp", "ebpf", "syscall filtering", "behavioral monitoring", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentRuntimeProtectionPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Runtime Protection" : "AI Agent Runtime Protection"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Runtime Protection für Moltbot. RASP, eBPF-basierter Laufzeitschutz, Syscall Filtering und Behavioral Monitoring für AI-Agent-Prozesse." : "AI agent runtime protection for Moltbot. RASP, eBPF-based runtime protection, syscall filtering and behavioral monitoring for AI agent processes."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. RASP (Runtime Application Self-Protection)", isDE ? "RASP schützt AI-Agent-Prozesse von innen. Erkennt und blockiert Angriffe in Echtzeit ohne externes Tool." : "RASP protects AI agent processes from within. Detects and blocks attacks in real-time without external tool."],
              ["2. eBPF-basierter Laufzeitschutz", isDE ? "eBPF-Programme im Linux Kernel für hochperformante Verhaltensüberwachung. Falco oder Tetragon für AI-Workloads." : "eBPF programs in Linux kernel for high-performance behavioral monitoring. Falco or Tetragon for AI workloads."],
              ["3. Syscall Filtering (seccomp)", isDE ? "Seccomp-Profile für AI-Agent-Container. Nur erlaubte System Calls werden ausgeführt — alles andere wird geblockt." : "Seccomp profiles for AI agent containers. Only allowed system calls are executed — everything else is blocked."],
              ["4. Process Isolation", isDE ? "Jeder AI-Agent läuft in einem isolierten Prozess. Namespace-Isolation und Cgroup-Limits verhindern Ressourcenmissbrauch." : "Each AI agent runs in an isolated process. Namespace isolation and cgroup limits prevent resource abuse."],
              ["5. Behavioral Baseline", isDE ? "Normale Agent-Aktivität als Baseline erfassen. Abweichungen vom Normalverhalten werden sofort erkannt und gemeldet." : "Capture normal agent activity as baseline. Deviations from normal behavior are immediately detected and reported."],
            ].map(([t, d]) => (
              <div key={t as string} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="font-bold text-cyan-400 mb-2">{t}</h3>
                <p className="text-sm text-gray-300">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Fortgeschrittene Techniken" : "Advanced Techniques"}</h2>
          <div className="space-y-4">
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">{isDE ? "Tetragon für AI-Workloads" : "Tetragon for AI Workloads"}</h3><p className="text-sm text-green-200">{isDE ? "Cilium Tetragon für granulares Kernel-Level Monitoring. Process Execution, Network Connections und File Access überwachen." : "Cilium Tetragon for granular kernel-level monitoring. Monitor process execution, network connections and file access."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "AppArmor Profile" : "AppArmor Profiles"}</h3><p className="text-sm text-blue-200">{isDE ? "AppArmor Mandatory Access Control für AI-Agent-Prozesse. Fein-granulare Dateisystem- und Netzwerkrechte." : "AppArmor mandatory access control for AI agent processes. Fine-grained filesystem and network permissions."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Memory Protection" : "Memory Protection"}</h3><p className="text-sm text-yellow-200">{isDE ? "ASLR, DEP und Stack Canaries für AI-Agent-Prozesse. Schutz vor Buffer Overflow und Memory Injection." : "ASLR, DEP and stack canaries for AI agent processes. Protection against buffer overflow and memory injection."}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Auto-Kill bei Anomalien" : "Auto-Kill on Anomalies"}</h3><p className="text-sm text-red-200">{isDE ? "Automatisches Beenden von AI-Agent-Prozessen bei erkannten Anomalien. Fail-Safe statt Weiterarbeiten unter Angriff." : "Automatic termination of AI agent processes on detected anomalies. Fail-safe instead of continuing under attack."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Seccomp-Profile erstellen" : "Create seccomp profiles", isDE ? "Minimal-Syscall-Profile für jeden AI-Agent-Typ erstellen. Mit strace/seccomp-bpf das notwendige Set ermitteln." : "Create minimal syscall profiles for each AI agent type. Determine necessary set with strace/seccomp-bpf."],
              [2, isDE ? "Falco oder Tetragon deployen" : "Deploy Falco or Tetragon", isDE ? "eBPF-basiertes Runtime Security Tool deployen. Falco-Regeln für AI-spezifische Threats konfigurieren." : "Deploy eBPF-based runtime security tool. Configure Falco rules for AI-specific threats."],
              [3, isDE ? "AppArmor Profile aktivieren" : "Enable AppArmor profiles", isDE ? "AppArmor Profile für AI-Agent-Container schreiben und aktivieren. Im Enforce-Modus deployen." : "Write and enable AppArmor profiles for AI agent containers. Deploy in enforce mode."],
              [4, isDE ? "Behavioral Baseline aufbauen" : "Build behavioral baseline", isDE ? "Normales Verhalten der AI-Agents in Production aufzeichnen. Grundlage für Anomalie-Detection." : "Record normal behavior of AI agents in production. Foundation for anomaly detection."],
              [5, isDE ? "Alert-Routing konfigurieren" : "Configure alert routing", isDE ? "Runtime-Alerts an SIEM und On-Call-Team routen. Kritische Anomalien: sofortige Eskalation." : "Route runtime alerts to SIEM and on-call team. Critical anomalies: immediate escalation."],
            ].map(([n, t, d]) => (
              <div key={n as number} className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">{n}</div>
                <div><div className="font-semibold text-gray-100 mb-2">{t}</div><div className="text-sm text-gray-300">{d}</div></div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Weiterführende Ressourcen" : "Further Resources"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href={`/${locale}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Security Check</div><div className="text-sm text-gray-300">{isDE ? "Infrastruktur prüfen" : "Check infrastructure"}</div></a>
            <a href={`/${locale}/runbooks`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Runbooks</div><div className="text-sm text-gray-300">{isDE ? "Expert-validierte Security Runbooks" : "Expert-validated security runbooks"}</div></a>
            <a href={`/${locale}/openclaw`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">OpenClaw</div><div className="text-sm text-gray-300">{isDE ? "OpenClaw Security Framework" : "OpenClaw Security Framework"}</div></a>
            <a href={`/${locale}/roast-my-moltbot`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"><div className="font-semibold text-cyan-400">Roast My Moltbot</div><div className="text-sm text-gray-300">{isDE ? "Moltbot Security Testing" : "Moltbot security testing"}</div></a>
          </div>
        </section>
      </div>
    </div>
  )
}
