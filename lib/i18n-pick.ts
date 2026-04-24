// Centralised helper for legacy `isDE ? X : Y` / `locale === "de" ? X : Y`
// inline ternaries. Rather than touch every component's content model, we
// funnel all such calls through a single function so we can later plug in a
// per-locale translation lookup without changing 300 component files again.
//
// The codemod `scripts/i18n-codemod-pick.js` rewrites legacy patterns to this
// form in-place.
//
// Phase 1 (now):   pick(locale, de, en) → returns de for de, otherwise en.
// Phase 2 (soon):  pick() consults a pre-built autotranslate map keyed by
//                  the English source string, filled by the aya/gemini
//                  pipeline. That upgrade happens inside this file — calls
//                  stay unchanged.

import type { Locale } from "@/lib/i18n"

// Optional autotranslate map — Phase 2 plugs into this. Shape:
// { [locale]: { [englishSourceString]: translatedString } }
// Until that map ships, the import resolves to undefined and we fall through
// to the EN source. No runtime error.
let autotranslateMap: Record<string, Record<string, string>> | undefined

try {
  // dynamic require so the module compiles before the map file exists
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  autotranslateMap = require("@/lib/i18n-autotranslate").default
} catch {
  autotranslateMap = undefined
}

export function pick(locale: Locale, de: string, en: string): string
export function pick(isDE: boolean, de: string, en: string): string
export function pick(ctx: Locale | boolean, de: string, en: string): string {
  // Boolean shortcut used by legacy `isDE` call sites.
  if (typeof ctx === "boolean") return ctx ? de : en
  if (ctx === "de") return de
  if (ctx === "en") return en
  // Phase 2: per-locale map lookup by EN source string.
  const m = autotranslateMap?.[ctx]
  if (m && typeof m[en] === "string" && m[en].length > 0) return m[en]
  return en
}
