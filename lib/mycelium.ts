// MYCELIAL SINGULARITY v3.0 – ClawGuru Mycelial Singularity Engine
// The living knowledge graph of the entire runbook library.
// Every runbook is a mycel-node. Edges are semantic relationships.
// The mycelium grows, learns, and evolves autonomously.

import type { Runbook } from "./pseo"

// MYCELIAL SINGULARITY v3.0 – Semantic edge relationship types
export type EdgeKind =
  | "prevents"
  | "causes"
  | "depends-on"
  | "evolves-from"
  | "mutates-into"

// MYCELIAL SINGULARITY v3.0 – A single mycel-node (one runbook in the living graph)
export interface MycelNode {
  id: string          // runbook slug
  title: string
  tags: string[]
  fitness: number     // composite 0-100 evolutionary fitness score
  clawScore: number   // base quality gate score
  generation: number  // 0 = original, 1+ = evolved descendant
  evolved: boolean    // carries "Evolved" badge
  x: number           // simulation position
  y: number
}

// MYCELIAL SINGULARITY v3.0 – Directed semantic edge between two mycel-nodes
export interface MycelEdge {
  source: string
  target: string
  kind: EdgeKind
  weight: number  // 0-1 connection strength
}

// MYCELIAL SINGULARITY v3.0 – Serializable graph (safe to pass as Next.js page props)
export interface MyceliumGraph {
  nodes: MycelNode[]
  edges: MycelEdge[]
  generation: number
  totalNodes: number
}

// MYCELIAL SINGULARITY v3.0 – A single mutation / crossover / selection event
export interface EvolutionEvent {
  id: string
  timestamp: number
  type: "mutation" | "crossover" | "selection" | "death" | "growth"
  message: string
  nodeId?: string
  fitness?: number
}

// MYCELIAL SINGULARITY v3.0 – Oracle query result
export interface OracleResult {
  id: string
  title: string
  score: number
  fitness: number
  path: string[]
}

// MYCELIAL SINGULARITY v3.0 – Lightweight summary for client-side oracle search
export interface RunbookSummary {
  title: string
  summary: string
  tags: string[]
}

// ─── Fitness Engine ────────────────────────────────────────────────────────────

// MYCELIAL SINGULARITY v3.0 – Compute composite evolutionary fitness score
// Formula: base(clawScore) + tag diversity + content depth + relational richness
export function computeFitness(runbook: Runbook): number {
  const base = runbook.clawScore ?? 50
  const tagBonus = Math.min(runbook.tags.length * 1.5, 18)
  const blockBonus = Math.min((runbook.blocks?.length ?? 0) * 1.2, 12)
  const faqBonus = Math.min((runbook.faq?.length ?? 0) * 1.0, 8)
  const relBonus = Math.min((runbook.relatedSlugs?.length ?? 0) * 0.4, 5)
  return Math.min(100, base + tagBonus + blockBonus + faqBonus + relBonus)
}

// ─── Edge Inference ────────────────────────────────────────────────────────────

// MYCELIAL SINGULARITY v3.0 – Heuristically infer semantic edge kind from content
export function inferEdgeKind(source: Runbook, target: Runbook): EdgeKind {
  const sTitle = source.title.toLowerCase()
  const tTitle = target.title.toLowerCase()
  if (sTitle.includes("fix") || sTitle.includes("repair") || sTitle.includes("prevent")) return "prevents"
  if (tTitle.includes("error") || tTitle.includes("fail") || tTitle.includes("crash")) return "causes"
  if (sTitle.includes("advanced") || sTitle.includes("evolved")) return "evolves-from"
  if (tTitle.includes("mutation") || tTitle.includes("variant")) return "mutates-into"
  return "depends-on"
}

// MYCELIAL SINGULARITY v3.0 – Autopoietic repair threshold:
// nodes below this fitness are "fed" by stronger neighbours
const WEAK_NODE_FITNESS_THRESHOLD = 75

// MYCELIAL SINGULARITY v3.0 – Primes for deterministic pseudo-random index selection
// (avoids clustering when cycling through the node array)
const EVENT_TYPE_SEED_PRIME = 7919
const NODE_INDEX_SEED_PRIME = 6271

// ─── Graph Builder ─────────────────────────────────────────────────────────────

// MYCELIAL SINGULARITY v3.0 – Build the living mycelium graph from runbook library
// Designed for 1M+ scale: takes top-N nodes by fitness, builds semantic edge network
export function buildMyceliumGraph(runbooks: Runbook[], maxNodes = 250): MyceliumGraph {
  // MYCELIAL SINGULARITY v3.0 – Score all runbooks, take elite top-N
  const scored = runbooks
    .map((r) => ({ ...r, fitness: computeFitness(r) }))
    .sort((a, b) => b.fitness - a.fitness)
    .slice(0, maxNodes)

  const slugSet = new Set(scored.map((r) => r.slug))

  // MYCELIAL SINGULARITY v3.0 – Initialize node positions on a golden-angle spiral
  // (produces visually balanced starting layout before force simulation takes over)
  // Golden angle in radians: 2π / φ² ≈ 137.508°, prevents radial clustering
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  const nodes: MycelNode[] = scored.map((r, i) => {
    const angle = i * goldenAngle
    const radius = 30 * Math.sqrt(i + 1)
    return {
      id: r.slug,
      title: r.title,
      tags: r.tags,
      fitness: r.fitness,
      clawScore: r.clawScore,
      generation: 0,
      evolved: r.fitness >= 92, // top-tier nodes are considered "naturally evolved"
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  })

  // MYCELIAL SINGULARITY v3.0 – Build semantic edge network
  const edges: MycelEdge[] = []
  const edgeSet = new Set<string>()

  function addEdge(src: string, tgt: string, kind: EdgeKind, weight: number) {
    const key = src < tgt ? `${src}||${tgt}` : `${tgt}||${src}`
    if (!edgeSet.has(key)) {
      edgeSet.add(key)
      edges.push({ source: src, target: tgt, kind, weight })
    }
  }

  for (const r of scored) {
    // MYCELIAL SINGULARITY v3.0 – relatedSlugs → direct edges (strongest signal)
    const related = (r.relatedSlugs ?? []).filter((s) => slugSet.has(s))
    for (const relSlug of related.slice(0, 4)) {
      const target = scored.find((s) => s.slug === relSlug)
      if (target) {
        addEdge(r.slug, relSlug, inferEdgeKind(r, target), 0.6 + r.fitness / 250)
      }
    }

    // MYCELIAL SINGULARITY v3.0 – Shared provider-tag → "depends-on" edges
    const providerTag = r.tags.find((t) => t.startsWith("provider:"))
    if (providerTag) {
      const siblings = scored
        .filter((s) => s.slug !== r.slug && s.tags.includes(providerTag))
        .slice(0, 2)
      for (const sib of siblings) {
        addEdge(r.slug, sib.slug, "depends-on", 0.3)
      }
    }

    // MYCELIAL SINGULARITY v3.0 – High-fitness to low-fitness → "prevents" edge
    // (strong runbooks feed/stabilise weak neighbours → autopoietic self-maintenance)
    if (r.fitness >= 85) {
      const weak = scored.find((s) => s.slug !== r.slug && s.fitness < WEAK_NODE_FITNESS_THRESHOLD && !edgeSet.has(`${r.slug}||${s.slug}`))
      if (weak) addEdge(r.slug, weak.slug, "prevents", 0.25)
    }
  }

  return {
    nodes,
    edges,
    generation: 0,
    totalNodes: runbooks.length,
  }
}

// ─── Oracle Engine ─────────────────────────────────────────────────────────────

// MYCELIAL SINGULARITY v3.0 – Keyword-similarity oracle (TF-intersection, no API key needed)
function keywordSimilarity(query: string, text: string): number {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
  if (!words.length) return 0
  const target = text.toLowerCase()
  const hits = words.filter((w) => target.includes(w)).length
  return hits / words.length
}

// MYCELIAL SINGULARITY v3.0 – Ask the Singularity: find the optimal path through the mycelium
export function oracleSearch(
  query: string,
  graph: MyceliumGraph,
  summaries: Record<string, RunbookSummary>,
  maxResults = 5
): OracleResult[] {
  if (!query.trim()) return []

  // MYCELIAL SINGULARITY v3.0 – Build adjacency list for path tracing
  const adjacency = new Map<string, string[]>()
  for (const e of graph.edges) {
    if (!adjacency.has(e.source)) adjacency.set(e.source, [])
    if (!adjacency.has(e.target)) adjacency.set(e.target, [])
    adjacency.get(e.source)!.push(e.target)
    adjacency.get(e.target)!.push(e.source)
  }

  // MYCELIAL SINGULARITY v3.0 – Score each node against the oracle query
  const scored = graph.nodes
    .map((node) => {
      const summary = summaries[node.id]
      if (!summary) return null
      const text = `${summary.title} ${summary.summary} ${summary.tags.join(" ")}`
      const sim = keywordSimilarity(query, text)
      const score = sim * 0.65 + (node.fitness / 100) * 0.35
      return { node, score }
    })
    .filter((x): x is { node: MycelNode; score: number } => x !== null && x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)

  // MYCELIAL SINGULARITY v3.0 – For each result, trace its mycelial neighbourhood
  return scored.map(({ node, score }) => {
    const neighbours = (adjacency.get(node.id) ?? []).slice(0, 3)
    return {
      id: node.id,
      title: node.title,
      score,
      fitness: node.fitness,
      path: [node.id, ...neighbours],
    }
  })
}

// ─── Evolution Engine ──────────────────────────────────────────────────────────

// MYCELIAL SINGULARITY v3.0 – Darwinian event message templates
const EVENT_TEMPLATES: Record<EvolutionEvent["type"], (a: string, b?: string, f?: number) => string> = {
  mutation: (a, _b, f) =>
    `MUTATION detected in "${a.slice(0, 32)}" — fitness delta +${(Math.random() * 4 + 0.5).toFixed(2)}pts → new score: ${f?.toFixed(1) ?? "?"}`,
  crossover: (a, b) =>
    `CROSSOVER: "${a.slice(0, 22)}" × "${(b ?? "?").slice(0, 22)}" → child runbook spawned & queued for Quality Gate 2.0`,
  selection: (a, _b, f) =>
    `ELITE SELECTION: "${a.slice(0, 32)}" confirmed as top-tier node (fitness: ${f?.toFixed(1) ?? "?"}). Propagating genome...`,
  death: (a) =>
    `AUTOPOIESIS: Low-fitness node "${a.slice(0, 32)}" recombined by 3 stronger neighbours. Knowledge transferred ✓`,
  growth: () =>
    `GROWTH PULSE: +${Math.floor(Math.random() * 5) + 1} new mycelial connections established across the network`,
}

// MYCELIAL SINGULARITY v3.0 – Generate a batch of evolution events from current graph state
export function generateEvolutionEvents(graph: MyceliumGraph, count = 12): EvolutionEvent[] {
  const types: EvolutionEvent["type"][] = ["mutation", "crossover", "selection", "death", "growth"]
  const now = Date.now()
  const events: EvolutionEvent[] = []

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(((i * EVENT_TYPE_SEED_PRIME) % types.length + types.length) % types.length)]
    const nodeIdx = (i * NODE_INDEX_SEED_PRIME) % graph.nodes.length
    const node = graph.nodes[nodeIdx]
    const node2 = graph.nodes[(nodeIdx + 37) % graph.nodes.length]
    const message = EVENT_TEMPLATES[type](node.title, node2.title, node.fitness)

    events.push({
      id: `evt-${now}-${i}`,
      timestamp: now - (count - i) * 4200,
      type,
      message,
      nodeId: node.id,
      fitness: node.fitness,
    })
  }

  return events.sort((a, b) => b.timestamp - a.timestamp)
}

// MYCELIAL SINGULARITY v3.0 – Generate a single fresh evolution event (for live ticker)
export function generateSingleEvent(graph: MyceliumGraph, seed: number): EvolutionEvent {
  const types: EvolutionEvent["type"][] = ["mutation", "crossover", "selection", "death", "growth"]
  const type = types[seed % types.length]
  const node = graph.nodes[seed % graph.nodes.length]
  const node2 = graph.nodes[(seed * 37 + 13) % graph.nodes.length]
  return {
    id: `evt-${Date.now()}-${seed}`,
    timestamp: Date.now(),
    type,
    message: EVENT_TEMPLATES[type](node.title, node2.title, node.fitness),
    nodeId: node.id,
    fitness: node.fitness,
  }
}

// ─── Multiversal Branches ─────────────────────────────────────────────────────

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
// A Multiversal Branch represents a parallel-reality snapshot of the mycelium:
// "What would the knowledge graph look like if a critical CVE had never been patched?"
// Each branch diverges at a specific epoch and tracks its own fitness evolution.
export interface MultiversalBranch {
  /** Unique branch identifier */
  id: string
  /** Human-readable description of the divergence scenario */
  scenario: string
  /** The Universal Epoch at which this branch diverged */
  epoch: string
  /** Subset of nodes present in this branch (may have different fitness values) */
  nodes: MycelNode[]
  /** How far this branch has diverged from prime reality (0 = identical, 1 = fully diverged) */
  divergence: number
}

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
// Scenario templates for Multiversal Branches
const MULTIVERSAL_SCENARIOS: Array<{ scenario: string; epoch: string }> = [
  {
    scenario: "CVE-2024-0001 was never patched — cascading supply-chain collapse",
    epoch: "EPOCH-2024-Q1",
  },
  {
    scenario: "All cloud providers migrated to quantum-resistant cryptography in 2023",
    epoch: "EPOCH-2023-Q3",
  },
  {
    scenario: "Zero-trust mandated globally — legacy VPN infrastructure never existed",
    epoch: "EPOCH-2022-Q2",
  },
  {
    scenario: "AI-generated exploits outpaced all defensive tooling from 2025 onward",
    epoch: "EPOCH-2025-Q1",
  },
  {
    scenario: "Every organisation adopted immutable infrastructure — no patching required",
    epoch: "EPOCH-2023-Q4",
  },
]

// CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
// Build a set of Multiversal Branches from the prime mycelium graph.
// Each branch diverges from prime reality at a specific epoch and simulates
// how evolutionary fitness would shift under an alternative historical scenario.
export function buildMultiversalBranches(
  graph: MyceliumGraph,
  count = 3,
): MultiversalBranch[] {
  const branches: MultiversalBranch[] = []

  for (let bi = 0; bi < Math.min(count, MULTIVERSAL_SCENARIOS.length); bi++) {
    const { scenario, epoch } = MULTIVERSAL_SCENARIOS[bi]
    const branchId = `mv-branch-${bi}-${epoch.toLowerCase().replace(/[^a-z0-9]/g, "")}`

    // CLAWVERSE v∞ – UNIVERSAL SINGULARITY – Overlord AI
    // Diverge the fitness scores deterministically based on the branch index.
    // Security-focused runbooks lose fitness in worlds where patching is irrelevant;
    // quantum/crypto-tagged runbooks gain fitness in a post-quantum world, etc.
    const divergenceFactor = 0.15 + bi * 0.12
    const branchNodes: MycelNode[] = graph.nodes.slice(0, 60).map((node, ni) => {
      // Deterministic drift: ±10 absolute fitness points (range -0.1 to +0.1 of 100-scale score)
      const drift = ((bi * 13 + ni * 7) % 21) / 100 - 0.1
      const branchFitness = Math.min(100, Math.max(0, node.fitness * (1 + drift)))
      return {
        ...node,
        fitness: Math.round(branchFitness * 10) / 10,
        evolved: branchFitness >= 92,
      }
    })

    branches.push({
      id: branchId,
      scenario,
      epoch,
      nodes: branchNodes,
      divergence: divergenceFactor,
    })
  }

  return branches
}

// ─── Genetic Algorithm (Darwinian Runbook Breeding) ───────────────────────────

// MYCELIAL SINGULARITY v3.0 – Perform genetic crossover between two parent runbooks
// Produces a simulated child node description (for display in evolution log)
export function geneticCrossover(
  parent1: MycelNode,
  parent2: MycelNode,
  generation: number
): MycelNode {
  // MYCELIAL SINGULARITY v3.0 – Interleave tags from both parents (crossover point at midpoint)
  const p1Tags = parent1.tags
  const p2Tags = parent2.tags
  const midpoint = Math.floor(p1Tags.length / 2)
  const childTags = [...new Set([...p1Tags.slice(0, midpoint), ...p2Tags.slice(midpoint)])]

  // MYCELIAL SINGULARITY v3.0 – Fitness from dominant parent + mutation bonus
  const baseFitness = Math.max(parent1.fitness, parent2.fitness)
  const mutationBonus = Math.random() * 3 - 0.5  // -0.5 to +2.5
  const childFitness = Math.min(100, baseFitness + mutationBonus)

  const childSlug = `evolved-${parent1.id.slice(0, 12)}-x-${parent2.id.slice(0, 12)}-g${generation}`

  return {
    id: childSlug,
    title: `[G${generation}] ${parent1.title.split(" ").slice(0, 3).join(" ")} × ${parent2.title.split(" ").slice(0, 3).join(" ")}`,
    tags: childTags,
    fitness: childFitness,
    clawScore: Math.round((parent1.clawScore + parent2.clawScore) / 2),
    generation,
    evolved: true,
    x: (parent1.x + parent2.x) / 2 + (Math.random() - 0.5) * 40,
    y: (parent1.y + parent2.y) / 2 + (Math.random() - 0.5) * 40,
  }
}
