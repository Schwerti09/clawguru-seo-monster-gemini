import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

export default function Security() {
  return (
    <Container>
      <div className="py-16 max-w-4xl mx-auto">
        <SectionTitle
          kicker="Hub"
          title="Security"
          subtitle="CVE-Klassen, Misconfigs, Runbooks. Ziel: Handeln, nicht scrollen."
        />

        <div className="grid md:grid-cols-2 gap-4">
          <a className="p-6 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40" href="/security/notfall-leitfaden">
            <div className="text-brand-red font-black">Notfall-Leitfaden</div>
            <div className="text-gray-400">0–60 Minuten Runbook, wenn du exponiert bist.</div>
          </a>
          <a className="p-6 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40" href="/openclaw-security-2026#cves">
            <div className="text-brand-cyan font-black">CVE & Angriffsklassen</div>
            <div className="text-gray-400">Was zählt + wie du mitigierst.</div>
          </a>
          <a className="p-6 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40" href="/tools">
            <div className="text-brand-orange font-black">Tools</div>
            <div className="text-gray-400">Validatoren, Checklisten, Reports.</div>
          </a>
          <a className="p-6 rounded-2xl border border-gray-800 bg-black/30 hover:bg-black/40" href="/copilot">
            <div className="text-green-400 font-black">Copilot</div>
            <div className="text-gray-400">Konversation → Prioritäten → Runbook.</div>
          </a>
          {/* NEXT-LEVEL UPGRADE 2026: Zero-Knowledge Check link */}
          <a className="p-6 rounded-2xl border border-[#00ff9d]/20 bg-[#00ff9d]/5 hover:bg-[#00ff9d]/10 md:col-span-2" href="/security/zero-knowledge">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00ff9d] font-black">🔒 Zero-Knowledge Check</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-[#00ff9d]/40 text-[#00ff9d] font-bold">NEU 2026</span>
            </div>
            <div className="text-gray-400">Config, Log oder Code lokal analysieren – kein Byte verlässt den Browser.</div>
          </a>
        </div>
      </div>
    </Container>
  )
}
