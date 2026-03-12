const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const DICT_DIR = path.join(ROOT, "dictionaries")
const EN_PATH = path.join(DICT_DIR, "en.json")

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone)
  if (isPlainObject(value)) {
    const out = {}
    for (const [k, v] of Object.entries(value)) out[k] = deepClone(v)
    return out
  }
  return value
}

function fillMissingKeys(base, target, prefix = "") {
  let inserted = 0

  for (const [key, baseValue] of Object.entries(base)) {
    const pathKey = prefix ? `${prefix}.${key}` : key

    if (!(key in target)) {
      target[key] = deepClone(baseValue)
      inserted += 1
      continue
    }

    const targetValue = target[key]
    if (isPlainObject(baseValue) && isPlainObject(targetValue)) {
      inserted += fillMissingKeys(baseValue, targetValue, pathKey)
    }
  }

  return inserted
}

function main() {
  if (!fs.existsSync(EN_PATH)) {
    console.error(`[sync-dictionaries] Missing baseline file: ${path.relative(ROOT, EN_PATH)}`)
    process.exit(1)
  }

  const en = readJson(EN_PATH)
  const files = fs.readdirSync(DICT_DIR).filter((f) => f.endsWith(".json") && f !== "en.json")

  let totalInserted = 0
  let changedFiles = 0

  for (const file of files) {
    const abs = path.join(DICT_DIR, file)
    const data = readJson(abs)
    const inserted = fillMissingKeys(en, data)

    if (inserted > 0) {
      writeJson(abs, data)
      changedFiles += 1
      totalInserted += inserted
      console.log(`[sync-dictionaries] ${file}: +${inserted} keys`) 
    } else {
      console.log(`[sync-dictionaries] ${file}: no changes`)
    }
  }

  console.log(`[sync-dictionaries] done: ${changedFiles}/${files.length} files changed, ${totalInserted} keys inserted`)
}

main()
