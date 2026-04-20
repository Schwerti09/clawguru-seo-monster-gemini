import type { Metadata } from "next"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/moltbot/ai-agent-access-control"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const isDE = locale === "de"
  const title = isDE ? "AI Agent Access Control: Zugriffskontrolle für AI-Agents | ClawGuru" : "AI Agent Access Control: Access Control for AI Agents | ClawGuru"
  const description = isDE ? "AI Agent Access Control für Moltbot. RBAC, ABAC, Policy-based Access Control und granulare Berechtigungsmodelle für AI-Agent-Systeme." : "AI agent access control for Moltbot. RBAC, ABAC, policy-based access control and granular permission models for AI agent systems."
  return {
    title, description,
    keywords: ["ai agent access control", "rbac", "abac", "policy based access control", "permissions", "moltbot security 2026"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow"
  }
}

export default function AIAgentAccessControlPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-100">{isDE ? "AI Agent Access Control" : "AI Agent Access Control"}</h1>
          <p className="text-lg text-gray-300 mb-4">{isDE ? "AI Agent Access Control für Moltbot. RBAC, ABAC, Policy-based Access Control und granulare Berechtigungsmodelle für AI-Agent-Systeme." : "AI agent access control for Moltbot. RBAC, ABAC, policy-based access control and granular permission models for AI agent systems."}</p>
        </div>
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong className="text-amber-100">"Not a Pentest" Notice</strong>: {isDE ? "Dieser Leitfaden dient zur Härtung Ihrer eigenen Systeme. Keine Angriffstools." : "This guide is for hardening your own systems. No attack tools."}
        </div>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Kernkonzepte" : "Core Concepts"}</h2>
          <div className="space-y-4">
            {[
              ["1. Role-Based Access Control (RBAC)", isDE ? "Rollenbasierte Zugriffskontrolle für AI-Agents. Klare Rollen mit definierten Berechtigungen — kein Wildcard-Zugriff." : "Role-based access control for AI agents. Clear roles with defined permissions — no wildcard access."],
              ["2. Attribute-Based Access Control (ABAC)", isDE ? "Attribut-basierte Zugriffsentscheidungen für feingranulare Kontrolle. Kontext-awareness in Zugriffsrichtlinien." : "Attribute-based access decisions for fine-grained control. Context-awareness in access policies."],
              ["3. Least Privilege Enforcement", isDE ? "Durchsetzung des Least-Privilege-Prinzips für jeden Agent. Regelmäßige Access Reviews und Privilege Cleanup." : "Enforcement of the least-privilege principle for every agent. Regular access reviews and privilege cleanup."],
              ["4. Just-In-Time Access", isDE ? "Temporärer Zugriff nur wenn benötigt. AI-Agents erhalten erhöhte Berechtigungen nur für die Dauer einer Aufgabe." : "Temporary access only when needed. AI agents receive elevated permissions only for the duration of a task."],
              ["5. Access Policy as Code", isDE ? "Zugriffsrichtlinien als Code mit Open Policy Agent (OPA). Versioniert, testbar und automatisch durchgesetzt." : "Access policies as code with Open Policy Agent (OPA). Versioned, testable and automatically enforced."],
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
            <div className="bg-green-900 p-4 rounded-lg border border-green-700"><h3 className="font-semibold text-green-300 mb-2">OPA Gatekeeper</h3><p className="text-sm text-green-200">{isDE ? "OPA Gatekeeper für Kubernetes Policy Enforcement. AI-Agent-Pods ohne korrekte Annotations werden geblockt." : "OPA Gatekeeper for Kubernetes policy enforcement. AI agent pods without correct annotations are blocked."}</p></div>
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700"><h3 className="font-semibold text-blue-300 mb-2">{isDE ? "Dynamic Authorization" : "Dynamic Authorization"}</h3><p className="text-sm text-blue-200">{isDE ? "Kontextabhängige Autorisierung zur Laufzeit. Zugriffsrechte basierend auf aktuellem Risikolevel und Kontext." : "Context-dependent authorization at runtime. Access rights based on current risk level and context."}</p></div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700"><h3 className="font-semibold text-yellow-300 mb-2">{isDE ? "Access Governance" : "Access Governance"}</h3><p className="text-sm text-yellow-200">{isDE ? "Regelmäßige Access Certification Campaigns. Manager-Bestätigung aller Agent-Berechtigungen quartalsweise." : "Regular access certification campaigns. Manager confirmation of all agent permissions quarterly."}</p></div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700"><h3 className="font-semibold text-red-300 mb-2">{isDE ? "Privilege Escalation Detection" : "Privilege Escalation Detection"}</h3><p className="text-sm text-red-200">{isDE ? "Erkennung von Privilege Escalation Versuchen durch AI-Agents. Alert bei unerwarteten Berechtigungsänderungen." : "Detection of privilege escalation attempts by AI agents. Alert on unexpected permission changes."}</p></div>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{isDE ? "Implementierungsschritte" : "Implementation Steps"}</h2>
          <div className="space-y-6">
            {[
              [1, isDE ? "Berechtigungsmatrix erstellen" : "Create permission matrix", isDE ? "Für jeden Agent-Typ die benötigten Berechtigungen dokumentieren. Basis für RBAC-Design." : "Document required permissions for each agent type. Basis for RBAC design."],
              [2, isDE ? "RBAC-Rollen definieren" : "Define RBAC roles", isDE ? "Minimale Rollen-Hierarchie erstellen. Kein Catch-all-Admin-Role für AI-Agents." : "Create minimal role hierarchy. No catch-all admin role for AI agents."],
              [3, isDE ? "OPA Policies schreiben" : "Write OPA policies", isDE ? "Zugriffsregeln als Rego-Code formulieren. Policies in CI/CD testen bevor sie produktiv gehen." : "Formulate access rules as Rego code. Test policies in CI/CD before going to production."],
              [4, isDE ? "Just-In-Time implementieren" : "Implement Just-In-Time", isDE ? "JIT-Zugriff für sensitive Operationen einrichten. Automatischer Entzug nach Task-Abschluss." : "Set up JIT access for sensitive operations. Automatic revocation after task completion."],
              [5, isDE ? "Access Reviews automatisieren" : "Automate access reviews", isDE ? "Quartalsweise Access Reviews automatisieren. Ungenutzte Berechtigungen automatisch entziehen." : "Automate quarterly access reviews. Automatically revoke unused permissions."],
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
