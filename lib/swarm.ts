// SWARM DEPLOYMENT v3.2 – Overlord AI
// Deterministic swarm simulation engine for ClawGuru SWARM DEPLOYMENT feature.
// Generates stable, reproducible swarm state from deployment ID and runbook slug.
// No real infrastructure is modified – this is a simulation/demo layer.

// SWARM DEPLOYMENT v3.2 – Overlord AI: Supported target environments
export type TargetEnvironment =
  | "kubernetes"
  | "aws"
  | "gcp"
  | "azure"
  | "on-prem"
  | "hetzner"

// SWARM DEPLOYMENT v3.2 – Overlord AI: Agent count bounds (used in UI and simulation)
export const SWARM_AGENT_MIN = 50
export const SWARM_AGENT_MAX = 500

// SWARM DEPLOYMENT v3.2 – Overlord AI: Individual micro-agent state
export interface SwarmAgent {
  id: string
  status: "active" | "healing" | "idle" | "lost"
  zone: string
  lastSeenMs: number
  healEvents: number
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: A single self-healing event
export interface SwarmHealEvent {
  id: string
  timestampMs: number
  agentId: string
  zone: string
  issue: string
  resolution: string
  severity: "critical" | "high" | "medium" | "low"
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Full deployment snapshot
export interface SwarmDeployment {
  deploymentId: string
  runbookSlug: string
  target: TargetEnvironment
  totalAgents: number
  activeAgents: number
  healEventsThisHour: number
  startedAt: string
  zones: string[]
  agents: SwarmAgent[]
  recentHealEvents: SwarmHealEvent[]
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Simple deterministic string hash
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Zone names per environment
const ZONES: Record<TargetEnvironment, string[]> = {
  kubernetes: ["kube-north-1a", "kube-north-1b", "kube-south-2a", "kube-south-2b", "kube-edge-3a"],
  aws: ["us-east-1a", "us-east-1b", "us-west-2a", "eu-west-1a", "ap-southeast-1a"],
  gcp: ["us-central1-a", "us-central1-b", "europe-west1-b", "asia-east1-a", "us-east1-c"],
  azure: ["eastus-1", "eastus-2", "westeurope-1", "southeastasia-1", "uksouth-1"],
  "on-prem": ["rack-A-01", "rack-A-02", "rack-B-01", "rack-B-02", "dmz-edge-01"],
  hetzner: ["fsn1-dc14", "nbg1-dc3", "hel1-dc2", "ash-dc1", "sin-dc1"],
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Realistic heal issue templates
const HEAL_ISSUES = [
  { issue: "nginx rate-limit threshold exceeded", resolution: "Dynamic backoff applied – rate-limit reset" },
  { issue: "TLS certificate expiring in 48h", resolution: "Cert auto-renewed via ACME – 90d extension" },
  { issue: "Memory pressure on pod detected (>85%)", resolution: "Container OOM risk mitigated – limits adjusted" },
  { issue: "SSH brute-force detected from 185.x.x.x", resolution: "IP blocked via iptables DROP rule" },
  { issue: "Kubernetes RBAC misconfiguration found", resolution: "Least-privilege role binding enforced" },
  { issue: "Docker socket exposed to untrusted container", resolution: "Socket mount revoked – container restarted" },
  { issue: "CIS Benchmark deviation: world-writable /tmp", resolution: "Permissions hardened to 1777" },
  { issue: "Unencrypted etcd endpoint exposed", resolution: "mTLS enforced – etcd peers re-validated" },
  { issue: "S3 bucket policy allows public read", resolution: "Block Public Access re-applied" },
  { issue: "Log4j pattern detected in JVM args", resolution: "JVM args sanitised – CVE-2021-44228 mitigated" },
]

// SWARM DEPLOYMENT v3.2 – Overlord AI: Derive target environment from deployment ID
export function deriveTarget(deploymentId: string): TargetEnvironment {
  const targets: TargetEnvironment[] = ["kubernetes", "aws", "gcp", "azure", "on-prem", "hetzner"]
  return targets[hashStr(deploymentId) % targets.length]
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Generate a fully deterministic swarm deployment snapshot.
// This is simulation data – no real infrastructure access occurs.
export function generateSwarmDeployment(
  deploymentId: string,
  runbookSlug: string,
): SwarmDeployment {
  const h = hashStr(deploymentId + runbookSlug)

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Derive stable counts from hash
  const totalAgents = SWARM_AGENT_MIN + (h % (SWARM_AGENT_MAX - SWARM_AGENT_MIN + 1)) // SWARM_AGENT_MIN–SWARM_AGENT_MAX agents
  const lostAgents = Math.floor(totalAgents * 0.02) // ~2% lost
  const healingAgents = Math.floor(totalAgents * 0.05) // ~5% healing
  const activeAgents = totalAgents - lostAgents - healingAgents
  const healEventsThisHour = 5 + (h % 60)

  const target = deriveTarget(deploymentId)
  const zones = ZONES[target]

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Build deterministic agent list (sample of 20 for UI)
  const agents: SwarmAgent[] = Array.from({ length: Math.min(totalAgents, 20) }, (_, i) => {
    const ah = hashStr(`${deploymentId}-agent-${i}`)
    const statusSeed = ah % 20
    const status: SwarmAgent["status"] =
      statusSeed === 0 ? "lost"
      : statusSeed <= 1 ? "healing"
      : statusSeed <= 4 ? "idle"
      : "active"
    return {
      id: `agent-${deploymentId.slice(-6)}-${i.toString().padStart(3, "0")}`,
      status,
      zone: zones[ah % zones.length],
      lastSeenMs: Date.now() - (ah % 30_000),
      healEvents: ah % 8,
    }
  })

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Build deterministic heal event log (last 8 events)
  const recentHealEvents: SwarmHealEvent[] = Array.from({ length: 8 }, (_, i) => {
    const eh = hashStr(`${deploymentId}-event-${i}`)
    const template = HEAL_ISSUES[eh % HEAL_ISSUES.length]
    const severities: SwarmHealEvent["severity"][] = ["critical", "high", "medium", "low"]
    return {
      id: `evt-${deploymentId.slice(-6)}-${i}`,
      timestampMs: Date.now() - (i * 7 * 60_000) - (eh % 120_000),
      agentId: `agent-${deploymentId.slice(-6)}-${String(eh % Math.min(totalAgents, 20)).padStart(3, "0")}`,
      zone: zones[eh % zones.length],
      issue: template.issue,
      resolution: template.resolution,
      severity: severities[eh % severities.length],
    }
  }).sort((a, b) => b.timestampMs - a.timestampMs)

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Stable start time (derived from hash, within last 6h)
  const startedMsAgo = (h % (6 * 60)) * 60_000
  const startedAt = new Date(Date.now() - startedMsAgo).toISOString()

  return {
    deploymentId,
    runbookSlug,
    target,
    totalAgents,
    activeAgents,
    healEventsThisHour,
    startedAt,
    zones,
    agents,
    recentHealEvents,
  }
}

// SWARM DEPLOYMENT v3.2 – Overlord AI: Generate a stable, shareable deployment ID from a runbook slug.
// Uses only the slug hash so the same runbook always maps to the same deployment link.
export function makeDeploymentId(slug: string): string {
  const h = hashStr(slug)
  return `sw-${slug.slice(0, 12).replace(/[^a-z0-9]/g, "")}-${h.toString(36).slice(0, 8)}`
}
