/*
  Generate minimal runbooks dataset for search API into public/runbooks.json.
  - Deterministic synthetic entries based on provider-service-issue-year grid
  - Config:
    RUNBOOKS_JSON_PAGES (default: 2)
    RUNBOOKS_JSON_PAGE_SIZE (default: 50000)
    RUNBOOKS_JSON_OUT (default: public/runbooks.json)
*/

const fs = require('fs')
const path = require('path')

const PROVIDERS = [
  { slug: 'aws' },
  { slug: 'azure' },
  { slug: 'gcp' },
  { slug: 'cloudflare' },
  { slug: 'hetzner' },
  { slug: 'digitalocean' },
]

const SERVICES = [
  { slug: 'nginx' },
  { slug: 'kubernetes' },
  { slug: 'docker' },
  { slug: 'github-actions' },
  { slug: 'ssh' },
]

const ISSUES = [
  { slug: 'hardening' },
  { slug: 'csp' },
  { slug: 'waf' },
  { slug: 'rbac-misconfig' },
  { slug: 'sbom' },
]

const YEARS = ['2023', '2024', '2025', '2026']

function toTitle(slug) {
  return slug
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')
}

function tagsFromSlug(slug) {
  const parts = slug.split('-')
  if (parts.length < 4) return []
  const year = parts[parts.length - 1]
  const issue = parts.slice(parts.length - 2, parts.length - 1)[0]
  const service = parts.slice(1, parts.length - 2).join('-')
  const provider = parts[0]
  return [provider, service, issue, year].filter(Boolean)
}

function hashScore(slug) {
  // Deterministic 0..39 added to base 60
  let h = 5381
  for (let i = 0; i < slug.length; i++) h = (((h << 5) + h) ^ slug.charCodeAt(i)) >>> 0
  return h % 40
}

function computeClawScoreForJson({ slug, title, summary, tags }) {
  const base = 60 + hashScore(slug)
  const tlen = (title || '').split(/\s+/).filter(Boolean).length
  const slen = (summary || '').split(/\s+/).filter(Boolean).length
  const lengthScore = Math.min(10, Math.floor((tlen + slen) / 30) * 2) // up to +10

  const tg = (tags || []).map(String)
  const issue = tg[2] || ''
  const service = tg[1] || ''
  const issueWeight = /hardening|csp|waf|rbac|sbom/.test(issue) ? 8 : 0
  const serviceWeight = /nginx|kubernetes|docker|ssh/.test(service) ? 6 : 0

  const freshness = 6 // JSON is regenerated at build, treat as fresh medium weight

  let score = base + lengthScore + issueWeight + serviceWeight + freshness
  if (!Number.isFinite(score)) score = 60
  return Math.max(0, Math.min(100, Math.round(score)))
}

function getPage(page, pageSize) {
  const start = page * pageSize
  const end = start + pageSize
  const slugs = []
  let idx = 0
  outer: for (const p of PROVIDERS) {
    for (const s of SERVICES) {
      for (const i of ISSUES) {
        for (const y of YEARS) {
          if (idx >= end) break outer
          if (idx >= start) slugs.push(`${p.slug}-${s.slug}-${i.slug}-${y}`)
          idx++
        }
      }
    }
  }
  return slugs
}

function uniqBySlug(arr) {
  const seen = new Set()
  const out = []
  for (const r of arr) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug)
      out.push(r)
    }
  }
  return out
}

function main() {
  const pages = Math.max(0, Number(process.env.RUNBOOKS_JSON_PAGES || 2))
  const pageSize = Math.max(1, Number(process.env.RUNBOOKS_JSON_PAGE_SIZE || 50000))
  const outRel = process.env.RUNBOOKS_JSON_OUT || 'public/runbooks.json'
  const outPath = path.isAbsolute(outRel) ? outRel : path.join(process.cwd(), outRel)

  const out = []
  for (let p = 0; p < pages; p++) {
    const slugs = getPage(p, pageSize)
    for (const slug of slugs) {
      const item = {
        slug,
        title: toTitle(slug),
        summary: 'Deterministic 100k entry',
        tags: tagsFromSlug(slug),
        lastmod: '2026-01-01',
      }
      item.clawScore = computeClawScoreForJson(item)
      out.push(item)
    }
    console.log(`Included page ${p} with ${slugs.length} slugs`)
  }

  const final = uniqBySlug(out)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(final), 'utf8')
  const sizeMb = (Buffer.byteLength(JSON.stringify(final)) / (1024 * 1024)).toFixed(2)
  console.log(`Wrote ${final.length} runbooks to ${outPath} (~${sizeMb} MB)`) 
}

main()
