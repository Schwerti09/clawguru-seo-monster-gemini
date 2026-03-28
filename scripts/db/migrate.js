/* Simple migration runner for Neon/PostgreSQL */
const fs = require('fs')
const path = require('path')
// Load env from common files if not present
try {
  const dotenv = require('dotenv')
  const root = process.cwd()
  const candidates = [
    path.join(root, '.env.local'),
    path.join(root, '.env.production.local'),
    path.join(root, '.env'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) dotenv.config({ path: p })
  }
} catch {}
const { Pool } = require('pg')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })
  const client = await pool.connect()
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ DEFAULT NOW())`)

    const dir = path.join(__dirname, 'migrations')
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.match(/^\d+_.+\.sql$/))
      .sort()

    for (const file of files) {
      const id = file
      const exists = await client.query('SELECT 1 FROM schema_migrations WHERE id=$1', [id])
      if (exists.rowCount > 0) {
        console.log(`Skipping ${id} (already applied)`) 
        continue
      }
      const sql = fs.readFileSync(path.join(dir, file), 'utf8')
      console.log(`Applying ${id}...`)
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations(id) VALUES($1)', [id])
        await client.query('COMMIT')
        console.log(`Applied ${id}`)
      } catch (e) {
        await client.query('ROLLBACK')
        console.error(`Failed ${id}:`, e.message)
        process.exit(2)
      }
    }
    console.log('Migrations complete')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(3)
})
