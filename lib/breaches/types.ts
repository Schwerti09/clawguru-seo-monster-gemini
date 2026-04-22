// Shared types for the Attack Cinema (interactive breach re-enactments).
// Scenarios are pure data. The AttackTimeline component plays them back.

export type Actor = "attacker" | "victim" | "server" | "external" | "defender" | "vendor" | "public"
export type EdgeKind = "attack" | "normal" | "blocked" | "recovery"

export interface DiagramNode {
  id: string
  label: string
  sub?: string
  kind: Actor
  x: number           // 0..100, treated as percent of viewport
  y: number
}

export interface DiagramEdge {
  from: string
  to: string
  label?: string
  kind: EdgeKind
}

export interface Diagram {
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  caption?: string
}

export interface Fork {
  label: string
  outcome: string
  diagram: Diagram
  takeaway?: string
}

export interface TimelineStep {
  id: string
  time: string
  actor: Actor
  title: string
  narrative: string
  diagram: Diagram
  fork?: Fork
}

export interface Scenario {
  slug: string
  title: string
  subtitle: string
  cve?: string
  cvss?: string
  disclosed: string        // ISO date
  summary: string
  steps: TimelineStep[]
  takeaways: string[]
  references: { label: string; url: string }[]
}
