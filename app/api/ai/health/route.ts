import { NextResponse } from "next/server";
import { generateTextOrdered } from "@/lib/ai/providers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const strict = url.searchParams.get("strict") === "1";
  const checks = ["deepseek", "openai", "gemini"] as const;
  const results: Array<{ provider: string; ok: boolean; ms: number; error?: string }> = [];

  for (const p of checks) {
    const t0 = Date.now();
    try {
      const { text } = await generateTextOrdered("You are healthcheck.", "Reply with OK.", p as any, strict);
      results.push({ provider: p, ok: !!text, ms: Date.now() - t0, error: text ? undefined : "no_text" });
    } catch (err) {
      results.push({ provider: p, ok: false, ms: Date.now() - t0, error: err instanceof Error ? err.message : String(err) });
    }
  }

  const envPref = (process.env.AI_PROVIDER_ORDER || process.env.AI_PREFERRED || process.env.AI_PROVIDER || "") as string;
  const active = envPref.split(",")[0]?.trim() || "";
  return NextResponse.json({ activeProvider: active, results });
}
