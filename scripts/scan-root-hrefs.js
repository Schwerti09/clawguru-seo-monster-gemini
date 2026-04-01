/**
 * Lists href="/..." (root-relative) in app/[lang] for i18n hygiene.
 * Run: node scripts/scan-root-hrefs.js
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const LANG = path.join(ROOT, "app", "[lang]")

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p)
  }
  return out
}

const re = /href\s*=\s*["'](\/[^"'#?]*)["']/g
const allow = new Set([
  "/api/",
  "/_next/",
  "/robots.txt",
  "/sitemap.xml",
])

const files = walk(LANG)
const hits = []
for (const f of files) {
  const t = fs.readFileSync(f, "utf8")
  let m
  while ((m = re.exec(t))) {
    const href = m[1]
    if (href.startsWith("//")) continue
    let skip = false
    for (const a of allow) {
      if (href.startsWith(a)) {
        skip = true
        break
      }
    }
    if (skip) continue
    hits.push({ file: path.relative(ROOT, f).replace(/\\/g, "/"), href })
  }
}

hits.forEach((h) => console.log(`${h.file} -> ${h.href}`))
console.log("total", hits.length)
