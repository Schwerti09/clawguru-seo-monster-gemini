import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName())?.value || "";
  const session = token ? verifyAdminToken(token) : null;

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // === ULTRA-STUB – alles hartcodiert, keine externen Calls ===
  return NextResponse.json({
    now: new Date().toISOString(),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org",
    env: {
      hasStripe: true,
      hasGemini: true,
      hasOpenAI: true,
      hasAdmin: true,
      hasWebhook: true,
      hasEmail: true,
    },
    stripe: {
      currency: "eur",
      charges7d: 12450,
      charges24h: 3420,
      chargeCount7d: 47,
      activeSubs: 12,
      trialingSubs: 3,
      lastPayments: [
        { created: Math.floor(Date.now()/1000) - 3600, amount: 2990, currency: "eur", description: "Pro Month" },
        { created: Math.floor(Date.now()/1000) - 86400, amount: 1490, currency: "eur", description: "Daypass" },
      ],
    },
    geminiUsage: { totalTokens: 124000, lastCall: "vor 3 min" },
    indexStatus: {
      indexedPages: 12456,
      targetPages: 100000,
      progressPct: 12,
      lastDailyIndexRun: "2026-03-16T12:00:00Z",
    },
    runbookStats: {
      totalGenerated: 1245678,
      today: 3421,
      topTags: ["hetzner", "ssh", "aws", "hardening"],
    },
  });
}