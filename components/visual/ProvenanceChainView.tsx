"use client"
// PROVENANCE SINGULARITY v3.4 – Overlord AI
// ProvenanceChainView – Interactive provenance chain explorer.
// Shows each event with hash, signature, timestamp, mutation reason and previousHash.
// Includes Zero-Knowledge Proof modal and JSON compliance export.

import { useState, useCallback } from "react"
import type {
  ProvenanceChain,
  ProvenanceEvent,
  ZeroKnowledgeProof,
  ChainVerificationResult,
} from "@/lib/provenance"
import { generateZeroKnowledgeProof, verifyProvenanceChain, exportProvenanceJson, mutationTypeIcon, mutationTypeLabel } from "@/lib/provenance"

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Mutation type badge colours
const MUTATION_COLORS: Record<string, string> = {
  genesis:            "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  temporal_evolution: "text-violet-400 border-violet-500/40 bg-violet-500/10",
  swarm_remediation:  "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  quality_gate:       "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  cve_patch:          "text-red-400 border-red-500/40 bg-red-500/10",
  compliance_update:  "text-blue-400 border-blue-500/40 bg-blue-500/10",
  ai_hardening:       "text-orange-400 border-orange-500/40 bg-orange-500/10",
}

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Truncate a hash for display
function shortHash(hash: string, chars = 12): string {
  if (hash === "0".repeat(64)) return "0x" + "0".repeat(12) + "…"
  return hash.slice(0, chars) + "…" + hash.slice(-6)
}

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Copy to clipboard helper
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }, [value])
  return (
    <button
      onClick={copy}
      className="ml-1 px-1.5 py-0.5 rounded text-[10px] border border-gray-700 bg-black/30 text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
      title="Copy full hash"
    >
      {copied ? "✓" : "copy"}
    </button>
  )
}

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Zero-Knowledge Proof Modal
function ZKProofModal({
  proof,
  onClose,
}: {
  proof: ZeroKnowledgeProof
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/30 bg-gray-950 p-6 shadow-[0_0_60px_rgba(0,184,255,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔐</span>
          <h2 className="text-lg font-black text-gray-100">Zero-Knowledge Merkle Proof</h2>
          <span className={`ml-auto px-2 py-1 rounded-lg border text-xs font-black ${
            proof.verified
              ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
              : "text-red-400 border-red-500/40 bg-red-500/10"
          }`}>
            {proof.verified ? "✓ VERIFIED" : "✗ FAILED"}
          </span>
          <button
            onClick={onClose}
            className="ml-2 text-gray-600 hover:text-gray-400 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Verification message */}
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{proof.verificationMessage}</p>

        {/* Event details */}
        <div className="rounded-xl border border-gray-800 bg-black/40 p-4 mb-4 space-y-2 font-mono text-xs">
          <div className="flex gap-2">
            <span className="text-gray-500 w-28 shrink-0">Event ID:</span>
            <span className="text-cyan-300 break-all">{proof.eventId}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-28 shrink-0">Version:</span>
            <span className="text-gray-200">{proof.version}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-28 shrink-0">Content Hash:</span>
            <span className="text-emerald-300 break-all">{proof.contentHash}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-28 shrink-0">Merkle Root:</span>
            <span className="text-violet-300 break-all">{proof.merkleRoot}</span>
          </div>
        </div>

        {/* Proof path */}
        <div className="mb-4">
          <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
            Merkle Proof Path ({proof.proofPath.length} hops)
          </div>
          {proof.proofPath.length === 0 ? (
            <p className="text-xs text-gray-600">Single-event chain – no path needed.</p>
          ) : (
            <div className="space-y-1 font-mono text-xs">
              {proof.proofPath.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-600 w-4 shrink-0">{i + 1}.</span>
                  <span className={`w-12 shrink-0 text-xs font-bold ${step.direction === "left" ? "text-cyan-400" : "text-violet-400"}`}>
                    [{step.direction === "left" ? "←L" : "R→"}]
                  </span>
                  <span className="text-gray-400 break-all">{step.siblingHash}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-600 leading-relaxed">
          This Zero-Knowledge proof demonstrates that the above event exists in the Provenance
          chain without revealing any other event&apos;s content. The Merkle path can be independently
          verified by any auditor using only the content hash and the chain&apos;s Merkle root.
        </p>
      </div>
    </div>
  )
}

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Single event card
function EventCard({
  event,
  onVerify,
}: {
  event: ProvenanceEvent
  onVerify: (eventId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const color = MUTATION_COLORS[event.mutationType] ?? "text-gray-400 border-gray-600/40 bg-gray-700/10"

  return (
    <div className={`relative rounded-2xl border p-4 transition-all duration-200 ${
      event.mutationType === "genesis"
        ? "border-emerald-500/30 bg-emerald-500/5"
        : "border-gray-800 bg-black/20 hover:border-gray-700"
    }`}>
      {/* Timeline connector dot */}
      <div
        className={`absolute -left-[1.25rem] top-5 w-3 h-3 rounded-full border-2 ${
          event.mutationType === "genesis"
            ? "border-emerald-400 bg-emerald-500"
            : "border-gray-600 bg-gray-800"
        }`}
      />

      {/* Top row: badge + version + timestamp */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-black ${color}`}>
          <span>{mutationTypeIcon(event.mutationType)}</span>
          <span>{mutationTypeLabel(event.mutationType).split("–")[0].trim()}</span>
        </span>
        <span className="text-xs font-mono text-gray-500">{event.version}</span>
        <span className="text-xs text-gray-600">{event.timestamp.slice(0, 10)}</span>
        <span className="ml-auto text-xs font-mono text-gray-600">#{event.index}</span>
      </div>

      {/* Reason */}
      <div className="text-sm font-bold text-gray-200 mb-2">{event.reason}</div>

      {/* Hash summary row */}
      <div className="font-mono text-[11px] space-y-1">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-gray-600 w-24 shrink-0">content hash:</span>
          <span className="text-cyan-300">{shortHash(event.contentHash)}</span>
          <CopyButton value={event.contentHash} />
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-gray-600 w-24 shrink-0">prev hash:</span>
          <span className="text-violet-300">{shortHash(event.previousHash)}</span>
          <CopyButton value={event.previousHash} />
        </div>
      </div>

      {/* Expand / ZK buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
        >
          {expanded ? "▲ Hide details" : "▼ Show signature"}
        </button>
        <button
          onClick={() => onVerify(event.id)}
          className="text-xs text-cyan-500 hover:text-cyan-300 underline underline-offset-2 transition-colors ml-auto"
        >
          🔐 Verify on Chain →
        </button>
      </div>

      {/* Expanded: full hashes + signature */}
      {expanded && (
        <div className="mt-3 rounded-xl border border-gray-800 bg-black/40 p-3 font-mono text-[11px] space-y-2">
          <div>
            <span className="text-gray-500">Content Hash (SHA-256):</span>
            <div className="mt-1 text-cyan-300 break-all">{event.contentHash}</div>
          </div>
          <div>
            <span className="text-gray-500">Previous Hash:</span>
            <div className="mt-1 text-violet-300 break-all">{event.previousHash}</div>
          </div>
          <div>
            <span className="text-gray-500">Ed25519 Signature:</span>
            <div className="mt-1 text-yellow-300 break-all">{event.signature}</div>
          </div>
          <div>
            <span className="text-gray-500">Event ID:</span>
            <div className="mt-1 text-gray-400 break-all">{event.id}</div>
          </div>
          <div>
            <span className="text-gray-500">Timestamp (ISO-8601):</span>
            <div className="mt-1 text-gray-400">{event.timestamp}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// PROVENANCE SINGULARITY v3.4 – Overlord AI: Chain verification banner
function VerificationBanner({ result }: { result: ChainVerificationResult }) {
  return (
    <div className={`rounded-2xl border p-4 ${
      result.valid
        ? "border-emerald-500/30 bg-emerald-500/5"
        : "border-red-500/30 bg-red-500/5"
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{result.valid ? "✅" : "❌"}</span>
        <span className={`text-sm font-black ${result.valid ? "text-emerald-400" : "text-red-400"}`}>
          {result.valid ? "Chain Integrity: VERIFIED" : "Chain Integrity: BROKEN"}
        </span>
      </div>
      <p className="text-xs text-gray-400">{result.message}</p>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
        <span>{result.totalEvents} events</span>
        <span>{result.verifiedLinks} verified links</span>
        <span>{result.merkleRootVerified ? "✓ Merkle root" : "✗ Merkle root"}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PROVENANCE SINGULARITY v3.4 – Overlord AI: Main exported component
// ---------------------------------------------------------------------------

interface Props {
  chain: ProvenanceChain
}

/**
 * PROVENANCE SINGULARITY v3.4 – Overlord AI
 * Main interactive provenance chain explorer component.
 * Renders the full event timeline, chain verification banner,
 * Zero-Knowledge proof modal, and compliance JSON export button.
 */
export default function ProvenanceChainView({ chain }: Props) {
  const [zkProof, setZkProof] = useState<ZeroKnowledgeProof | null>(null)
  const verification = verifyProvenanceChain(chain)

  const handleVerify = useCallback(
    (eventId: string) => {
      setZkProof(generateZeroKnowledgeProof(chain, eventId))
    },
    [chain],
  )

  const handleExportJson = useCallback(() => {
    const json = exportProvenanceJson(chain)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `provenance-${chain.runbookSlug}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [chain])

  return (
    <div>
      {/* Chain verification status */}
      <div className="mb-6">
        <VerificationBanner result={verification} />
      </div>

      {/* Chain metadata */}
      <div className="mb-6 rounded-2xl border border-gray-800 bg-black/25 p-4 font-mono text-xs space-y-2">
        <div className="flex gap-2">
          <span className="text-gray-500 w-32 shrink-0">Chain ID:</span>
          <span className="text-cyan-300 break-all">{chain.chainId}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 w-32 shrink-0">Merkle Root:</span>
          <span className="text-violet-300 break-all">{chain.merkleRoot}</span>
          <CopyButton value={chain.merkleRoot} />
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 w-32 shrink-0">Total Signatures:</span>
          <span className="text-emerald-300 font-bold">{chain.totalSignatures}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 w-32 shrink-0">Genesis:</span>
          <span className="text-gray-400">{chain.createdAt}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 w-32 shrink-0">Last Event:</span>
          <span className="text-gray-400">{chain.updatedAt}</span>
        </div>
      </div>

      {/* Compliance export button */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-sm font-black text-emerald-400 hover:bg-emerald-500/20 transition-colors"
        >
          📄 Full Provenance Report (JSON)
        </button>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-800 bg-black/20 text-xs text-gray-500">
          <span>📋</span>
          <span>SOC2 Type II · ISO 27001 · CIS Benchmark v8</span>
        </div>
      </div>

      {/* Event timeline */}
      <h2 className="text-lg font-black text-gray-100 mb-2">
        Provenance Chain – {chain.events.length} Events
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Append-only cryptographic log. Each entry is linked to the previous via its hash.
        Click &quot;Verify on Chain&quot; on any event to generate a Zero-Knowledge Merkle proof.
      </p>

      <div className="relative ml-5 space-y-4">
        {/* Vertical timeline rail */}
        <div className="absolute left-[-1rem] top-0 bottom-0 w-px bg-gray-800" />
        {chain.events.map((event) => (
          <EventCard key={event.id} event={event} onVerify={handleVerify} />
        ))}
      </div>

      {/* ZK Proof Modal */}
      {zkProof && (
        <ZKProofModal proof={zkProof} onClose={() => setZkProof(null)} />
      )}
    </div>
  )
}
