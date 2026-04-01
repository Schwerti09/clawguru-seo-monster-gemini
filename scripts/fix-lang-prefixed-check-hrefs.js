/**
 * Prefix /check and /intel hrefs with locale in app/[lang]/.../page.tsx
 * Run: node scripts/fix-lang-prefixed-check-hrefs.js
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const LANG = path.join(ROOT, "app", "[lang]")

const LOCALE_LINE =
  '  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;'
const PREFIX_LINE = "  const prefix = `/${locale}`;"

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (ent.name === "page.tsx") out.push(p)
  }
  return out
}

function patchFile(absPath) {
  let s = fs.readFileSync(absPath, "utf8")
  if (!s.includes('href="/check"') && !s.includes('href="/intel"')) return false

  const exportIdx = s.indexOf("export default")
  if (exportIdx === -1) return false

  const fromExport = s.slice(exportIdx)
  const paramMarker = fromExport.indexOf("params: { lang: string }")
  if (paramMarker === -1) {
    console.warn("skip (no params.lang):", path.relative(ROOT, absPath))
    return false
  }

  const closeParams = fromExport.indexOf("}) {", paramMarker)
  if (closeParams === -1) {
    console.warn("skip (no }) {:", path.relative(ROOT, absPath))
    return false
  }

  const bodyInnerStart = exportIdx + closeParams + "}) {".length
  const tail = s.slice(bodyInnerStart)
  const retMatch = /\n(\s*)return\s*\(/.exec(tail)
  if (!retMatch) {
    console.warn("skip (no return):", path.relative(ROOT, absPath))
    return false
  }

  const insertPoint = bodyInnerStart + retMatch.index
  const beforeReturn = s.slice(0, insertPoint)
  const fromReturn = s.slice(insertPoint)

  if (!beforeReturn.includes("const prefix = `/${locale}`")) {
    // Single-line locale only; multiline `const locale = (` blocks need prefix added manually after the block.
    const localeNeedle =
      'const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale;'
    const inner = beforeReturn.slice(bodyInnerStart)
    if (inner.includes(localeNeedle)) {
      const rel = inner.indexOf(localeNeedle) + localeNeedle.length
      s =
        beforeReturn.slice(0, bodyInnerStart + rel) +
        "\n" +
        PREFIX_LINE +
        beforeReturn.slice(bodyInnerStart + rel) +
        fromReturn
    } else {
      s = beforeReturn + "\n" + LOCALE_LINE + "\n" + PREFIX_LINE + fromReturn
    }
  } else {
    s = beforeReturn + fromReturn
  }

  s = s.replaceAll('href="/check"', "href={`${prefix}/check`}")
  s = s.replaceAll('href="/intel"', "href={`${prefix}/intel`}")

  fs.writeFileSync(absPath, s)
  return true
}

const pages = walk(LANG).filter((p) => {
  const t = fs.readFileSync(p, "utf8")
  return t.includes('href="/check"') || t.includes('href="/intel"')
})

let n = 0
for (const p of pages) {
  if (patchFile(p)) {
    n++
    console.log("patched", path.relative(ROOT, p))
  }
}
console.log("done,", n, "files")
