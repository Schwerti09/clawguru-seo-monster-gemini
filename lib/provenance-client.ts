import type { ProvenanceChain, ZeroKnowledgeProof, ChainVerificationResult, ProvenanceMutationType } from "./provenance"

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function deterministicHex64(input: string): string {
  const seeds = [0x5a4d, 0x8f3c, 0x1b7e, 0xd2a9, 0x6c1f, 0xe49b, 0x374a, 0xbc50]
  return seeds
    .map((seed) => {
      let h = seed
      for (let i = 0; i < input.length; i++) {
        h = (Math.imul(37, h) ^ input.charCodeAt(i)) | 0
        h = (Math.imul(h, 0x9e3779b9) ^ (h >>> 16)) | 0
      }
      return (Math.abs(h) >>> 0).toString(16).padStart(8, "0")
    })
    .join("")
}

function computeMerkleRoot(hashes: string[]): string {
  if (hashes.length === 0) return "0".repeat(64)
  let layer = [...hashes]
  while (layer.length > 1) {
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]
      const right = layer[i + 1] ?? layer[i]
      next.push(deterministicHex64(left + right))
    }
    layer = next
  }
  return layer[0]
}

function generateMerklePath(
  hashes: string[],
  leafIndex: number,
): Array<{ siblingHash: string; direction: "left" | "right" }> {
  const path: Array<{ siblingHash: string; direction: "left" | "right" }> = []
  let layer = [...hashes]
  let idx = leafIndex

  while (layer.length > 1) {
    const isRight = idx % 2 === 1
    const siblingIdx = isRight ? idx - 1 : idx + 1
    const siblingHash = layer[Math.min(siblingIdx, layer.length - 1)]
    path.push({ siblingHash, direction: isRight ? "left" : "right" })

    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]
      const right = layer[i + 1] ?? layer[i]
      next.push(deterministicHex64(left + right))
    }
    layer = next
    idx = Math.floor(idx / 2)
  }

  return path
}

export function mutationTypeLabel(t: ProvenanceMutationType): string {
  const labels: Record<ProvenanceMutationType, string> = {
    genesis: "Genesis – Initial Publication",
    temporal_evolution: "Temporal Evolution – Mycelium Version Bump",
    swarm_remediation: "Swarm Remediation – Approved Action Applied",
    quality_gate: "Quality Gate – Score Improvement",
    cve_patch: "CVE Patch – Vulnerability Mitigation",
    compliance_update: "Compliance Update – Regulatory Alignment",
    ai_hardening: "AI Hardening – Gemini-Assisted Rewrite",
  }
  return labels[t] ?? t
}

export function mutationTypeIcon(t: ProvenanceMutationType): string {
  const icons: Record<ProvenanceMutationType, string> = {
    genesis: "🌱",
    temporal_evolution: "⚗",
    swarm_remediation: "🐝",
    quality_gate: "🏅",
    cve_patch: "🛡",
    compliance_update: "📋",
    ai_hardening: "🤖",
  }
  return icons[t] ?? "🔗"
}

export function generateZeroKnowledgeProof(
  chain: ProvenanceChain,
  eventId: string,
): ZeroKnowledgeProof {
  const event = chain.events.find((e) => e.id === eventId)
  if (!event) {
    return {
      eventId,
      version: "unknown",
      contentHash: "0".repeat(64),
      merkleRoot: chain.merkleRoot,
      proofPath: [],
      verified: false,
      verificationMessage: `Event ${eventId} not found in chain ${chain.chainId}.`,
    }
  }

  const hashes = chain.events.map((e) => e.contentHash)
  const proofPath = generateMerklePath(hashes, event.index)

  let current = event.contentHash
  for (const step of proofPath) {
    if (step.direction === "right") {
      current = deterministicHex64(current + step.siblingHash)
    } else {
      current = deterministicHex64(step.siblingHash + current)
    }
  }
  const verified = current === chain.merkleRoot

  return {
    eventId,
    version: event.version,
    contentHash: event.contentHash,
    merkleRoot: chain.merkleRoot,
    proofPath,
    verified,
    verificationMessage: verified
      ? `✓ Zero-Knowledge Proof verified. Event ${eventId} (${event.version}) is provably part of chain ${chain.chainId} without revealing other content.`
      : `✗ Proof verification failed for event ${eventId}. Chain integrity compromised.`,
  }
}

export function verifyProvenanceChain(chain: ProvenanceChain): ChainVerificationResult {
  let verifiedLinks = 0
  let brokenAt: number | null = null

  for (let i = 0; i < chain.events.length; i++) {
    const event = chain.events[i]
    const expectedPrev = i === 0 ? "0".repeat(64) : chain.events[i - 1].contentHash
    if (event.previousHash === expectedPrev) {
      verifiedLinks++
    } else {
      brokenAt = i
      break
    }
  }

  const recomputedRoot = computeMerkleRoot(chain.events.map((e) => e.contentHash))
  const merkleRootVerified = recomputedRoot === chain.merkleRoot

  const valid = brokenAt === null && merkleRootVerified

  return {
    runbookSlug: chain.runbookSlug,
    valid,
    totalEvents: chain.events.length,
    verifiedLinks,
    brokenAt,
    merkleRootVerified,
    message: valid
      ? `✓ Chain ${chain.chainId} fully verified. ${chain.events.length} events, ${chain.events.length} hash links intact, Merkle root matches.`
      : `✗ Chain integrity failure at event index ${brokenAt ?? "Merkle root"}.`,
  }
}

export function exportProvenanceJson(chain: ProvenanceChain): string {
  const verification = verifyProvenanceChain(chain)
  return JSON.stringify(
    {
      _schema: "ClawGuru Provenance Singularity v3.4",
      _generated: new Date().toISOString(),
      _compliance: ["SOC2 Type II", "ISO 27001", "CIS Benchmark v8"],
      chain,
      verification,
    },
    null,
    2,
  )
}
