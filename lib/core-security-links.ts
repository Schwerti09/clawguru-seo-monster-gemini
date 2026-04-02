import { linkFor, type Locale } from "@/lib/i18n"

export function getCoreSecurityLinks(locale: Locale) {
  return {
    check: linkFor(locale, "/check"),
    methodology: linkFor(locale, "/methodik"),
  }
}
