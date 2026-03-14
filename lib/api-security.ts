import type { NextRequest } from "next/server"

export function isFeatureEnabled(flagName: string): boolean {
  const raw = (process.env[flagName] ?? "").trim().toLowerCase()
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on"
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? ""
  if (!auth.toLowerCase().startsWith("bearer ")) return null
  const token = auth.slice(7).trim()
  return token || null
}

export function isAuthorizedBySharedSecret(
  req: NextRequest,
  envName: string,
  queryParamName = "secret"
): boolean {
  const secret = process.env[envName]
  if (!secret) return false

  const bearer = extractBearerToken(req)
  if (bearer === secret) return true

  const queryToken = req.nextUrl.searchParams.get(queryParamName)?.trim() ?? ""
  return queryToken.length > 0 && queryToken === secret
}
