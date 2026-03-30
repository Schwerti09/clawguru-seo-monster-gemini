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
  return new Pool({
    connectionString,
    // Neon requires SSL; rejectUnauthorized=false works with Neon pooler
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
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
