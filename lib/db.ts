// @neondatabase/serverless is a drop-in replacement for `pg` that works on
// both Node.js (Vercel/Netlify) and Cloudflare Workers (nodejs_compat_v2).
// It uses WebSockets to connect to Neon's serverless PostgreSQL endpoint.
import { Pool, PoolClient, QueryResult, QueryResultRow } from "@neondatabase/serverless"

declare global {
  // eslint-disable-next-line no-var
  var __claw_db_pool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }
  // Strip sslmode from the connection string — neon/serverless handles SSL
  // internally; explicit sslmode params can cause connection warnings.
  const url = new URL(connectionString)
  url.searchParams.delete("sslmode")
  return new Pool({
    connectionString: url.toString(),
    // Keep the pool small: serverless functions are short-lived and Neon's
    // connection limit is shared across concurrent invocations.
    max: 3,
    idleTimeoutMillis: 30_000,
    // Allow enough time for Neon cold-starts, especially across regions.
    connectionTimeoutMillis: 30_000,
  })
}

export function getPool(): Pool {
  if (!global.__claw_db_pool) {
    global.__claw_db_pool = createPool()
  }
  return global.__claw_db_pool
}

export async function dbQuery<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool()
  return pool.query<T>(text, params)
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
