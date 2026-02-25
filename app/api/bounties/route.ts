// WORLD BEAST UPGRADE: app/api/bounties/route.ts
// Bounty submission endpoint – validates, stores (logs), and sends Discord notification.

import { NextRequest, NextResponse } from "next/server"
import { postToDiscord } from "@/lib/discord"

export const runtime = "nodejs"

interface BountySubmission {
  bountyId: string
  email: string
  runbookUrl: string
  description: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Partial<BountySubmission>

    // WORLD BEAST UPGRADE: Basic validation
    if (!body.bountyId || !body.email || !body.runbookUrl || !body.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // WORLD BEAST UPGRADE: Notify Discord ops channel
    await postToDiscord(
      `🎯 **New Bounty Submission!**\n` +
      `Bounty: \`${body.bountyId}\`\n` +
      `Write-up: ${body.runbookUrl}\n` +
      `Description: ${body.description.slice(0, 200)}\n` +
      `Contact: ${body.email.replace(/@.*/, "@...")}` // partial email for privacy
    ).catch(() => undefined)

    // WORLD BEAST UPGRADE: Log submission (replace with DB write when available)
    console.info("[BOUNTY SUBMISSION]", {
      bountyId: body.bountyId,
      runbookUrl: body.runbookUrl,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      ok: true,
      message: "Submission received. Review within 72h.",
      submittedAt: new Date().toISOString(),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
