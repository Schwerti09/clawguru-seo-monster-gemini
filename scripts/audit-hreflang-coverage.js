#!/usr/bin/env node
/**
 * audit-hreflang-coverage.js
 *
 * Walks every app/[lang]/**\/page.tsx route and verifies that it exports a
 * generateMetadata() that wires up hreflang via buildLocalizedAlternates().
 * Pages without proper hreflang miss the chance to tell Google "/en/foo and
 * /de/foo are the same page in different languages" — bad for SEO.
 *
 * Kimi 2.5 audit Important #8.
 *
 *   Usage:
 *     node scripts/audit-hreflang-coverage.js              # exit 0 if all OK
 *     node scripts/audit-hreflang-coverage.js --json       # machine-readable
 *
 * Exit codes:
 *   0 — all routes have hreflang
 *   1 — at least one route missing hreflang (CI gate-able)
 */

const fs = require("fs")
const path = require("path")

const JSON_OUT = process.argv.includes("--json")
const ROOT = path.resolve(process.cwd(), "app", "[lang]")

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (e.name === "page.tsx" || e.name === "page.ts") out.push(full)
  }
  return out
}

function classify(file) {
  const src = fs.readFileSync(file, "utf-8")
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/")

  const hasGenerateMetadata = /export\s+(?:async\s+)?function\s+generateMetadata\b/.test(src)
  const hasAlternates       = /alternates\s*:\s*buildLocalizedAlternates\b/.test(src)
  const hasManualAlternates = /alternates\s*:\s*\{\s*languages\b/.test(src)
  const importsHelper       = /buildLocalizedAlternates/.test(src)

  if (!hasGenerateMetadata) {
    return { rel, status: "no-metadata", note: "no generateMetadata export" }
  }
  if (hasAlternates || hasManualAlternates) {
    return { rel, status: "ok", note: hasAlternates ? "buildLocalizedAlternates" : "manual languages map" }
  }
  if (importsHelper) {
    return { rel, status: "imported-not-used", note: "imports helper but doesn't wire alternates" }
  }
  return { rel, status: "missing", note: "generateMetadata exists but no alternates" }
}

function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`[hreflang-audit] ${ROOT} not found`)
    process.exit(2)
  }
  const files = walk(ROOT)
  const results = files.map(classify)

  const ok          = results.filter((r) => r.status === "ok")
  const noMeta      = results.filter((r) => r.status === "no-metadata")
  const missing     = results.filter((r) => r.status === "missing")
  const importNotUsed = results.filter((r) => r.status === "imported-not-used")

  if (JSON_OUT) {
    console.log(JSON.stringify({
      scanned: results.length,
      ok: ok.length,
      noMetadata: noMeta.length,
      missing: missing.length,
      importedNotUsed: importNotUsed.length,
      details: results,
    }, null, 2))
  } else {
    console.log(`[hreflang-audit] scanned ${results.length} app/[lang]/**/page.tsx routes\n`)
    console.log(`  ✓ OK                  ${ok.length}`)
    console.log(`  ✗ Missing alternates  ${missing.length}`)
    console.log(`  ⚠ No generateMetadata ${noMeta.length}`)
    console.log(`  ⚠ Helper imported, not used ${importNotUsed.length}\n`)

    if (missing.length > 0) {
      console.log("Pages MISSING hreflang alternates:")
      for (const r of missing) console.log(`  - ${r.rel}`)
      console.log()
    }
    if (importNotUsed.length > 0) {
      console.log("Pages where buildLocalizedAlternates is imported but not wired:")
      for (const r of importNotUsed) console.log(`  - ${r.rel}`)
      console.log()
    }
    if (noMeta.length > 0 && noMeta.length <= 20) {
      console.log("Pages WITHOUT generateMetadata (may inherit from layout):")
      for (const r of noMeta) console.log(`  - ${r.rel}`)
      console.log()
    } else if (noMeta.length > 20) {
      console.log(`(${noMeta.length} pages without generateMetadata — likely inherit from layout, run with --json for full list)\n`)
    }
  }

  process.exit(missing.length === 0 && importNotUsed.length === 0 ? 0 : 1)
}

main()
