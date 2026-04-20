/* Apply a single migration file directly, bypassing sequential ordering */
const fs = require('fs')
const path = require('path')
try {
  const dotenv = require('dotenv')
  for (const p of ['.env.local', '.env.production.local', '.env']) {
    const full = path.join(process.cwd(), p)
    if (fs.existsSync(full)) dotenv.config({ path: full })
  }
} catch {}
const { Pool } = require('pg')

async function main() {
  const file = process.argv[2]
  if (!file) { console.error('usage: node apply-one.js <migration-file>'); process.exit(1) }
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) { console.error('DATABASE_URL is not set'); process.exit(1) }
  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ DEFAULT NOW())`)
    const id = path.basename(file)
    const exists = await client.query('SELECT 1 FROM schema_migrations WHERE id=$1', [id])
    if (exists.rowCount > 0) { console.log(`Already applied: ${id}`); return }
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8')
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('INSERT INTO schema_migrations(id) VALUES($1)', [id])
    await client.query('COMMIT')
    console.log(`Applied: ${id}`)
  } finally {
    client.release(); await pool.end()
  }
}
main().catch((e) => { console.error(e); process.exit(2) })
