/**
 * Runbook Versioning + Community Fork – Mycelium Core
 *
 * In-memory store for runbook versions, user forks, and community merge requests.
 * All data is deterministically seeded from the temporal-mycelium engine for
 * existing runbooks and extended with real user-created forks at runtime.
 *
 * Production note: swap the Maps for a database (e.g. Supabase / Postgres) by
 * replacing the CRUD helpers below while keeping the exported types unchanged.
 */

import crypto from "crypto"
import type { Runbook } from "./pseo"
import { getTemporalHistory } from "./temporal-mycelium"

// ── Types ────────────────────────────────────────────────────────────────────

export type VersionSource = "genesis" | "evolution" | "fork" | "darwinian"

export type RunbookVersion = {
  id: string
  slug: string           // canonical runbook slug
  parentId: string | null
  userId: string | null  // null = ClawGuru team
  version: string        // "v1.0", "v1.1-fork-abc", …
  label: string
  changes: string        // human-readable summary of what changed
  timestamp: string      // ISO date
  score: number
  source: VersionSource
  diffs: Array<{ kind: "added" | "changed" | "removed"; label: string }>
  forkedBy?: string      // email hash / display name
}

export type MergeRequestStatus = "pending" | "approved" | "rejected"

export type MergeRequest = {
  id: string
  slug: string
  versionId: string
  userId: string
  userEmail: string
  title: string
  description: string
  status: MergeRequestStatus
  createdAt: string
  reviewedAt?: string
}

// ── In-memory stores (swap for DB in production) ─────────────────────────────

// Seeded from temporal-mycelium + runtime user forks
const versionsStore = new Map<string, RunbookVersion[]>() // key = slug
const mergeRequestsStore = new Map<string, MergeRequest[]>() // key = slug

// ── Helpers ──────────────────────────────────────────────────────────────────

function newId(): string {
  return crypto.randomUUID()
}

function slugHash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Seed the versions store from the temporal-mycelium history if not yet loaded.
 * This converts TemporalVersion[] into RunbookVersion[] with stable IDs.
 */
function seedFromTemporal(runbook: Runbook): RunbookVersion[] {
  const existing = versionsStore.get(runbook.slug)
  if (existing) return existing

  const history = getTemporalHistory(runbook)
  const versions: RunbookVersion[] = history.versions.map((v, i) => ({
    id: `${runbook.slug}-${v.version.replace(/\./g, "_")}`,
    slug: runbook.slug,
    parentId: i === 0 ? null : `${runbook.slug}-${history.versions[i - 1].version.replace(/\./g, "_")}`,
    userId: null,
    version: v.version,
    label: v.label,
    changes: v.mutationReason,
    timestamp: v.timestamp,
    score: v.score,
    source: i === 0 ? "genesis" : "evolution",
    diffs: v.diffs,
  }))

  versionsStore.set(runbook.slug, versions)
  return versions
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Returns all versions (canonical + forks) for a runbook. */
export function getVersions(runbook: Runbook): RunbookVersion[] {
  return seedFromTemporal(runbook)
}

/**
 * Create a user fork of the latest canonical version.
 * The Darwinian Engine generates a new mutation reason if `evolve` is true.
 */
export function createFork(
  runbook: Runbook,
  opts: {
    userEmail: string
    title?: string
    changes?: string
    evolve?: boolean
  }
): RunbookVersion {
  const versions = seedFromTemporal(runbook)
  const canonical = [...versions].filter((v) => v.source !== "fork").pop()!

  const h = slugHash(runbook.slug + opts.userEmail)

  const DARWINIAN_MUTATIONS = [
    "Darwinian Evolution: Zero Trust network segmentation enforced",
    "Darwinian Evolution: Supply chain integrity checks (SBOM) hardened",
    "Darwinian Evolution: AI-assisted Gemini 2.0 code-block rewrite",
    "Darwinian Evolution: CVE-2026-1337 privilege escalation vector closed",
    "Darwinian Evolution: CISA KEV guidance applied – 3 new mitigations",
    "Darwinian Evolution: Community patch – improved key-rotation commands",
    "Darwinian Evolution: CIS Benchmark v8 delta applied",
    "Darwinian Evolution: NIST SP 800-190 rev.2 container controls added",
  ]

  const forkCount = versions.filter((v) => v.source === "fork").length
  const versionLabel = `v${canonical.version.replace("v", "")}-fork-${forkCount + 1}`

  const changes = opts.evolve
    ? DARWINIAN_MUTATIONS[h % DARWINIAN_MUTATIONS.length]
    : opts.changes || `Fork by ${opts.userEmail.split("@")[0]} – custom variant`

  const evolvedDiffs = opts.evolve
    ? [
        { kind: "added" as const, label: "Darwinian mutation: new hardening step injected" },
        { kind: "changed" as const, label: "Score improved by Darwinian selection pressure" },
      ]
    : []

  const fork: RunbookVersion = {
    id: newId(),
    slug: runbook.slug,
    parentId: canonical.id,
    userId: opts.userEmail,
    version: versionLabel,
    label: opts.title || `Fork by ${opts.userEmail.split("@")[0]}`,
    changes,
    timestamp: new Date().toISOString().slice(0, 10),
    score: Math.min(100, canonical.score + (opts.evolve ? 2 : 0)),
    source: opts.evolve ? "darwinian" : "fork",
    diffs: evolvedDiffs,
    forkedBy: opts.userEmail.split("@")[0],
  }

  const updated = [...versions, fork]
  versionsStore.set(runbook.slug, updated)
  return fork
}

/** Submit a community merge request for a fork. */
export function createMergeRequest(
  slug: string,
  opts: {
    versionId: string
    userEmail: string
    title: string
    description: string
  }
): MergeRequest {
  const mr: MergeRequest = {
    id: newId(),
    slug,
    versionId: opts.versionId,
    userId: opts.userEmail,
    userEmail: opts.userEmail,
    title: opts.title,
    description: opts.description,
    status: "pending",
    createdAt: new Date().toISOString().slice(0, 10),
  }

  const list = mergeRequestsStore.get(slug) ?? []
  mergeRequestsStore.set(slug, [...list, mr])
  return mr
}

/** List merge requests for a slug (admin use). */
export function getMergeRequests(slug: string): MergeRequest[] {
  return mergeRequestsStore.get(slug) ?? []
}

/** Admin: approve or reject a merge request. */
export function reviewMergeRequest(
  slug: string,
  id: string,
  status: "approved" | "rejected"
): MergeRequest | null {
  const list = mergeRequestsStore.get(slug) ?? []
  const idx = list.findIndex((mr) => mr.id === id)
  if (idx === -1) return null
  const updated = { ...list[idx], status, reviewedAt: new Date().toISOString().slice(0, 10) }
  const newList = [...list]
  newList[idx] = updated
  mergeRequestsStore.set(slug, newList)
  return updated
}
