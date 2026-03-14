const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"))
}

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function flattenKeys(obj, prefix = "") {
  const out = []
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k
    if (isPlainObject(v)) {
      out.push(...flattenKeys(v, next))
    } else {
      out.push(next)
    }
  }
  return out
}

function uniq(arr) {
  return Array.from(new Set(arr))
}

function getByPath(obj, keyPath) {
  return keyPath.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) return acc[part]
    return undefined
  }, obj)
}

function listFilesRecursive(dir, exts, ignoreDirs) {
  const out = []
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ignoreDirs.has(ent.name)) continue
      out.push(...listFilesRecursive(abs, exts, ignoreDirs))
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase()
      if (exts.has(ext)) out.push(abs)
    }
  }
  return out
}

function scanForUnprefixedHrefs(files) {
  const findings = []

  // Detect literal href values that start with "/" (but not "//")
  // We intentionally do NOT flag template strings like href={`${prefix}/foo`}.
  const re = /href\s*=\s*(?:\{\s*)?(?:"(\/[^"\n\r]*)"|'(\/[^'\n\r]*)'|`(\/[^`\n\r]*)`)/g

  const allowPrefixes = [
    "//",
    "/api/",
    "/admin",
    "/_next/",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemaps/",
    "/sitemap/",
    "/maintenance",
    "/checkout",
    "/success",
    "/favicon.ico",
  ]

  for (const file of files) {
    const rel = path.relative(ROOT, file)
    if (rel.startsWith(`components${path.sep}admin${path.sep}`)) continue
    const txt = fs.readFileSync(file, "utf8")

    let m
    while ((m = re.exec(txt))) {
      const val = m[1] || m[2] || m[3] || ""
      if (!val.startsWith("/")) continue
      if (val.startsWith("//")) continue

      const allowed = allowPrefixes.some((p) => val.startsWith(p))
      if (allowed) continue

      // Locale-prefixed paths are ok: /de/..., /en/... etc.
      if (/^\/[a-z]{2}\//i.test(val)) continue
      // Template-literal locale prefixes are ok: `/${locale}/...`
      if (val.startsWith("/${")) continue

      const idx = m.index
      const line = txt.slice(0, idx).split(/\r?\n/).length
      findings.push({ file: rel, line, href: val })
    }
  }

  return findings
}

function parseSupportedLocalesFromI18nTs(i18nTsText) {
  const m = i18nTsText.match(/SUPPORTED_LOCALES\s*:\s*Locale\[\]\s*=\s*\[([^\]]+)\]/)
  if (!m) return null
  const raw = m[1]
  const locales = []
  const re = /"([a-z]{2})"/g
  let mm
  while ((mm = re.exec(raw))) locales.push(mm[1])
  return uniq(locales)
}

function parseHreflangKeysFromI18nTs(i18nTsText) {
  const m = i18nTsText.match(
    /LOCALE_HREFLANG\s*:\s*(?:Partial<)?Record<Locale,\s*string>(?:>)?\s*=\s*\{([\s\S]*?)\n\}/
  )
  if (!m) return null
  const raw = m[1]
  const keys = []
  const re = /\n\s*([a-z]{2})\s*:/g
  let mm
  while ((mm = re.exec(raw))) keys.push(mm[1])
  return uniq(keys)
}

function parseDefaultLocaleFromI18nTs(i18nTsText) {
  const m = i18nTsText.match(/DEFAULT_LOCALE\s*:\s*Locale\s*=\s*"([a-z]{2})"/)
  return m?.[1] ?? null
}

function main() {
  const errors = []
  const warnings = []

  const strictI18n = process.env.STRICT_I18N === "1"
  const strictLinks = process.env.STRICT_LINKS === "1"
  const defaultLocale = process.env.DEFAULT_LOCALE || "de"

  // 1) Translation completeness
  const dictDir = path.join(ROOT, "dictionaries")
  const enPath = path.join(dictDir, "en.json")
  const en = readJson(enPath)
  const enKeys = uniq(flattenKeys(en)).sort()

  const dictFiles = fs.readdirSync(dictDir).filter((f) => f.endsWith(".json"))
  const dictLocales = dictFiles.map((f) => path.basename(f, ".json"))

  const TIER_A_KEYS = [
    "common.ctaDashboard",
    "common.ctaMissionControl",
    "nav.securityCheck",
    "nav.pricing",
    "nav.emergency",
    "nav.about",
    "nav.login",
    "hero.subtitle",
    "hero.ctaMycelium",
    "home.clawVerseTitle",
    "home.clawVerseDesc",
    "home.clawVerseCta",
    "home.myceliumTitle",
    "home.myceliumDesc",
    "home.openMycelium",
    "pricing.title",
    "pricing.subtitle",
    "pricing.dayPassDesc",
    "pricing.dayPassBtn",
    "pricing.proDesc",
    "pricing.proBtn",
    "pricing.teamDesc",
    "pricing.teamBtn",
    "pricing.enterpriseDesc",
    "pricing.instantAccess",
    "pricing.noAccount",
    "pricing.paymentIssue",
    "pricing.recoverLink",
    "copilot.greeting",
    "copilot.placeholder",
    "copilot.error",
    "copilot.send",
    "copilot.tip",
  ]

  for (const f of dictFiles) {
    if (f === "en.json") continue
    const abs = path.join(dictDir, f)
    const locale = path.basename(f, ".json")
    const data = readJson(abs)
    const keys = new Set(flattenKeys(data))

    const missing = enKeys.filter((k) => !keys.has(k))
    if (missing.length) {
      const msg =
        `[i18n] Missing keys in dictionaries/${f} (vs en.json):\n` +
        missing.map((k) => `- ${k}`).join("\n")

      ;(strictI18n ? errors : warnings).push(msg)
    }

    const untranslatedTierA = TIER_A_KEYS.filter((key) => {
      const enValue = getByPath(en, key)
      const localeValue = getByPath(data, key)
      return typeof enValue === "string" && typeof localeValue === "string" && enValue === localeValue
    })
    if (untranslatedTierA.length) {
      const msg =
        `[i18n] Untranslated Tier-A keys in dictionaries/${f} (same as en.json):\n` +
        untranslatedTierA.map((k) => `- ${k}`).join("\n")
      ;(strictI18n ? errors : warnings).push(msg)
    }
  }

  // 2) Unprefixed href scan
  const exts = new Set([".ts", ".tsx", ".js", ".jsx"]) 
  const ignoreDirs = new Set(["node_modules", ".next", ".git", "public"]) 
  const appFiles = listFilesRecursive(path.join(ROOT, "app", "[lang]"), exts, ignoreDirs)
  const compFiles = listFilesRecursive(path.join(ROOT, "components"), exts, ignoreDirs)
  const hrefFindings = scanForUnprefixedHrefs([...appFiles, ...compFiles])
  if (hrefFindings.length) {
    const msg =
      `[i18n] Found non-locale-prefixed internal links (literal href starting with "/"):\n` +
      hrefFindings
        .slice(0, 200)
        .map((f) => `- ${f.file}:${f.line} href=${JSON.stringify(f.href)}`)
        .join("\n") +
      (hrefFindings.length > 200 ? `\n...and ${hrefFindings.length - 200} more` : "")

    ;(strictLinks ? errors : warnings).push(msg)
  }

  // 3) hreflang sanity
  const i18nTsPath = path.join(ROOT, "lib", "i18n.ts")
  const i18nTsText = fs.readFileSync(i18nTsPath, "utf8")

  const locales = parseSupportedLocalesFromI18nTs(i18nTsText)
  const hreflangKeys = parseHreflangKeysFromI18nTs(i18nTsText)
  const defaultLocaleFromCode = parseDefaultLocaleFromI18nTs(i18nTsText)
  if (!locales) {
    errors.push("[i18n] Could not parse SUPPORTED_LOCALES from lib/i18n.ts")
  }
  if (!hreflangKeys) {
    errors.push("[i18n] Could not parse LOCALE_HREFLANG keys from lib/i18n.ts")
  }
  if (locales && hreflangKeys) {
    const missing = locales.filter((l) => !hreflangKeys.includes(l))
    const extra = hreflangKeys.filter((l) => !locales.includes(l))
    if (missing.length || extra.length) {
      errors.push(
        `[i18n] LOCALE_HREFLANG keys mismatch with SUPPORTED_LOCALES\n` +
          `Missing: ${missing.join(", ") || "(none)"}\n` +
          `Extra: ${extra.join(", ") || "(none)"}`
      )
    }
  }

  // 4) dictionary coverage for all supported locales
  if (locales) {
    const missingDictionaryLocales = locales.filter((l) => !dictLocales.includes(l))
    const extraDictionaryLocales = dictLocales.filter((l) => !locales.includes(l))
    if (missingDictionaryLocales.length || extraDictionaryLocales.length) {
      errors.push(
        `[i18n] dictionaries/*.json mismatch with SUPPORTED_LOCALES\n` +
          `Missing dictionaries: ${missingDictionaryLocales.join(", ") || "(none)"}\n` +
          `Extra dictionaries: ${extraDictionaryLocales.join(", ") || "(none)"}`
      )
    }
  }

  // 5) default locale consistency
  if (defaultLocaleFromCode && locales && !locales.includes(defaultLocaleFromCode)) {
    errors.push(`[i18n] DEFAULT_LOCALE (${defaultLocaleFromCode}) is not part of SUPPORTED_LOCALES`)
  }
  if (defaultLocale && locales && !locales.includes(defaultLocale)) {
    warnings.push(`[i18n] ENV DEFAULT_LOCALE (${defaultLocale}) is not part of SUPPORTED_LOCALES`)
  }

  if (errors.length) {
    console.error(errors.join("\n\n"))
    if (warnings.length) {
      console.error("\n\n---\n\n" + warnings.join("\n\n"))
    }
    process.exit(1)
  }

  if (warnings.length) {
    console.warn(warnings.join("\n\n"))
  }

  console.log("[i18n] OK")
}

main()
