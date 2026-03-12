/**
 * GET  /api/runbook/[slug]/merge-request  – list merge requests (admin)
 * POST /api/runbook/[slug]/merge-request  – submit a merge request
 * PATCH /api/runbook/[slug]/merge-request – admin approve/reject
 *
 * Auth: user session cookie (cg_user) required.
 */

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken, USER_SESSION_COOKIE } from "@/lib/auth"
import { createMergeRequest, getMergeRequests, reviewMergeRequest } from "@/lib/runbook-versions"

export const dynamic = "force-dynamic"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@clawguru.org"

async function getSession() {
  const jar = await cookies()
  const token = jar.get(USER_SESSION_COOKIE)?.value
  return token ? verifySessionToken(token) : null
}

export async function GET(
  _req: NextRequest,
  props: { params: { slug: string } }
) {
  const { slug } = props.params
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }
  const mrs = getMergeRequests(slug)
  // Non-admins only see their own requests
  const filtered = session.email === ADMIN_EMAIL
    ? mrs
    : mrs.filter((mr) => mr.userEmail === session.email)
  return NextResponse.json({ mergeRequests: filtered })
}

export async function POST(
  req: NextRequest,
  props: { params: { slug: string } }
) {
  const { slug } = props.params
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as {
    versionId?: string
    title?: string
    description?: string
  }

  if (!body.versionId || !body.title) {
    return NextResponse.json({ error: "versionId and title are required" }, { status: 400 })
  }

  const mr = createMergeRequest(slug, {
    versionId: body.versionId,
    userEmail: session.email,
    title: body.title,
    description: body.description ?? "",
  })

  return NextResponse.json({ mergeRequest: mr }, { status: 201 })
}

export async function PATCH(
  req: NextRequest,
  props: { params: { slug: string } }
) {
  const { slug } = props.params
  const session = await getSession()
  if (!session || session.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({})) as {
    id?: string
    status?: "approved" | "rejected"
  }

  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 })
  }

  const updated = reviewMergeRequest(slug, body.id, body.status)
  if (!updated) {
    return NextResponse.json({ error: "Merge request not found" }, { status: 404 })
  }

  return NextResponse.json({ mergeRequest: updated })
}
