import { NextRequest, NextResponse } from "next/server"

// Korrekter relativer Pfad für app/api/v1/runbook/[id]/route.ts
import { authenticateApiRequest } from "../../../../../lib/api-auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateApiRequest(req)

  if (!auth.ok) {
    return NextResponse.json(
      { error: (auth as any).error || "Unauthorized" },
      { status: (auth as any).status ?? 401 }
    )
  }

  const { id } = params

  // Deine Runbook-Logik kommt später hier rein
  return NextResponse.json({
    ok: true,
    id: id,
    message: "Runbook details retrieved successfully"
  })
}