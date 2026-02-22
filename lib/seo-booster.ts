// File: lib/seo-booster.ts
// SEO Booster: Hub & Spoke linking, keyword clusters, sitemap helpers

import type { Runbook } from "./pseo"

// ---------------------------------------------------------------------------
// Hub & Spoke Internal Link Structure
// ---------------------------------------------------------------------------

export type HubSpokeMap = {
  hub: { slug: string; title: string; url: string }
  spokes: { slug: string; title: string; url: string; score: number }[]
}

/**
 * Given a list of runbooks, build a Hub & Spoke link structure.
 * Hubs = runbooks with the most inbound links (tag coverage).
 * Spokes = runbooks that link into the hub via shared tags.
 */
export function buildHubAndSpoke(
  runbooks: Runbook[],
  options: { maxHubs?: number; spokesPerHub?: number } = {}
): HubSpokeMap[] {
  const { maxHubs = 20, spokesPerHub = 8 } = options

  // Count how many runbooks share each tag
  const tagWeight = new Map<string, number>()
  for (const r of runbooks) {
    for (const t of r.tags) {
      tagWeight.set(t, (tagWeight.get(t) ?? 0) + 1)
    }
  }

  // Score each runbook as a potential hub (sum of tag weights)
  const hubScores = runbooks.map((r) => ({
    runbook: r,
    hubScore: r.tags.reduce((acc, t) => acc + (tagWeight.get(t) ?? 0), 0),
  }))

  hubScores.sort((a, b) => b.hubScore - a.hubScore)
  const hubs = hubScores.slice(0, maxHubs).map((h) => h.runbook)

  return hubs.map((hub) => {
    const spokes = runbooks
      .filter((r) => r.slug !== hub.slug && r.tags.some((t) => hub.tags.includes(t)))
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        url: `/runbook/${r.slug}`,
        score: r.clawScore,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, spokesPerHub)

    return {
      hub: { slug: hub.slug, title: hub.title, url: `/runbook/${hub.slug}` },
      spokes,
    }
  })
}

/**
 * For a single runbook, return the best internal links (hub page + top spokes).
 */
export function internalLinksForRunbook(
  runbook: Runbook,
  allRunbooks: Runbook[],
  maxLinks = 8
): { slug: string; title: string; url: string; score: number }[] {
  return allRunbooks
    .filter((r) => r.slug !== runbook.slug && r.tags.some((t) => runbook.tags.includes(t)))
    .map((r) => ({ slug: r.slug, title: r.title, url: `/runbook/${r.slug}`, score: r.clawScore }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)
}

// ---------------------------------------------------------------------------
// Keyword Cluster Generation
// ---------------------------------------------------------------------------

export type KeywordCluster = {
  pillar: string        // main keyword / topic
  lsi: string[]         // LSI / semantic variants
  questions: string[]   // long-tail question keywords
  tags: string[]        // matching runbook tags
}

const PILLAR_CLUSTERS: KeywordCluster[] = [
  {
    pillar: "SSH Hardening",
    lsi: ["SSH absichern", "SSH Key-only Login", "SSH Port ändern", "SSH Brute Force verhindern", "sshd_config hardening"],
    questions: ["Wie härte ich SSH ab?", "SSH ohne Passwort einrichten", "SSH Root Login deaktivieren", "SSH Fail2ban konfigurieren"],
    tags: ["topic:ssh-hardening", "ops", "security"],
  },
  {
    pillar: "Firewall Baseline",
    lsi: ["UFW konfigurieren", "iptables Regeln", "Firewall default deny", "Port Freigabe", "Netzwerksicherheit"],
    questions: ["Welche Ports muss ich öffnen?", "Firewall ohne Lock-out konfigurieren", "Default deny Firewall einrichten"],
    tags: ["topic:firewall-baseline", "ops", "security"],
  },
  {
    pillar: "502 Bad Gateway Fix",
    lsi: ["Nginx 502 beheben", "Upstream Fehler", "Proxy Timeout", "Backend down", "Gateway Error"],
    questions: ["Was ist ein 502 Bad Gateway?", "502 Fehler Nginx lösen", "502 in Kubernetes beheben"],
    tags: ["error:502-bad-gateway", "debug", "incident"],
  },
  {
    pillar: "API Key Rotation",
    lsi: ["API Key wechseln", "Secrets rotieren", "Key Kompromittierung", "CI/CD Secrets", "Emergency Key Rotation"],
    questions: ["Wie rotiere ich API Keys sicher?", "API Key kompromittiert – was tun?", "Zero-Downtime Key Rotation"],
    tags: ["topic:api-key-rotation", "ops", "security"],
  },
  {
    pillar: "Rate Limit",
    lsi: ["Rate Limiting einrichten", "DDoS Schutz", "429 Too Many Requests", "Edge Rate Limit", "Nginx Rate Limit"],
    questions: ["Wie richte ich Rate Limiting ein?", "429 Fehler vermeiden", "Rate Limit per IP konfigurieren"],
    tags: ["topic:rate-limit-baseline", "ops"],
  },
  {
    pillar: "WebSocket Hardening",
    lsi: ["WebSocket Origin prüfen", "WS Auth", "WebSocket 1006", "Upgrade Header", "WS Rate Limit"],
    questions: ["Wie sichere ich WebSocket-Verbindungen ab?", "WebSocket Origin Whitelist", "WebSocket 403 Forbidden beheben"],
    tags: ["topic:ws-origin-hardening", "ops", "security"],
  },
  {
    pillar: "Security Headers CSP",
    lsi: ["Content Security Policy", "HSTS Header", "X-Frame-Options", "Referrer Policy", "Security Headers testen"],
    questions: ["Welche Security Headers brauche ich?", "CSP Report-Only einrichten", "HSTS richtig konfigurieren"],
    tags: ["topic:security-headers-csp", "ops", "security"],
  },
  {
    pillar: "Kubernetes Incident",
    lsi: ["kubectl crashloopbackoff", "Pod startet nicht", "Kubernetes OOMKilled", "K8s Network Policy", "ImagePullBackOff"],
    questions: ["Pod crasht in Kubernetes – was tun?", "Kubernetes Logs auslesen", "K8s Deployment rollt nicht aus"],
    tags: ["stack:kubernetes", "incident", "debug"],
  },
  {
    pillar: "DDoS Abwehr",
    lsi: ["DDoS First Response", "Cloudflare Under Attack", "Bot Traffic blocken", "Traffic Spike", "WAF Regeln"],
    questions: ["Was tun bei DDoS-Angriff?", "Cloudflare DDoS Schutz aktivieren", "DDoS vs. Lastspitze unterscheiden"],
    tags: ["topic:ddos-first-response", "incident", "security"],
  },
  {
    pillar: "Backup Restore",
    lsi: ["Backup testen", "Recovery Drill", "Point-in-Time Recovery", "Backup verifizieren", "Disaster Recovery"],
    questions: ["Wie teste ich Backups?", "Backup Restore Drill durchführen", "Wann wurde zuletzt Backup getestet?"],
    tags: ["topic:backup-restore-drill", "ops"],
  },
]

/** Return all keyword clusters */
export function allKeywordClusters(): KeywordCluster[] {
  return PILLAR_CLUSTERS
}

/** Return the keyword cluster best matching a runbook (by tag overlap) */
export function clusterForRunbook(runbook: Runbook): KeywordCluster | null {
  let best: KeywordCluster | null = null
  let bestScore = 0
  for (const cluster of PILLAR_CLUSTERS) {
    const score = cluster.tags.filter((t) => runbook.tags.includes(t)).length
    if (score > bestScore) {
      bestScore = score
      best = cluster
    }
  }
  return best
}

// ---------------------------------------------------------------------------
// Sitemap Priority Helpers
// ---------------------------------------------------------------------------

export type SitemapEntry = {
  loc: string
  lastmod: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: string
}

/**
 * Compute enhanced sitemap priority for a runbook.
 * High-intent error/incident runbooks get higher priority.
 */
export function sitemapPriorityForRunbook(runbook: Runbook): string {
  const isIncident = runbook.tags.includes("incident")
  const isError = runbook.tags.some((t) => t.startsWith("error:"))
  const isConfig = runbook.tags.includes("config")
  const score = runbook.clawScore

  if (isIncident || isError) return score >= 85 ? "0.9" : "0.8"
  if (isConfig) return "0.7"
  return score >= 80 ? "0.8" : "0.7"
}

/** Build enriched sitemap entries for a batch of runbooks */
export function buildRunbookSitemapEntries(runbooks: Runbook[], base: string): SitemapEntry[] {
  return runbooks.map((r) => ({
    loc: `${base}/runbook/${r.slug}`,
    lastmod: r.lastmod,
    changefreq: r.tags.includes("incident") ? "weekly" : "monthly",
    priority: sitemapPriorityForRunbook(r),
  }))
}

/** Build sitemap entries for tag hub pages */
export function buildTagSitemapEntries(tags: string[], base: string, lastmod: string): SitemapEntry[] {
  return tags.map((t) => ({
    loc: `${base}/tag/${encodeURIComponent(t)}`,
    lastmod,
    changefreq: "weekly",
    priority: t.startsWith("topic:") || t.startsWith("provider:") ? "0.7" : "0.6",
  }))
}
