import fs from "fs"
import path from "path"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "./i18n"

export type Dictionary = Record<string, any>

function readJson<T = any>(absPath: string): T | null {
  try {
    if (!fs.existsSync(absPath)) return null
    return JSON.parse(fs.readFileSync(absPath, "utf8")) as T
  } catch {
    return null
  }
}

function dictPath(locale: string) {
  return path.join(process.cwd(), "dictionaries", `${locale}.json`)
}

function deepMerge<A extends Record<string, any>, B extends Record<string, any>>(a: A, b: B): A & B {
  const out: any = Array.isArray(a) ? [...a] : { ...a }
  for (const [k, v] of Object.entries(b)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object" && out[k] !== null) {
      out[k] = deepMerge(out[k], v)
    } else {
      out[k] = v
    }
  }
  return out
}

export async function getDictionary(input: string | Locale): Promise<Dictionary> {
  const lang = (SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : DEFAULT_LOCALE) as Locale
  const base = readJson<Dictionary>(dictPath(DEFAULT_LOCALE)) || {}
  if (lang === DEFAULT_LOCALE) return base
  const target = readJson<Dictionary>(dictPath(lang)) || {}
  return deepMerge(base, target)
}

export function hasDictionary(input: string | Locale): boolean {
  const lang = (SUPPORTED_LOCALES.includes(input as Locale) ? (input as Locale) : DEFAULT_LOCALE) as Locale
  return fs.existsSync(dictPath(lang))
}
