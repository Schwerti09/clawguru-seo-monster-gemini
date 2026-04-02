const fs = require("node:fs")
const path = require("node:path")

const ROOT = process.cwd()
const TARGET = path.join(ROOT, "app", "[lang]")

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full, out)
      continue
    }
    if (entry.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) out.push(full)
  }
  return out
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/")
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.log("check-seo-canonicals: app/[lang] not found, skipping")
    process.exit(0)
  }

  const files = walk(TARGET)
  const problems = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const lines = content.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.includes("canonical")) continue
      // Catch common placeholder patterns in canonical values:
      // "/foo/:slug", "/tools/check-:service_name", etc.
      if (/:([a-zA-Z_][a-zA-Z0-9_]*)/.test(line)) {
        problems.push({ file: rel(file), line: i + 1, text: line.trim() })
      }
    }
  }

  if (problems.length > 0) {
    console.error("SEO canonical check FAILED: placeholder tokens found")
    for (const p of problems) {
      console.error(`- ${p.file}:${p.line} -> ${p.text}`)
    }
    process.exit(1)
  }

  console.log("SEO canonical check OK: no placeholder tokens detected")
}

main()

