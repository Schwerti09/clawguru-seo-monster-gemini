import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var __claw_db_pool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }
  // Strip sslmode from the connection string so that newer versions of pg
  // (which warn when sslmode is 'prefer', 'require', or 'verify-ca') do not
  // emit the SECURITY WARNING. SSL is configured programmatically below.
  const url = new URL(connectionString)
  url.searchParams.delete("sslmode")
  return new Pool({
    connectionString: url.toString(),
    // Neon requires SSL; rejectUnauthorized=false works with Neon pooler
    ssl: { rejectUnauthorized: false },
    // Vercel functions are short-lived: keep the pool small to avoid
    // exhausting Neon's connection limit across concurrent invocations.
    max: 3,
    idleTimeoutMillis: 10_000,
    // Allow enough time for Neon cold-starts, especially across regions.
    connectionTimeoutMillis: 10_000,
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
