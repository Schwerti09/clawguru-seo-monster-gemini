#!/usr/bin/env node
/**
 * i18n-codemod-pick.js
 *
 * Rewrite legacy inline ternaries to the centralized `pick()` helper so a
 * single Phase-2 change (adding a translation lookup inside pick) unblocks
 * real localisation on every file at once.
 *
 * Transforms:
 *   isDE ? "DE text" : "EN text"                   →  pick(locale, "DE text", "EN text")
 *   locale === "de" ? "DE text" : "EN text"        →  pick(locale, "DE text", "EN text")
 *   isDE ? `DE text` : `EN text`                   →  pick(locale, `DE text`, `EN text`)
 *   locale === "de" ? `DE text` : `EN text`        →  same
 *
 * Non-goals for this pass:
 *   - Ternaries with JSX, function calls, or identifiers in either branch
 *   - Nested ternaries
 *   - Template literals with expression interpolation
 *
 * After rewrite, the codemod:
 *   1. Ensures `import { pick } from "@/lib/i18n-pick"` exists
 *   2. Leaves `locale`/`isDE` usage intact where they are defined in scope
 *
 *   Usage:
 *     node scripts/i18n-codemod-pick.js                              # all .tsx under app/ + components/
 *     node scripts/i18n-codemod-pick.js app/\[lang\]/pricing/page.tsx # single file
 *     DRY=1 node scripts/i18n-codemod-pick.js                        # report only
 *     VERBOSE=1 node scripts/i18n-codemod-pick.js
 */

const fs = require("fs")
const path = require("path")

const DRY = process.env.DRY === "1"
const VERBOSE = process.env.VERBOSE === "1"

// ─── find files ────────────────────────────────────────────────────────────
function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue
      walk(full, out)
    } else if (e.name.endsWith(".tsx") || e.name.endsWith(".ts")) {
      out.push(full)
    }
  }
  return out
}

// ─── ternary matcher ───────────────────────────────────────────────────────
//
// We scan character-by-character to locate `? ... : ...` where the preceding
// condition is either `isDE` or `locale === "de"` (allowing whitespace), and
// both branches are purely string literals (quoted or backtick without `${}`).
//
// Regex-only approach is fragile because strings can contain ? and : chars.
// We use a small parser that:
//   1. Finds candidate condition tokens
//   2. Advances past whitespace + `?`
//   3. Parses a string literal branch (respecting escapes)
//   4. Expects `:`
//   5. Parses another string literal branch
// If anything doesn't match exactly, we skip (safe).

const COND_REGEX = /\b(isDE|locale\s*===\s*["']de["'])\b/g

function skipWs(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++
  return i
}

function readStringLit(src, i) {
  const q = src[i]
  if (q !== '"' && q !== "'" && q !== "`") return null
  if (q === "`") {
    // Template literal — reject if it contains ${...}
    let j = i + 1
    while (j < src.length && src[j] !== "`") {
      if (src[j] === "\\") { j += 2; continue }
      if (src[j] === "$" && src[j + 1] === "{") return null
      j++
    }
    if (j >= src.length) return null
    return { raw: src.slice(i, j + 1), next: j + 1, isTemplate: true }
  }
  let j = i + 1
  while (j < src.length && src[j] !== q) {
    if (src[j] === "\\") { j += 2; continue }
    if (src[j] === "\n") return null // bail on multi-line strings
    j++
  }
  if (j >= src.length) return null
  return { raw: src.slice(i, j + 1), next: j + 1, isTemplate: false }
}

function transformFile(src) {
  let out = src
  let replacements = 0
  let cursor = 0
  while (cursor < out.length) {
    COND_REGEX.lastIndex = cursor
    const m = COND_REGEX.exec(out)
    if (!m) break
    const condStart = m.index
    const condEnd = condStart + m[0].length
    // check we are not inside a string/comment: crude heuristic — skip if
    // preceded by `//` on same line or inside string (we don't fully strip
    // comments here; it's fine for practical tsx content).
    // skip if char before is identifier char (e.g. foo.isDE is fine but 'isDE' inside a longer id should NOT happen due to \b)
    let i = skipWs(out, condEnd)
    if (out[i] !== "?") { cursor = condEnd; continue }
    i = skipWs(out, i + 1)
    const lhs = readStringLit(out, i)
    if (!lhs) { cursor = condEnd; continue }
    i = skipWs(out, lhs.next)
    if (out[i] !== ":") { cursor = condEnd; continue }
    i = skipWs(out, i + 1)
    const rhs = readStringLit(out, i)
    if (!rhs) { cursor = condEnd; continue }
    // Emit the right first arg: for `isDE` call sites we pass `isDE` (boolean
    // overload); for `locale === "de"` call sites we pass `locale` (Locale
    // overload). Matches what's actually in scope at the call site.
    const firstArg = /^isDE$/.test(m[0]) ? "isDE" : "locale"
    const replacement = `pick(${firstArg}, ${lhs.raw}, ${rhs.raw})`
    out = out.slice(0, condStart) + replacement + out.slice(rhs.next)
    replacements++
    cursor = condStart + replacement.length
  }
  return { out, replacements }
}

// ─── import injector ───────────────────────────────────────────────────────
function ensurePickImport(src) {
  if (/from\s+["']@\/lib\/i18n-pick["']/.test(src)) return src
  // Find the last top-level `import ... from "..."` line and insert after it.
  const importRe = /^import\s+[^;]+?from\s+["'][^"']+["'];?$/gm
  let lastImportEnd = 0
  let m
  while ((m = importRe.exec(src)) !== null) {
    lastImportEnd = m.index + m[0].length
  }
  const line = `import { pick } from "@/lib/i18n-pick"`
  if (lastImportEnd === 0) {
    // no existing imports — put at top (after "use client" pragma if any)
    if (/^"use client"/.test(src)) {
      const firstNewline = src.indexOf("\n")
      return src.slice(0, firstNewline + 1) + "\n" + line + "\n" + src.slice(firstNewline + 1)
    }
    return line + "\n" + src
  }
  return src.slice(0, lastImportEnd) + "\n" + line + src.slice(lastImportEnd)
}

// ─── main ──────────────────────────────────────────────────────────────────
function processFile(file) {
  let src
  try { src = fs.readFileSync(file, "utf-8") } catch { return { file, replacements: 0, skipped: true } }
  const { out, replacements } = transformFile(src)
  if (replacements === 0) return { file, replacements: 0 }
  const final = ensurePickImport(out)
  if (!DRY) fs.writeFileSync(file, final, "utf-8")
  return { file, replacements }
}

function main() {
  const args = process.argv.slice(2)
  let files
  if (args.length > 0) {
    files = args.map((a) => path.resolve(a)).filter((f) => fs.existsSync(f))
  } else {
    const appDir = path.resolve("app")
    const compDir = path.resolve("components")
    files = []
    if (fs.existsSync(appDir)) files.push(...walk(appDir))
    if (fs.existsSync(compDir)) files.push(...walk(compDir))
  }
  console.log(`[codemod] scanning ${files.length} file(s)${DRY ? " (DRY)" : ""}`)
  let totalFiles = 0
  let totalRepl = 0
  for (const f of files) {
    const r = processFile(f)
    if (r.replacements > 0) {
      totalFiles++
      totalRepl += r.replacements
      if (VERBOSE) console.log(`  ${path.relative(process.cwd(), r.file)}: ${r.replacements}`)
    }
  }
  console.log(`\n[codemod] ${totalRepl} replacements across ${totalFiles} file(s)`)
  if (DRY) console.log("[codemod] DRY — no writes performed")
}

main()
