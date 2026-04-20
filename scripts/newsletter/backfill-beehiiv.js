/**
 * One-shot backfill: sync existing newsletter_subscribers → Beehiiv.
 * Run AFTER setting BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID.
 * Safe to re-run; Beehiiv dedupes on email.
 *
 * Usage: node scripts/newsletter/backfill-beehiiv.js [--dry-run] [--welcome=false]
 */
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

const DRY_RUN = process.argv.includes('--dry-run')
const SEND_WELCOME = !process.argv.includes('--welcome=false')

async function syncOne(email, source, locale) {
  const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      reactivate_existing: true,
      send_welcome_email: SEND_WELCOME,
      utm_source: source || 'backfill',
      utm_campaign: locale || 'de',
    }),
  })
  return { status: res.status, ok: res.ok }
}

async function main() {
  if (!process.env.BEEHIIV_API_KEY || !process.env.BEEHIIV_PUBLICATION_ID) {
    console.error('Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID')
    process.exit(1)
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  const { rows } = await pool.query(
    `SELECT email, source, locale FROM newsletter_subscribers WHERE status='active' ORDER BY created_at ASC`
  )
  console.log(`Found ${rows.length} active subscribers${DRY_RUN ? ' (DRY RUN)' : ''}`)

  let ok = 0, fail = 0
  for (const row of rows) {
    if (DRY_RUN) {
      console.log(`  [dry] ${row.email}`)
      continue
    }
    try {
      const r = await syncOne(row.email, row.source, row.locale)
      if (r.ok) { ok++; console.log(`  ✓ ${row.email}`) }
      else     { fail++; console.log(`  ✗ ${row.email} (${r.status})`) }
    } catch (e) {
      fail++; console.log(`  ✗ ${row.email} — ${e.message}`)
    }
    // Rate-limit: Beehiiv allows ~10 req/s. Stay safe at 5.
    await new Promise((res) => setTimeout(res, 200))
  }
  console.log(`\nDone. Success: ${ok}, Failed: ${fail}`)
  await pool.end()
}

main().catch((e) => { console.error(e); process.exit(2) })
