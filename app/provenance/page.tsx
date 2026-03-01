// PROVENANCE SINGULARITY v3.4 – Overlord AI
// /provenance – Provenance Index Page
// Lists all runbooks with their immutable cryptographic provenance chains.

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import { RUNBOOKS } from "@/lib/pseo"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-static"

export const metadata = {
  title: "Provenance Index | ClawGuru",
  description:
    "Immutable cryptographic provenance chains for every ClawGuru runbook. Ed25519 signatures, Merkle-tree verification, SOC2 / ISO 27001 audit-ready.",
  alternates: { canonical: "/provenance" },
}

export default function ProvenanceIndexPage() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ClawGuru Provenance Index",
    description:
      "Cryptographic provenance chains for all ClawGuru runbooks. Append-only hash-chain, Ed25519 signatures, Merkle-tree verified.",
    numberOfItems: Math.min(50, RUNBOOKS.length),
    itemListElement: RUNBOOKS.slice(0, 50).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/provenance/${r.slug}`,
      name: `${r.title} – Provenance Chain`,
    })),
  }

  const sorted = [...RUNBOOKS].sort((a, b) => a.title.localeCompare(b.title))

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
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
