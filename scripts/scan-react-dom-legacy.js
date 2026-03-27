#!/usr/bin/env node
/*
  Scan repository for legacy react-dom usage that is incompatible with React 18 createRoot/hydrateRoot.
  Exits with non-zero code if any matches are found to make Vercel build logs point to offending files.
*/

const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const SCAN_NODE_MODULES = process.env.SCAN_NODE_MODULES === 'true'
const IGNORES = new Set([
  SCAN_NODE_MODULES ? '__NO_IGNORE__' : 'node_modules',
  '.git', '.next', '.vercel', '.netlify', '.turbo', 'dist', 'build', 'out', '_deploy'
])
const EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'])

// Patterns to flag
const PATTERNS = [
  { name: "import ReactDOM from 'react-dom'", re: /import\s+ReactDOM\s+from\s+['\"]react-dom['\"]/ },
  { name: "import * as ReactDOM from 'react-dom'", re: /import\s+\*\s+as\s+ReactDOM\s+from\s+['\"]react-dom['\"]/ },
  { name: "import { render } from 'react-dom'", re: /import\s*\{[^}]*\brender\b[^}]*\}\s*from\s*['\"]react-dom['\"]/ },
  { name: 'ReactDOM.render(', re: /ReactDOM\.render\s*\(/ },
  { name: 'ReactDOM.hydrate(', re: /ReactDOM\.hydrate\s*\(/ },
  { name: "require('react-dom')", re: /require\(\s*['\"]react-dom['\"]\s*\)/ },
]

let findings = []

function scanFile(file) {
  const rel = path.relative(ROOT, file)
  // Do not scan this script itself
  if (rel.replace(/\\/g, '/') === 'scripts/scan-react-dom-legacy.js') return
  let data
  try { data = fs.readFileSync(file, 'utf8') } catch { return }
  const lines = data.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const p of PATTERNS) {
      if (p.re.test(line)) {
        findings.push({ file: rel, line: i + 1, pattern: p.name, text: line.trim() })
      }
    }
  }
}

function walk(dir) {
  let ents
  try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const ent of ents) {
    if (IGNORES.has(ent.name)) continue
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walk(full)
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name)
      if (EXTS.has(ext)) scanFile(full)
    }
  }
}

walk(ROOT)

if (findings.length) {
  console.error('\n[react-dom legacy scan] Found potential legacy usages that conflict with React 18:')
  for (const f of findings) {
    console.error(` - ${f.file}:${f.line} :: ${f.pattern} :: ${f.text}`)
  }
  console.error('\nPlease migrate to `import { createRoot } from \"react-dom/client\"` and use `createRoot(...).render(...)` or `hydrateRoot`.')
  process.exit(2)
} else {
  console.log('[react-dom legacy scan] No legacy react-dom usage found.')
}
