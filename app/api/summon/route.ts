// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// API route: Gemini-powered "OpenAI voice" for the /summon page
// NOTE (2026-03): This route now also provides a GET endpoint that serves real
// runbook search results derived from our local index. Data sources:
// - lib/runbooks-index.ts: exports ensureReadyWithin() and search(q,tags,page,limit)
//   (there is NO exported function named `searchRunbooks`; use `search` instead)
// - lib/runbooks-data.ts: can load public/runbooks.json (build artifact) if needed
// - public/runbooks.json: exists and is materialized at build or fallback via HTTP

import { NextRequest, NextResponse } from "next/server";
import { isApiActive, apiUnavailableResponse } from "@/lib/api-guard";
import { ensureReadyWithin, search as searchRunbooks } from "@/lib/runbooks-index";

export const runtime = "nodejs";

// --- Types & constraints ---
type SwarmType = "attack" | "defense" | "recovery" | "optimize";
type SummonPostBody = { q?: string; swarmType?: SwarmType };
type SummonResult = {
  title: string;
  summary: string;
  slug: string;
  clawScore: number;
  risks: string[];
  steps: string[];
  confidence: number;
  estimatedTime: string;
};

const MAX_Q_LEN = 1200;
const BURST_LIMIT = 10;
const BURST_WINDOW_MS = 60_000;
const DAILY_LIMIT = 1;
const DAY_MS = 86_400_000;

// --- In-memory rate limiting (per instance) ---
declare global {
  // eslint-disable-next-line no-var
  var __SUMMON_RL__: {
    bursts: Map<string, { count: number; reset: number }>;
    daily: Map<string, { count: number; reset: number }>;
  } | undefined;
}
const RL =
  (globalThis as any).__SUMMON_RL__ ||
  ((globalThis as any).__SUMMON_RL__ = { bursts: new Map(), daily: new Map() });

function now() {
  return Date.now();
}

function getClientKey(req: NextRequest): string {
  const cookieKey =
    req.cookies.get("cg_uid")?.value || req.cookies.get("summon_uid")?.value || "";
  if (cookieKey) return `cookie:${cookieKey}`;
  const fwd = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ip = fwd || req.headers.get("x-real-ip") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";
  return `ip:${ip}|ua:${ua.slice(0, 42)}`;
}

function checkBurstLimit(key: string) {
  const rec = RL.bursts.get(key);
  const t = now();
  if (!rec || rec.reset <= t) {
    RL.bursts.set(key, { count: 1, reset: t + BURST_WINDOW_MS });
    return { ok: true, remaining: BURST_LIMIT - 1, reset: t + BURST_WINDOW_MS };
  }
  if (rec.count >= BURST_LIMIT) {
    return { ok: false, remaining: 0, reset: rec.reset };
  }
  rec.count += 1;
  return { ok: true, remaining: BURST_LIMIT - rec.count, reset: rec.reset };
}

function checkDailyLimit(key: string) {
  const rec = RL.daily.get(key);
  const t = now();
  if (!rec || rec.reset <= t) {
    RL.daily.set(key, { count: 1, reset: t + DAY_MS });
    return { ok: true, remaining: DAILY_LIMIT - 1, reset: t + DAY_MS };
  }
  if (rec.count >= DAILY_LIMIT) {
    return { ok: false, remaining: 0, reset: rec.reset };
  }
  rec.count += 1;
  return { ok: true, remaining: DAILY_LIMIT - rec.count, reset: rec.reset };
}

// --- LLM-backed generator (strict JSON) ---
async function generateWithGemini(q: string, swarmType: SwarmType): Promise<SummonResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const schema = [
    "{",
    '"title": string,',
    '"summary": string,',
    '"slug": string,',
    '"clawScore": number,',
    '"risks": string[],',
    '"steps": string[],',
    '"confidence": number,',
    '"estimatedTime": string',
    "}",
  ].join(" ");

  const system = [
    "You are ClawGuru Copilot. Produce a concise, actionable runbook plan.",
    "Return STRICT JSON ONLY; no markdown, no extra text.",
    `JSON schema: ${schema}`,
    "Slug must be URL-safe (kebab-case).",
    "Steps: 4-7 concrete actions (check, fix, verify).",
    "clawScore/confidence are 0..100 integers.",
    "estimatedTime: concise like '15-30 min' or '~1h'.",
  ].join(" ");

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `${system}\n` +
              `SwarmType: ${swarmType}\n` +
              `Problem: ${q}\n` +
              "Respond with pure JSON only.",
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
  } as const;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p?.text)
      .filter(Boolean)
      .join("") || "";
  if (!text) return null;
  try {
    const j = JSON.parse(text) as Partial<SummonResult>;
    const result: SummonResult = {
      title: String(j.title || q).slice(0, 180),
      summary: String(j.summary || "").slice(0, 1200),
      slug: String(j.slug || q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")).slice(0, 120),
      clawScore: Math.max(0, Math.min(100, Number(j.clawScore) || 70)),
      risks: Array.isArray(j.risks) ? j.risks.slice(0, 6).map((s) => String(s).slice(0, 120)) : [],
      steps: Array.isArray(j.steps) && j.steps.length > 0 ? j.steps.slice(0, 8).map((s) => String(s).slice(0, 200)) : [],
      confidence: Math.max(0, Math.min(100, Number(j.confidence) || 70)),
      estimatedTime: String(j.estimatedTime || "~30 min").slice(0, 40),
    };
    if (!result.summary) return null;
    return result;
  } catch {
    return null;
  }
}

function fallbackFromSearch(top: any, q: string): SummonResult {
  const title = String(top?.title || q).slice(0, 180);
  const slug = String(top?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")).slice(0, 120);
  const summary = String(top?.summary || "Operational plan:\nCheck → Fix → Verify.").slice(0, 1200);
  const clawScore = Math.max(0, Math.min(100, Math.round(top?.clawScore ?? 72)));
  const confidence = Math.max(0, Math.min(100, Math.round((clawScore + 70) / 2)));
  const risks = Array.isArray(top?.tags) ? top.tags.slice(0, 6).map((t: any) => String(t)) : [];
  const steps = [
    "Check current exposure and logs",
    "Apply targeted fix (config/policy)",
    "Verify with curl/tests",
    "Rollback plan ready",
  ];
  return {
    title,
    summary,
    slug,
    clawScore,
    risks,
    steps,
    confidence,
    estimatedTime: clawScore >= 80 ? "15-30 min" : "~1h",
  };
}

export async function POST(req: NextRequest) {
  if (!isApiActive()) return apiUnavailableResponse();
  try {
    const key = getClientKey(req);
    const burst = checkBurstLimit(key);
    if (!burst.ok) {
      return NextResponse.json(
        { error: "Too many requests", code: "RATE_LIMITED", retryAt: burst.reset },
        { status: 429 },
      );
    }

    const body = (await req.json().catch(() => ({}))) as SummonPostBody;
    const q = String(body?.q || "").trim().slice(0, MAX_Q_LEN);
    const swarmType: SwarmType =
      body?.swarmType && ["attack", "defense", "recovery", "optimize"].includes(body.swarmType)
        ? (body.swarmType as SwarmType)
        : "defense";

    if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

    const daily = checkDailyLimit(key);
    if (!daily.ok) {
      return NextResponse.json(
        {
          error: "Daily free limit reached",
          code: "FREE_LIMIT",
          message: "You have used your free summon for today. Get a Day Pass for unlimited use.",
          resetAt: daily.reset,
        },
        { status: 429 },
      );
    }

    let payload: SummonResult | null = null;
    try {
      payload = await generateWithGemini(q, swarmType);
    } catch {
      // ignore and fallback
    }

    if (!payload) {
      await ensureReadyWithin(1200);
      const res = searchRunbooks(q, [], 1, 10);
      const top = Array.isArray(res?.items) && res.items.length > 0 ? res.items[0] : null;
      payload = fallbackFromSearch(top, q);
    }

    const enriched = {
      ...payload,
      runbookUrl: `/runbook/${encodeURIComponent(payload.slug)}`,
      summonUrl: `/summon?q=${encodeURIComponent(payload.title)}`,
    };
    const resp = NextResponse.json(enriched, { status: 200 });
    resp.headers.set("Cache-Control", "no-store");
    resp.headers.set("X-RateLimit-Remaining", String(Math.max(0, burst.remaining)));
    return resp;
  } catch (err) {
    console.error("[/api/summon:POST] error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/summon?q=...&limit=5&min_score=0
// Returns structured runbook matches using the lightweight in-memory index
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get("q") || "").toString().trim()
    const rawLimit = Math.max(1, parseInt(url.searchParams.get("limit") || "5", 10) || 5)
    const limit = Math.min(20, rawLimit)
    const minScore = Math.max(0, parseInt(url.searchParams.get("min_score") || "0", 10) || 0)

    await ensureReadyWithin(1200)
    const base = searchRunbooks(q, [], 1, 50)
    const filtered = (base.items || [])
      .filter((r) => typeof r.clawScore === "number" ? r.clawScore >= minScore : true)
      .sort((a, b) => (b.clawScore ?? 0) - (a.clawScore ?? 0))
      .slice(0, limit)

    // Aggregate affected services (unique tags, top 5 by frequency)
    const freq = new Map<string, number>()
    for (const r of filtered) {
      for (const t of (r.tags || [])) freq.set(t, (freq.get(t) || 0) + 1)
    }
    const affected_services = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t)

    const avg = filtered.length
      ? Math.round(
          Math.max(0, Math.min(100,
            filtered.reduce((s, r) => s + (r.clawScore ?? 50), 0) / filtered.length
          ))
        )
      : 0

    const payload = {
      problem: filtered[0]?.title || q,
      relevant_runbooks: filtered.map((r) => ({
        slug: r.slug,
        title: r.title,
        clawScore: r.clawScore ?? 0,
        summary: r.summary,
        tags: r.tags || [],
        runbookUrl: `/runbook/${encodeURIComponent(r.slug)}`,
        summonUrl: `/summon?q=${encodeURIComponent(r.title)}`,
      })),
      affected_services,
      confidence: avg,
      total_available: base.total || 0,
    }
    const res = NextResponse.json(payload)
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30")
    return res
  } catch (err) {
    console.error("[/api/summon] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
