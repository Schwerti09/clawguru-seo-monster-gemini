/*
  Generate a minimal runbooks dataset for the search API.
  - Combines currently materialized RUNBOOKS with deterministic 100k-slug pages.
  - Config via env:
    RUNBOOKS_JSON_PAGES: number of 100k pages to include (default: 2)
    RUNBOOKS_JSON_OUT: output path (default: public/runbooks.json)
*/

import fs from 'fs'
import path from 'path'

function toTitle(slug: string): string {
  // Cheap titleization from slug
  return slug
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

function tagsFromSlug(slug: string): string[] {
  // Expected format: provider-service-issue-year
  const parts = slug.split('-')
  if (parts.length < 4) return []
  const year = parts[parts.length - 1]
  const issue = parts.slice(parts.length - 2, parts.length - 1)[0]
  const service = parts.slice(1, parts.length - 2).join('-') // tolerate hyphens in service
  const provider = parts[0]
  return [provider, service, issue, year].filter(Boolean)
}

function uniqBySlug<T extends { slug: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const item of arr) {
    if (!seen.has(item.slug)) {
      seen.add(item.slug)
      out.push(item)
    }
  }
  return out
}

async function main() {
  const pages = Math.max(0, Number(process.env.RUNBOOKS_JSON_PAGES ?? 2))
  const outRel = process.env.RUNBOOKS_JSON_OUT || 'public/runbooks.json'
  const outPath = path.isAbsolute(outRel) ? outRel : path.join(process.cwd(), outRel)

  const minimal = (r: any) => ({
    slug: String(r.slug),
    title: String(r.title ?? toTitle(String(r.slug))),
    summary: String(r.summary ?? ''),
    tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    lastmod: r.lastmod ? String(r.lastmod) : undefined,
    clawScore: typeof r.clawScore === 'number' ? r.clawScore : undefined,
  })

  const out: any[] = []

  // Prepare pseo import with BUILD guard to avoid heavy work during data build
  process.env.NEXT_PHASE = process.env.NEXT_PHASE || 'phase-production-build'
  const pseo = await import('../lib/pseo')

  // 1) Include currently materialized RUNBOOKS (fast; will be [] under build guard)
  try {
    const arr = (pseo as any).materializedRunbooks() as any[]
    for (const r of arr) out.push(minimal(r))
    console.log(`Included materializedRunbooks: ${arr.length}`)
  } catch (e) {
    console.warn('WARN: failed to include materializedRunbooks', (e as Error)?.message)
  }

  // 2) Include N pages of deterministic 100k slugs (lightweight, titleized)
  try {
    for (let p = 0; p < pages; p++) {
      const get100kSlugsPage = (pseo as any).get100kSlugsPage as undefined | ((page: number) => string[])
      const slugs = typeof get100kSlugsPage === 'function' ? get100kSlugsPage(p) : []
      for (const slug of slugs) {
        out.push({
          slug,
          title: toTitle(slug),
          summary: 'Deterministic 100k entry',
          tags: tagsFromSlug(slug),
          lastmod: '2026-01-01',
          clawScore: 80,
        })
      }
      console.log(`Included 100k page ${p} with ${slugs.length} slugs`)
    }
  } catch (e) {
    console.warn('WARN: failed to include 100k pages', (e as Error)?.message)
  }

  const final = uniqBySlug(out)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(final), 'utf8')
  const sizeMb = (Buffer.byteLength(JSON.stringify(final)) / (1024 * 1024)).toFixed(2)
  console.log(`Wrote ${final.length} runbooks to ${outPath} (~${sizeMb} MB)`) 
}

main().catch((e) => {
  console.error('ERROR: generate-runbooks-json failed', e)
  process.exit(1)
})
