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

// Optional autotranslate map — Phase 2 plugs into this by replacing this
// placeholder with a real `import` once the map file exists. Shape:
// { [locale]: { [englishSourceString]: translatedString } }
// Leaving it undefined here means pick() falls through to the EN source —
// identical to the pre-refactor behaviour, no regression.
//
// We deliberately avoid a dynamic `require()` here: Next.js/webpack analyses
// requires statically at build time and errors on missing modules even when
// the call is wrapped in try/catch.
const autotranslateMap: Record<string, Record<string, string>> | undefined = undefined

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
