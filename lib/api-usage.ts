// lib/api-usage.ts
// In-memory API usage tracker.
// In production, replace the Map stores with Redis (e.g. INCR / ZINCRBY) for persistence
// and multi-instance correctness. Keys are kept intentionally simple so a Redis migration
// is a straight drop-in replacement.

type EndpointCounts = Record<string, number>
type IpCounts = Record<string, number>

// Global in-process stores (reset on cold-start – acceptable for a dashboard prototype;
// wire up Redis for production durability).
const endpointHits: EndpointCounts = {}
const ipHits: IpCounts = {}
const blockedIps: Map<string, number> = new Map() // ip → unblock-at (unix ms)

/** Record one API call for an endpoint, optionally keyed by client IP. */
export function recordApiCall(endpoint: string, ip?: string) {
  endpointHits[endpoint] = (endpointHits[endpoint] ?? 0) + 1
  if (ip) {
    ipHits[ip] = (ipHits[ip] ?? 0) + 1
  }
}

/** Return a snapshot of endpoint hit-counts. */
export function getEndpointCounts(): EndpointCounts {
  return { ...endpointHits }
}

/** Return the top-N IPs by request count (descending). */
export function getTopIps(n = 10): Array<{ ip: string; count: number; blocked: boolean }> {
  const now = Date.now()
  return Object.entries(ipHits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([ip, count]) => {
      const unblockAt = blockedIps.get(ip) ?? 0
      return { ip, count, blocked: unblockAt > now }
    })
}

/** Block an IP for the given duration (default 24 h). Returns true on success. */
export function blockIp(ip: string, durationMs = 24 * 60 * 60 * 1000): boolean {
  if (!ip || ip.length > 64) return false
  blockedIps.set(ip, Date.now() + durationMs)
  return true
}

/** Return true if the IP is currently blocked. */
export function isIpBlocked(ip: string): boolean {
  const unblockAt = blockedIps.get(ip)
  if (!unblockAt) return false
  if (Date.now() >= unblockAt) {
    blockedIps.delete(ip)
    return false
  }
  return true
}

/** Return all currently active blocks as an array. */
export function getActiveBlocks(): Array<{ ip: string; unblockAt: number }> {
  const now = Date.now()
  const result: Array<{ ip: string; unblockAt: number }> = []
  for (const [ip, unblockAt] of blockedIps.entries()) {
    if (unblockAt > now) result.push({ ip, unblockAt })
    else blockedIps.delete(ip)
  }
  return result
}
