import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { getEnterpriseRequests } from "@/lib/enterprise-requests"

export const runtime = "nodejs"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function GET() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  return NextResponse.json({ requests: getEnterpriseRequests() })
}
