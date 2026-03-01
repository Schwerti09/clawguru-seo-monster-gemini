/**
 * Token Deny-List – immediate JWT / API-key revocation
 *
 * Problem: JWTs are stateless; once issued they are valid until `exp`.
 * If a token is compromised it must be invalidated before its natural expiry.
 *
 * Solution: maintain a deny-list of revoked token identifiers.
 * On every request, check whether the token's identifier appears in the list.
 * Entries are automatically evicted after their original `exp` time so the list
 * never grows unbounded.
 *
 * In production swap the in-memory Map for Redis (SETEX / SISMEMBER).
 */

interface DenyEntry {
  /** Unix timestamp (seconds) when the original token expires */
  exp: number
  /** Optional reason for revocation (for audit logging) */
  reason?: string
}

// In-memory deny-list keyed by token identifier.
// Replace with a Redis client in a multi-instance deployment:
//   await redis.setex(`deny:${id}`, ttl, "1")
const denyList = new Map<string, DenyEntry>()

/**
 * Derive a short, stable identifier from a raw token.
 * We use the last 32 chars of the base64-encoded token body to avoid storing
 * the full credential in memory.
 *
 * For HMAC tokens of the form `<body>.<sig>` we key on the signature suffix,
 * which is both unique and secret-dependent.
 */
function tokenId(token: string): string {
  const parts = token.split(".")
  // Take the last non-empty segment (signature / last part)
  const last = parts[parts.length - 1] || token
  return last.slice(-32)
}

/**
 * Add a token to the deny-list.
 *
 * @param token   The raw token string (as issued by `signAccessToken`)
 * @param exp     The token's expiry as a Unix timestamp in **seconds**
 * @param reason  Optional human-readable reason (audit trail)
 */
export function denyToken(token: string, exp: number, reason?: string): void {
  // Prune expired entries while we're here
  pruneExpired()
  denyList.set(tokenId(token), { exp, reason })
}

/**
 * Check whether a token has been revoked.
 *
 * @param token  The raw token string to check
 * @returns `true` if the token is on the deny-list (and not yet expired)
 */
export function isTokenDenied(token: string): boolean {
  const entry = denyList.get(tokenId(token))
  if (!entry) return false
  const now = Math.floor(Date.now() / 1000)
  if (entry.exp <= now) {
    // Token has naturally expired – safe to remove from list
    denyList.delete(tokenId(token))
    return false
  }
  return true
}

/**
 * Remove all tokens whose original `exp` has passed.
 * Call this periodically or on every write to keep memory bounded.
 */
export function pruneExpired(): void {
  const now = Math.floor(Date.now() / 1000)
  for (const [id, entry] of denyList) {
    if (entry.exp <= now) {
      denyList.delete(id)
    }
  }
}

/** Current size of the deny-list (for monitoring). */
export function denyListSize(): number {
  return denyList.size
}
