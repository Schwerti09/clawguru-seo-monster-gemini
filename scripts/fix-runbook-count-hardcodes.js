#!/usr/bin/env node
/**
 * fix-runbook-count-hardcodes.js
 *
 * One-shot codemod that retires the "4.2M / 4,2 Millionen" hardcodes scattered
 * across the ClawVerse and marketing pages. Replaces them with the canonical
 * lib/stats.ts constants + injects the import at the top of each touched file.
 *
 * Background: Kimi 2.5 audit found inconsistent runbook counts (4.2M / 3.4M /
 * 1M / 3M). lib/stats.ts is now the single source of truth at 3.4M. This
 * codemod migrates the existing hardcodes; new code should import directly.
 *
 *   Usage:
 *     node scripts/fix-runbook-count-hardcodes.js          # write changes
 *     node scripts/fix-runbook-count-hardcodes.js --dry    # preview only
 *
 * Idempotent — re-runs against an already-migrated file are no-ops.
 */

const fs = require("fs")
const path = require("path")

const DRY = process.argv.includes("--dry")

// Pattern → replacement. Each entry is plain string match (not regex) so that
// the result is deterministic and easy to audit. Replacements use template
// literals — Edit pages must be migrated to backtick strings if they were
// double-quoted.
const REPLACEMENTS = [
  { from: "4,2 Millionen ausführbaren Runbooks", to: "${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks", needsImport: "RUNBOOK_COUNT_LONG_DE" },
  { from: "4.2 million executable runbooks",     to: "${RUNBOOK_COUNT_LONG_EN} executable runbooks",   needsImport: "RUNBOOK_COUNT_LONG_EN" },
  { from: "4,2 Millionen AI-generierte Runbooks", to: "${RUNBOOK_COUNT_LONG_DE} AI-generierte Runbooks", needsImport: "RUNBOOK_COUNT_LONG_DE" },
  { from: "4.2M+",                                to: "${RUNBOOK_COUNT_SHORT_EN}+",                     needsImport: "RUNBOOK_COUNT_SHORT_EN" },
  { from: "Zugang zu 4.2M+ Runbooks",             to: "Zugang zu ${RUNBOOK_COUNT_SHORT_EN}+ Runbooks",  needsImport: "RUNBOOK_COUNT_SHORT_EN" },
  { from: "Access to 4.2M+ runbooks",             to: "Access to ${RUNBOOK_COUNT_SHORT_EN}+ runbooks",  needsImport: "RUNBOOK_COUNT_SHORT_EN" },
  { from: "4.2M+ nodes of collective",            to: "${RUNBOOK_COUNT_SHORT_EN}+ nodes of collective", needsImport: "RUNBOOK_COUNT_SHORT_EN" },
]

// Files that opted out — already manually migrated, or marketing-narrative
// timeline (vorstellung Q2-2026 forward projection) that should not auto-bind.
const SKIP = new Set([
  "lib/stats.ts",
  "lib/i18n-autotranslate.ts",
])

const ROOTS = ["app", "components"]

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(full)
  }
  return out
}

function ensureImport(src, importedNames) {
  // No-op if all names are already imported from @/lib/stats.
  const existingImport = src.match(/^import\s*\{([^}]*)\}\s*from\s*["']@\/lib\/stats["']/m)
  if (existingImport) {
    const have = new Set(existingImport[1].split(",").map((s) => s.trim()).filter(Boolean))
    const missing = importedNames.filter((n) => !have.has(n))
    if (missing.length === 0) return src
    const merged = Array.from(new Set([...have, ...missing])).sort().join(", ")
    return src.replace(existingImport[0], `import { ${merged} } from "@/lib/stats"`)
  }
  // Insert a fresh import after the last top-level import line (or at top).
  const lines = src.split("\n")
  let lastImportIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^import\b/.test(lines[i])) lastImportIdx = i
    else if (lastImportIdx >= 0 && lines[i].trim() === "") continue
    else if (lastImportIdx >= 0) break
  }
  const ins = `import { ${importedNames.sort().join(", ")} } from "@/lib/stats"`
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, ins)
  } else {
    // Top of file. Preserve "use client" / shebang on line 1 if present.
    const firstNonDirective = lines.findIndex((l) => l.trim() !== "" && !/^"use\s+\w+"/.test(l.trim()) && !/^#!/.test(l.trim()))
    const at = firstNonDirective >= 0 ? firstNonDirective : 0
    lines.splice(at, 0, ins, "")
  }
  return lines.join("\n")
}

// Classify the syntactic context of `fromIdx`. We only safely rewrite two:
//   - "string-literal":  inside a "..." / '...' / `...` value
//   - "jsx-text":        between a JSX `>` and `<` (raw text node)
// Anything else (inside a regex, comment, decorator) we refuse to touch.
function classifyContext(src, fromIdx) {
  // Walk left until newline or a meaningful delimiter; collect what we see.
  let i = fromIdx - 1
  let sawJsxOpen = false
  let openQuote = ""
  let openIdx = -1
  while (i >= 0) {
    const ch = src[i]
    if (ch === "\n") break
    if (ch === ">" && src[i - 1] !== "=") { sawJsxOpen = true; break }
    if ((ch === '"' || ch === "'" || ch === "`") && (i === 0 || src[i - 1] !== "\\")) {
      openQuote = ch
      openIdx = i
      break
    }
    i--
  }
  if (openIdx >= 0) {
    // String literal — find the matching close quote.
    let j = openIdx + 1
    while (j < src.length) {
      if (src[j] === "\\") { j += 2; continue }
      if (src[j] === openQuote) break
      j++
    }
    if (j >= src.length) return null
    return { kind: "string-literal", openQuote, openIdx, closeIdx: j }
  }
  if (sawJsxOpen) {
    // JSX text — find next `<` to mark end.
    let j = fromIdx
    while (j < src.length && src[j] !== "<") j++
    if (j >= src.length) return null
    return { kind: "jsx-text", openQuote: "", openIdx: -1, closeIdx: j }
  }
  return null
}

// Replace `fromStr` with `toStr` near `fromIdx`, preserving surrounding syntax.
function rewriteAtMatch(src, fromIdx, fromStr, toStr) {
  const ctx = classifyContext(src, fromIdx)
  if (!ctx) return null

  if (ctx.kind === "string-literal") {
    const { openQuote, openIdx, closeIdx } = ctx
    const inner = src.slice(openIdx + 1, closeIdx)
    if (!inner.includes(fromStr)) return null // match was outside our literal — bail
    const newInner = inner.replace(fromStr, toStr)
    if (openQuote === "`") {
      return src.slice(0, openIdx + 1) + newInner + src.slice(closeIdx)
    }
    // Escape any backticks/${ that need protection in the new template literal.
    const escaped = newInner.replace(/`/g, "\\`").replace(/\\\$\{/g, "\\${")
    return src.slice(0, openIdx) + "`" + escaped + "`" + src.slice(closeIdx + 1)
  }

  // JSX text: wrap the replacement in `{` `}` so React renders the expression.
  // `4.2M+` becomes `{RUNBOOK_COUNT_SHORT_EN}+` in JSX context, NOT a template literal.
  // Strip the `${...}` wrapping from `toStr` since we already have JSX braces.
  const jsxReplacement = toStr.replace(/\$\{([^}]+)\}/g, "{$1}")
  const lineStart = src.slice(0, fromIdx).lastIndexOf("\n") + 1
  const beforeFrom = src.slice(lineStart, fromIdx)
  const afterFromInLine = src.slice(fromIdx + fromStr.length).split("\n")[0]
  const newSlice = beforeFrom + jsxReplacement + afterFromInLine
  return src.slice(0, lineStart) + newSlice + src.slice(lineStart + (fromIdx - lineStart) + fromStr.length + afterFromInLine.length)
}

function processFile(file) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, "/")
  if (SKIP.has(rel)) return null
  let src = fs.readFileSync(file, "utf8")
  if (!REPLACEMENTS.some((r) => src.includes(r.from))) return null

  const neededImports = new Set()
  let changed = 0

  for (const r of REPLACEMENTS) {
    while (src.includes(r.from)) {
      const idx = src.indexOf(r.from)
      const result = rewriteAtMatch(src, idx, r.from, r.to)
      if (!result) {
        // Couldn't safely identify the surrounding literal — fall back to
        // direct text replace (only safe inside backtick literals or already-
        // template strings; for double-quoted strings this could break.)
        // We bail conservatively.
        console.warn(`  ${rel}: could not auto-rewrite literal at index ${idx}, skipping`)
        break
      }
      src = result
      neededImports.add(r.needsImport)
      changed++
    }
  }

  if (changed === 0) return null
  src = ensureImport(src, Array.from(neededImports))

  if (DRY) {
    console.log(`[dry] ${rel}: ${changed} replacement(s)`)
    return { file, changed }
  }
  fs.writeFileSync(file, src, "utf8")
  console.log(`${rel}: ${changed} replacement(s)`)
  return { file, changed }
}

function main() {
  const files = []
  for (const r of ROOTS) {
    if (fs.existsSync(r)) walk(r, files)
  }
  console.log(`[fix-runbook-count] scanning ${files.length} TS/TSX files${DRY ? " (dry run)" : ""}`)
  let touched = 0, total = 0
  for (const f of files) {
    const result = processFile(f)
    if (result) { touched++; total += result.changed }
  }
  console.log(`\n[fix-runbook-count] ${touched} file(s) touched, ${total} replacement(s) total${DRY ? " (no writes)" : ""}`)
}

main()
