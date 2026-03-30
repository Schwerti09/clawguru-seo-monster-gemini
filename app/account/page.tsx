import { cookies } from "next/headers"
import type { Metadata } from "next"
import { verifySessionToken, USER_SESSION_COOKIE } from "@/lib/auth"
import LoginPage from "@/components/pages/LoginPage"
import AccountPage from "@/components/pages/AccountPage"

export const runtime = "nodejs"

export const metadata: Metadata = {
  title: "Account | ClawGuru",
  description:
    "Your ClawGuru account – Saved Checks, Darwinian Feed, Runbook History.",
  robots: { index: false, follow: false },
}

export default async function Account(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParams = await props.searchParams
  const jar = await cookies()
  const token = jar.get(USER_SESSION_COOKIE)?.value
  const session = token ? verifySessionToken(token) : null
  const error =
    typeof searchParams?.error === "string" ? searchParams.error : null

  if (!session) {
    return <LoginPage error={error || undefined} />
  }

  return <AccountPage email={session.email} />
}
