import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/access-token"
import { USER_SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

/**
 * Stable key for dashboard rows: Stripe customer id when checkout-activated,
 * otherwise session email (e.g. admin cookie) — matches app/dashboard/page user.id.
 */
export type DashboardPrincipal = {
  customerKey: string
  /** Access plan from claw_access; null if only claw_session */
  plan: string | null
  email: string
}

type CookieJar = { get: (name: string) => { value?: string } | undefined }

/** Shared by server pages and Route Handlers (pass `cookies()` or `req.cookies`). */
export function parseDashboardPrincipal(jar: CookieJar): DashboardPrincipal | null {
  const accessToken = jar.get("claw_access")?.value
  const sessionToken = jar.get(USER_SESSION_COOKIE)?.value

  const access = accessToken ? verifyAccessToken(accessToken) : null
  const session = sessionToken ? verifySessionToken(sessionToken) : null

  if (!access && !session) return null

  const customerKey = access?.customerId ?? session?.email ?? ""
  if (!customerKey) return null

  const email = session?.email ?? access?.customerId ?? "user"
  const plan = access?.plan ?? null

  return { customerKey, plan, email }
}

export async function getDashboardPrincipal(): Promise<DashboardPrincipal | null> {
  const jar = await cookies()
  return parseDashboardPrincipal(jar)
}
