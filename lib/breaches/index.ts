import type { Scenario } from "./types"
import { log4shell } from "./log4shell"

// Scenario registry. More breaches to come (Okta 2023, MOVEit, SolarWinds,
// Cloudflare Supply Chain). Each scenario is pure data — the AttackTimeline
// component plays them all unchanged.
export const SCENARIOS: Record<string, Scenario> = {
  [log4shell.slug]: log4shell,
}

export interface ScenarioIndexEntry {
  slug: string
  title: string
  subtitle: string
  cve?: string
  cvss?: string
  disclosed: string
  status: "live" | "soon"
  accent: "red" | "amber" | "violet" | "cyan" | "emerald" | "pink"
}

// Ordered list for the hub. Live ones drive routes; "soon" ones are teasers.
export const SCENARIO_INDEX: ScenarioIndexEntry[] = [
  { slug: "log4shell",       title: "Log4Shell",              subtitle: "How one log line owned the internet.",     cve: "CVE-2021-44228", cvss: "10.0", disclosed: "2021-12-09", status: "live", accent: "red"     },
  { slug: "solarwinds",      title: "SolarWinds SUNBURST",    subtitle: "A signed update, a backdoor, a year.",                                                disclosed: "2020-12-13", status: "soon", accent: "amber"   },
  { slug: "okta-2023",       title: "Okta 2023",              subtitle: "Session hijack from the inside.",                                                     disclosed: "2023-10-20", status: "soon", accent: "violet"  },
  { slug: "moveit",          title: "MOVEit",                 subtitle: "Zero-day in a file transfer nobody noticed.",                                         disclosed: "2023-05-31", status: "soon", accent: "cyan"    },
  { slug: "cloudflare-supply", title: "Cloudflare Supply Chain", subtitle: "When your vendor becomes the threat.",                                             disclosed: "2023-11-23", status: "soon", accent: "emerald" },
]

export function getScenario(slug: string): Scenario | undefined {
  return SCENARIOS[slug]
}

export function listScenarioSlugs(): string[] {
  return Object.keys(SCENARIOS)
}
