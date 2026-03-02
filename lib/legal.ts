import { headers } from "next/headers"

export type LegalLocale = "de" | "en"

const COUNTRY_LOCALE_MAP: Record<string, LegalLocale> = {
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
  LU: "de",
}

function localeFromAcceptLanguage(value: string | null): LegalLocale {
  if (!value) return "en"
  const lower = value.toLowerCase()
  if (lower.startsWith("de") || lower.includes(",de")) return "de"
  return "en"
}

export function getLegalLocale(): LegalLocale {
  const hdrs = headers()
  const country =
    hdrs.get("x-vercel-ip-country") ||
    hdrs.get("cf-ipcountry") ||
    hdrs.get("x-geo-country")

  if (country) {
    const mapped = COUNTRY_LOCALE_MAP[country.toUpperCase()]
    if (mapped) return mapped
  }

  return localeFromAcceptLanguage(hdrs.get("accept-language"))
}
