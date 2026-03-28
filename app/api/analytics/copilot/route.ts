import { NextRequest, NextResponse } from "next/server";
import { logTelemetry } from "@/lib/ops/telemetry";
import { getRequestId } from "@/lib/ops/request-id";

export const dynamic = "force-dynamic";

type AnalyticsEvent = {
  event: "followup_clicked" | "message_sent" | "voice_input" | "sandbox_test";
  data: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  try {
    const requestId = getRequestId(req.headers);
    const { event, data } = (await req.json().catch(() => ({}))) as AnalyticsEvent;

    if (!event) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Track different event types
    if (event === "followup_clicked") {
      logTelemetry("copilot.followup_clicked", {
        requestId,
        followup: (data?.followup || "").toString().substring(0, 200),
        timestamp: new Date().toISOString(),
      });
    } else if (event === "voice_input") {
      logTelemetry("copilot.voice_input", {
        requestId,
        transcriptLength: typeof data?.length === "number" ? data.length : 0,
        timestamp: new Date().toISOString(),
      });
    } else if (event === "sandbox_test") {
      logTelemetry("copilot.sandbox_test", {
        requestId,
        configType: (data?.configType || "unknown").toString(),
        score: typeof data?.score === "number" ? data.score : 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      logTelemetry("copilot.event", {
        requestId,
        event,
        data: JSON.stringify(data).substring(0, 500),
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[analytics/copilot]", error);
    return NextResponse.json({ ok: false }, { status: 200 }); // Don't break if analytics fails
  }
}
