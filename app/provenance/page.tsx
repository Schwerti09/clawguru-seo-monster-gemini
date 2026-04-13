// PROVENANCE SINGULARITY v3.4 – Overlord AI
// /provenance – Provenance Index Page
// Lists all runbooks with their immutable cryptographic provenance chains.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "Provenance Index | ClawGuru",
  description:
    "Immutable cryptographic provenance chains for every ClawGuru runbook. Ed25519 signatures, Merkle-tree verification, SOC2 / ISO 27001 audit-ready.",
  alternates: { canonical: "/provenance" },
}

export default async function ProvenanceIndexPage() {
  const { materializedRunbooks } = await import("@/lib/pseo")
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Provenance Index",
    description:
      "Cryptographic provenance chains for all ClawGuru runbooks. Append-only hash-chain, Ed25519 signatures, Merkle-tree verified.",
    numberOfItems: Math.min(50, materializedRunbooks().length),
    itemListElement: materializedRunbooks().slice(0, 50).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/provenance/${r.slug}`,
      name: `${r.title} – Provenance Chain`,
    })),
  }

  const sorted = [...materializedRunbooks()].sort((a, b) => a.title.localeCompare(b.title))

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Was ist Runbook Provenance?', acceptedAnswer: { '@type': 'Answer', text: 'Runbook Provenance ist die kryptographische Herkunftskette eines Runbooks: wann wurde es erstellt, von wem, welche Änderungen wurden wann gemacht. Jedes ClawGuru Runbook hat einen unveränderlichen Provenance-Hash (SHA-256). Compliance-Vorteil: Auditoren können prüfen dass Runbooks nicht nachträglich manipuliert wurden. Wichtig für: SOC2, ISO27001, regulatorische Audits.' } },
          { '@type': 'Question', name: 'Wie verifiziere ich die Integrität eines ClawGuru Runbooks?', acceptedAnswer: { '@type': 'Answer', text: 'Runbook-Integrität prüfen: Provenance-Hash auf dieser Seite mit dem Hash im Runbook vergleichen. CLI: clawguru runbook verify <id> — gibt OK oder TAMPERED zurück. API: GET /api/provenance/<id> gibt Provenance-Chain als JSON. Automatische Verifikation: ClawGuru verifiziert alle Runbooks bei jedem Deployment. Externe Verifikation möglich: Hash-Werte sind öffentlich zugänglich.' } },
          { '@type': 'Question', name: 'Was ist der Unterschied zwischen Runbook-Version und Provenance?', acceptedAnswer: { '@type': 'Answer', text: 'Version vs. Provenance: Version bezeichnet den inhaltlichen Stand (v1.2.3). Provenance ist die kryptographische Kette aller Versionen mit Zeitstempel und Autor-Hash. Während Versionen überschrieben werden können, ist die Provenance-Chain unveränderlich (append-only, wie Blockchain). Compliance-Anforderung: SOC2 CC6.1 verlangt Nachweisbarkeit von Config-Änderungen — Provenance erfüllt das.' } },
          { '@type': 'Question', name: 'Werden Runbook-Änderungen in der Provenance erfasst?', acceptedAnswer: { '@type': 'Answer', text: 'Ja — jede Änderung an einem ClawGuru Runbook erzeugt einen neuen Provenance-Eintrag: Timestamp (UTC), Content-Hash (SHA-256), Editor-ID (anonymisiert), Change-Summary. Die gesamte Provenance-Chain ist über die API abrufbar. Für Enterprise-Kunden: vollständige Autor-Attribution und Approval-Workflow (4-Augen-Prinzip) für Runbook-Änderungen.' } },
        ],
      }) }} />
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Cryptographic Audit Trail"
          title="Provenance Index"
          subtitle="Every runbook has an immutable hash-chain. Ed25519 signatures · Merkle-tree verified · SOC2 / ISO 27001 ready."
        />

        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-500 mb-10">
          <span className="px-2 py-1 rounded-lg border border-gray-800 bg-black/20">
            📌 Append-only hash-chain
          </span>
          <span className="px-2 py-1 rounded-lg border border-gray-800 bg-black/20">
            🔐 Ed25519 signatures
          </span>
          <span className="px-2 py-1 rounded-lg border border-gray-800 bg-black/20">
            🌲 Merkle-tree verified
          </span>
          <span className="px-2 py-1 rounded-lg border border-gray-800 bg-black/20">
            📋 SOC2 / ISO 27001 ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((r) => (
            <a
              key={r.slug}
              href={`/provenance/${r.slug}`}
              className="group flex items-start gap-3 p-4 rounded-2xl border border-gray-800 bg-black/20 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-colors"
            >
              <span className="text-lg mt-0.5">🔗</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-200 group-hover:text-cyan-300 truncate transition-colors">
                  {r.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">{r.slug}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 p-5 rounded-3xl border border-gray-800 bg-black/20 text-xs text-gray-500 leading-relaxed">
          <div className="font-black text-gray-400 mb-1">⚖ Compliance Note</div>
          Each provenance record is generated deterministically from the runbook&apos;s content
          hash-chain and is suitable as audit evidence for SOC2 Type II, ISO 27001, and CIS
          Benchmark v8 compliance programmes. No personal data is stored in any provenance chain.
        </div>
      </div>
    </Container>
  )
}
