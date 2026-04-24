#!/usr/bin/env node
/**
 * Fail CI if any page under app/[lang] imports @/lib/db without
 * `export const dynamic = "force-dynamic"` (or 'force-dynamic').
 *
 * Rationale: see docs/postmortem-2026-04-24-seven-red-deploys.md — SSG × locales
 * × Neon was burning compute quota and breaking builds.
 */

const fs = require("fs")
const path = require("path")

const REPO_ROOT = path.join(__dirname, "..")
const LANG_ROOT = path.join(REPO_ROOT, "app", "[lang]")
const IMPORT_RE = /from\s+["']@\/lib\/db["']/
const DYNAMIC_RE =
  /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, acc)
    else if (/\.(tsx|ts)$/.test(ent.name)) acc.push(p)
  }
  return acc
}

const violations = []
for (const file of walk(LANG_ROOT)) {
  const content = fs.readFileSync(file, "utf8")
  if (!IMPORT_RE.test(content)) continue
  if (!DYNAMIC_RE.test(content)) {
    violations.push(path.relative(REPO_ROOT, file).replace(/\\/g, "/"))
  }
}

if (violations.length) {
  console.error(
    "[check-static-db] Pages under app/[lang] that import @/lib/db must export:\n" +
      '  export const dynamic = "force-dynamic"\n' +
      "Violations:"
  )
  for (const v of violations) console.error("  -", v)
  process.exit(1)
}

console.log("[check-static-db] OK — all app/[lang] files using @/lib/db declare force-dynamic")
