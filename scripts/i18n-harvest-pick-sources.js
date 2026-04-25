#!/usr/bin/env node
/**
 * i18n-harvest-pick-sources.js
 *
 * Walk every .tsx/.ts file in app/ + components/ and extract the (de, en)
 * string pairs from every `pick(locale|isDE, "de", "en")` call introduced
 * by the codemod. Dedupe by the English source string and write the set
 * to lib/i18n-pick-sources.json.
 *
 * Downstream `i18n-build-autotranslate.js` translates each unique English
 * source into all 28 non-de/en locales and builds lib/i18n-autotranslate.ts.
 *
 *   Usage:
 *     node scripts/i18n-harvest-pick-sources.js
 *     VERBOSE=1 node scripts/i18n-harvest-pick-sources.js
 */

const fs = require("fs")
const path = require("path")

const VERBOSE = process.env.VERBOSE === "1"

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

// Match `pick(firstArg, "de literal", "en literal")` where firstArg is
// `locale` or `isDE`. Support both quoted and backtick string literals.
// We anchor on the function name `pick(` then parse two string-literal
// arguments with a small character parser (regex alone would miss escapes).

function skipWs(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++
  return i
}
function readStringLit(src, i) {
  const q = src[i]
  if (q !== '"' && q !== "'" && q !== "`") return null
  if (q === "`") {
    let j = i + 1
    while (j < src.length && src[j] !== "`") {
      if (src[j] === "\\") { j += 2; continue }
      if (src[j] === "$" && src[j + 1] === "{") return null
      j++
    }
    if (j >= src.length) return null
    return { raw: src.slice(i + 1, j), next: j + 1 }
  }
  let j = i + 1
  while (j < src.length && src[j] !== q) {
    if (src[j] === "\\") { j += 2; continue }
    if (src[j] === "\n") return null
    j++
  }
  if (j >= src.length) return null
  return { raw: src.slice(i + 1, j), next: j + 1 }
}

function decodeEscapes(s) {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\")
}

const CALL_REGEX = /\bpick\s*\(\s*(locale|isDE)\s*,\s*/g

function harvestFile(src) {
  const pairs = []
  let m
  CALL_REGEX.lastIndex = 0
  while ((m = CALL_REGEX.exec(src)) !== null) {
    let i = m.index + m[0].length
    i = skipWs(src, i)
    const de = readStringLit(src, i)
    if (!de) continue
    i = skipWs(src, de.next)
    if (src[i] !== ",") continue
    i = skipWs(src, i + 1)
    const en = readStringLit(src, i)
    if (!en) continue
    i = skipWs(src, en.next)
    if (src[i] !== ")") continue
    pairs.push({ de: decodeEscapes(de.raw), en: decodeEscapes(en.raw) })
  }
  return pairs
}

function main() {
  const appDir = path.resolve("app")
  const compDir = path.resolve("components")
  const files = []
  if (fs.existsSync(appDir)) files.push(...walk(appDir))
  if (fs.existsSync(compDir)) files.push(...walk(compDir))
  console.log(`[harvest] scanning ${files.length} file(s)`)

  const byEn = new Map()        // en → { de, en, files: Set }
  let totalCalls = 0
  let fileCount = 0
  for (const f of files) {
    let src
    try { src = fs.readFileSync(f, "utf-8") } catch { continue }
    if (!src.includes("pick(")) continue
    const pairs = harvestFile(src)
    if (pairs.length === 0) continue
    fileCount++
    totalCalls += pairs.length
    for (const p of pairs) {
      if (!byEn.has(p.en)) byEn.set(p.en, { de: p.de, en: p.en, files: new Set() })
      byEn.get(p.en).files.add(path.relative(process.cwd(), f))
    }
    if (VERBOSE) console.log(`  ${path.relative(process.cwd(), f)}: ${pairs.length}`)
  }

  const pairs = Array.from(byEn.values()).map((v) => ({ de: v.de, en: v.en, fileCount: v.files.size }))
  // Deterministic order for stable commits.
  pairs.sort((a, b) => (a.en < b.en ? -1 : a.en > b.en ? 1 : 0))

  const outFile = path.join("lib", "i18n-pick-sources.json")
  fs.writeFileSync(outFile, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalCalls,
    fileCount,
    uniquePairs: pairs.length,
    pairs,
  }, null, 2) + "\n")

  console.log(`\n[harvest] ${totalCalls} pick() calls across ${fileCount} files`)
  console.log(`[harvest] ${pairs.length} unique English source strings`)
  console.log(`[harvest] → ${outFile}`)
}

main()
