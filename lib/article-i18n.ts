/**
 * lib/article-i18n.ts
 *
 * Lightweight translation helper for SEO article pages.
 * Replaces the binary `isGerman ? de : en` pattern with a proper
 * locale-aware lookup that supports all 15+ locales.
 *
 * Usage:
 *   import { t } from "@/lib/article-i18n"
 *   // ...
 *   const locale = params.lang as Locale
 *   // In JSX:
 *   {t(locale, "Deutsch", "English")}
 *
 * All locales not explicitly provided fall back to the English string.
 * German (de) always uses the first argument.
 */

import type { Locale } from "@/lib/i18n"

export type LocaleStrings = Partial<Record<Locale, string>>

/**
 * Returns the appropriate string for the given locale.
 * - `de`  → German string (first arg)
 * - Any other locale → English string (second arg) as fallback.
 *   You can pass additional locale-specific strings via the `extra` map
 *   to override the English fallback for a specific locale.
 *
 * @param locale  - Current page locale
 * @param de      - German text
 * @param en      - English text (default for all non-German locales)
 * @param extra   - Optional per-locale overrides, e.g. { fr: "Français", es: "Español" }
 */
export function t(
  locale: Locale,
  de: string,
  en: string,
  extra?: LocaleStrings
): string {
  if (locale === "de") return de
  if (extra && extra[locale] !== undefined) return extra[locale] as string
  return en
}
