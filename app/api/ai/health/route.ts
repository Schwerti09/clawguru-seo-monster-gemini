import { NextResponse } from "next/server";
import { generateTextOrdered, type AiProvider } from "@/lib/ai/providers";

export const dynamic = "force-dynamic";

const LABELS: Record<AiProvider, string> = {
  deepseek: "DeepSeek",
  gemini: "Gemini",
  openai: "GPT",
};

function hasKey(p: AiProvider): boolean {
  if (p === "deepseek") return !!process.env.DEEPSEEK_API_KEY?.trim();
  if (p === "gemini") return !!process.env.GEMINI_API_KEY?.trim();
  if (p === "openai") return !!process.env.OPENAI_API_KEY?.trim();
  return false;
}

function providerRole(p: AiProvider, available: AiProvider[]): "primary" | "fallback" | "unavailable" {
  if (!hasKey(p)) return "unavailable";
  if (p === available[0]) return "primary";
  return "fallback";
}

function buildActiveChain() {
  const all: AiProvider[] = ["deepseek", "gemini", "openai"];
  const envRaw = (
    process.env.AI_PROVIDER_ORDER ||
    process.env.AI_PREFERRED ||
    process.env.AI_PROVIDER ||
    ""
  ).trim();

  const envList = envRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is AiProvider => (all as string[]).includes(s))
    .filter((v, i, a) => a.indexOf(v) === i);

  const ordered: AiProvider[] = envList.length ? [...envList] : [...all];
  for (const p of all) {
    if (!ordered.includes(p)) ordered.push(p);
  }

  const available = ordered.filter(hasKey);
  return ordered.map((p) => ({
    provider: p,
    label: LABELS[p],
    hasKey: hasKey(p),
    role: providerRole(p, available),
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const full = url.searchParams.get("full") === "1";
  const strict = url.searchParams.get("strict") === "1";

  const chain = buildActiveChain();
  const primary = chain.find((c) => c.role === "primary");
  const firstFallback = chain.find((c) => c.role === "fallback");
  const activeProvider = primary?.provider ?? firstFallback?.provider ?? "";
  const activeLabel = primary
    ? `${primary.label} (primary)`
    : firstFallback
    ? `${firstFallback.label} (fallback)`
    : "No provider configured";

  if (!full) {
    return NextResponse.json({ activeProvider, activeLabel, chain });
  }

  // Full mode: actually call each provider to verify connectivity
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

  return NextResponse.json({ activeProvider, activeLabel, chain, results });
}
