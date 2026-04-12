// NEXT-LEVEL UPGRADE 2026: Zero-Knowledge Security Check Page
// 100% client-side – no data ever leaves the browser.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import ZeroKnowledgeCheck from "@/components/security/ZeroKnowledgeCheck"

export const metadata: Metadata = {
  title: "Zero-Knowledge Security Check | ClawGuru",
  description:
    "Analysiere Configs, Logs und Code vollständig im Browser. Kein Datentransfer, keine Server-Calls – 100% Zero-Knowledge Sicherheitsanalyse.",
  alternates: { canonical: "/security/zero-knowledge" },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was bedeutet Zero-Knowledge Security Check?', acceptedAnswer: { '@type': 'Answer', text: 'Zero-Knowledge Security Check bedeutet: die gesamte Analyse läuft im Browser des Nutzers, keine Daten verlassen das Gerät. Configs, Logs und Code werden lokal verarbeitet — kein Server-Call, keine Speicherung, kein Tracking. Ideal für sensible Produktions-Configs, die nicht an externe Dienste gesendet werden dürfen (DSGVO, HIPAA, interne Security-Policies).' } },
    { '@type': 'Question', name: 'Welche Daten kann ich im Zero-Knowledge Check analysieren?', acceptedAnswer: { '@type': 'Answer', text: 'Zero-Knowledge Check unterstützt: nginx/Apache Config-Files (Prüfung auf Security-Headers, TLS-Config). Docker Compose/Kubernetes YAML (Sicherheits-Misconfigs). .env-Dateien (Secrets-Leaks-Erkennung, nie an Server senden). SSH Config (Hardening-Prüfung). Firewall-Regeln (ufw, iptables). Alle Analysen: 100% client-seitig in WebAssembly oder JavaScript.' } },
    { '@type': 'Question', name: 'Wie unterscheidet sich Zero-Knowledge vom normalen Security Check?', acceptedAnswer: { '@type': 'Answer', text: 'Normaler ClawGuru Check: analysiert extern sichtbare Eigenschaften (HTTP Headers, TLS) durch Server-seitige Anfragen. Zero-Knowledge Check: analysiert interne Config-Files die du hochlädst, vollständig client-seitig. Kombination ideal: externer Check für öffentliche Exposition + Zero-Knowledge für interne Config-Qualität. Keine dieser Methoden ersetzt einen Pentest.' } },
    { '@type': 'Question', name: 'Ist der Zero-Knowledge Check wirklich sicher?', acceptedAnswer: { '@type': 'Answer', text: 'Zero-Knowledge Sicherheitsgarantien: Browser-Isolation verhindert Datenaustausch mit Servern. Kein Netzwerk-Request bei der Analyse (überprüfbar im Browser DevTools: Network-Tab zeigt keine Requests beim Upload). Open-Source-Code verifizierbar. Empfehlung für hochsensible Daten: zusätzlich offline-Analyse mit lokalen Tools (lynis, docker-bench-security) erwägen.' } },
  ],
}

export default function ZeroKnowledgePage() {
  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="py-16 max-w-3xl mx-auto">
        <div className="mb-2 text-xs text-gray-500 uppercase tracking-widest">Security · Zero-Knowledge</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Zero-Knowledge Check
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          Analysiere Configs, Logs und Code vollständig im Browser.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Kein Datentransfer · Kein Server-Call · Kein Tracking. Deine Daten bleiben 100% lokal.
        </p>

        {/* NEXT-LEVEL UPGRADE 2026: Zero-Knowledge Check Component */}
        <ZeroKnowledgeCheck />

        {/* How it works */}
        <div className="mt-8 p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h2 className="text-base font-black mb-3">Wie funktioniert Zero-Knowledge Mode?</h2>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-[#00ff9d] font-bold mt-0.5">1.</span>
              <span>Du fügst deinen Code, deine Config oder dein Log in das Textfeld ein.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#00ff9d] font-bold mt-0.5">2.</span>
              <span>Die Analyse läuft vollständig in deinem Browser – kein Byte verlässt dein Gerät.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#00ff9d] font-bold mt-0.5">3.</span>
              <span>Befunde werden mit Schweregrad und Fix-Empfehlung angezeigt.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#00ff9d] font-bold mt-0.5">4.</span>
              <span>Ein deterministischer ZK-Hash beweist, dass die Analyse lokal stattfand.</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
