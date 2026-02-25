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

export default function ZeroKnowledgePage() {
  return (
    <Container>
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
