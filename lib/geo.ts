import type { NextRequest } from "next/server"

const COUNTRY_HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-nf-geo",
  "x-country-code",
  "x-geo-country",
]

function normalizeCountry(value?: string | null) {
  if (!value) return undefined
  const trimmed = value.trim().toUpperCase()
  if (trimmed.length !== 2) return undefined
  if (trimmed === "EU" || trimmed === "XX") return undefined
  return trimmed
}

export function getCountryFromRequest(req: NextRequest): string | undefined {
  const geoCountry = normalizeCountry(req.geo?.country)
  if (geoCountry) return geoCountry
  for (const key of COUNTRY_HEADER_KEYS) {
    const headerValue = normalizeCountry(req.headers.get(key))
    if (headerValue) return headerValue
  }
  return undefined
}

export function getCurrencyForCountry(country?: string) {
  const code = normalizeCountry(country)
  if (!code) return "eur"
  if (code === "US") return "usd"
  if (code === "GB") return "gbp"
  if (code === "CH") return "chf"
  if (code === "CA") return "cad"
  if (code === "AU") return "aud"
  if (code === "JP") return "jpy"
  return "eur"
}
