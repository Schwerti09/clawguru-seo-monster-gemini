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

// Neon throws very noisy WebSocket errors for connection / quota issues. We
// classify any error that is NOT a clean Postgres error (missing code field)
// as a connection problem and allow failover.
function shouldFailover(err: unknown): boolean {
  if (!err || typeof err !== "object") return true
  const code = (err as { code?: string }).code
  // Postgres error codes are 5-char strings (e.g. "23505", "42P01"). Anything
  // else — ECONNREFUSED, ETIMEDOUT, fetch errors, "compute_time_quota_exceeded"
  // strings — triggers failover.
  if (typeof code === "string" && /^[A-Z0-9]{5}$/.test(code)) return false
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
