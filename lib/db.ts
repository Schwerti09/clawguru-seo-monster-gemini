// @neondatabase/serverless is a drop-in replacement for `pg` that works on
// both Node.js (Vercel/Netlify) and Cloudflare Workers (nodejs_compat_v2).
// It uses WebSockets to connect to Neon's serverless PostgreSQL endpoint.
//
// Pool topology: primary (DATABASE_URL) + optional secondary (DATABASE_URL_2).
// On connection / quota / auth failures against primary we lazily fail over
// to the secondary for the remainder of the process. Transient errors on the
// query itself (syntax, constraint) do NOT trigger failover — they bubble up
// like normal.
import { Pool, PoolClient, QueryResult, QueryResultRow } from "@neondatabase/serverless"

declare global {
  // eslint-disable-next-line no-var
  var __claw_db_pool_primary: Pool | undefined
  // eslint-disable-next-line no-var
  var __claw_db_pool_secondary: Pool | undefined
  // eslint-disable-next-line no-var
  var __claw_db_primary_disabled: boolean | undefined
}

function cleanUrl(raw: string): string {
  const url = new URL(raw)
  // Strip sslmode from the connection string — neon/serverless handles SSL
  // internally; explicit sslmode params can cause connection warnings.
  url.searchParams.delete("sslmode")
  return url.toString()
}

function makePool(connectionString: string): Pool {
  return new Pool({
    connectionString: cleanUrl(connectionString),
    // Keep the pool small: serverless functions are short-lived and Neon's
    // connection limit is shared across concurrent invocations.
    max: 3,
    idleTimeoutMillis: 30_000,
    // Allow enough time for Neon cold-starts, especially across regions.
    connectionTimeoutMillis: 30_000,
  })
}

function getPrimary(): Pool | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return undefined
  if (!global.__claw_db_pool_primary) global.__claw_db_pool_primary = makePool(url)
  return global.__claw_db_pool_primary
}

function getSecondary(): Pool | undefined {
  const url = process.env.DATABASE_URL_2
  if (!url) return undefined
  if (!global.__claw_db_pool_secondary) global.__claw_db_pool_secondary = makePool(url)
  return global.__claw_db_pool_secondary
}

/** Legacy accessor — returns whichever pool is currently the primary target. */
export function getPool(): Pool {
  if (!global.__claw_db_primary_disabled) {
    const p = getPrimary()
    if (p) return p
  }
  const s = getSecondary()
  if (s) return s
  throw new Error("No database URL configured (DATABASE_URL / DATABASE_URL_2).")
}

// Match common quota / availability patterns in the error message even when
// the server returns a valid Postgres error code (Neon wraps quota errors as
// XX000 / internal_error, which would otherwise pass the classifier).
const QUOTA_PATTERNS = [
  /compute[- _]?time/i,
  /quota\s*(exceeded|exhausted)/i,
  /limit\s*(exceeded|reached)/i,
  /plan.*(exceed|limit|upgrade)/i,
  /connection.*rejected|refused/i,
  /too\s*many\s*connections/i,
]

// Postgres error codes that mean "the server is unhealthy, not your query":
// XX000 is Neon's quota-exceeded code, 53300 is too_many_connections, 57P*
// is admin-shutdown/crash/cancel. All safe to fail over.
const RETRYABLE_CODES = new Set(["XX000", "53300", "57P01", "57P02", "57P03"])

function shouldFailover(err: unknown): boolean {
  if (!err || typeof err !== "object") return true
  const e = err as { code?: string; message?: string }
  const code = e.code
  const msg = typeof e.message === "string" ? e.message : ""
  // Always failover on our explicit retryable Postgres codes.
  if (typeof code === "string" && RETRYABLE_CODES.has(code)) return true
  // Always failover on quota / availability phrases, regardless of code.
  if (msg && QUOTA_PATTERNS.some((p) => p.test(msg))) return true
  // Standard-shaped Postgres error code (5-char alphanumeric) = real SQL
  // error; don't mask it.
  if (typeof code === "string" && /^[A-Z0-9]{5}$/.test(code)) return false
  // No code, or ECONN*, ETIMEDOUT, WebSocket errors, fetch errors → failover.
  return true
}

export async function dbQuery<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  // First attempt: primary if not disabled, else secondary.
  if (!global.__claw_db_primary_disabled) {
    const primary = getPrimary()
    if (primary) {
      try {
        return await primary.query<T>(text, params)
      } catch (e) {
        if (!shouldFailover(e)) throw e
        const secondary = getSecondary()
        if (!secondary) throw e
        // Mark primary dead for this process so we don't retry it every query.
        global.__claw_db_primary_disabled = true
        console.warn(
          "[db] primary pool failed, failing over to DATABASE_URL_2 for the rest of this process:",
          (e as { message?: string }).message || e,
        )
        return secondary.query<T>(text, params)
      }
    }
  }
  const secondary = getSecondary()
  if (!secondary) throw new Error("No database URL configured (DATABASE_URL / DATABASE_URL_2).")
  return secondary.query<T>(text, params)
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}
