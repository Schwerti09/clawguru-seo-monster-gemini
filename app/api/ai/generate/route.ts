import { NextRequest, NextResponse } from "next/server";
import { isApiActive, apiUnavailableResponse } from "@/lib/api-guard";
import { generateTextOrdered } from "@/lib/ai/providers";

export const dynamic = "force-dynamic";

function extractGeminiText(data: unknown): string {
  const d = data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }>; text?: string } }> };
  const cand = d?.candidates?.[0];
  const parts = cand?.content?.parts;
  if (Array.isArray(parts)) {
    const txt = parts.map((p) => (typeof p?.text === "string" ? p.text : "")).join("").trim();
    if (txt) return txt;
  }
  const t = cand?.content?.text;
  if (typeof t === "string" && t.trim()) return t.trim();
  return "";
}

// BULLETPROOF readPrompt (JSON -> Raw Text -> URL-encoded -> Plain)
async function readPrompt(req: NextRequest): Promise<string> {
  const contentType = (req.headers.get("content-type") || "").toLowerCase();

  // 1) JSON zuerst (clone to avoid consuming body stream)
  try {
    const body = (await req.clone().json()) as Record<string, unknown>;
    const p = (body as any)?.prompt ?? (body as any)?.message ?? (body as any)?.text;
    if (typeof p === "string" && p.trim()) return p.trim().slice(0, 12000);
  } catch {}

  // 2) Raw Text + Fallbacks (clone as well)
  let raw = "";
  try { raw = await req.clone().text(); } catch {}
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const body = JSON.parse(trimmed) as Record<string, unknown>;
      const p = (body as any)?.prompt ?? (body as any)?.message;
      if (typeof p === "string" && p.trim()) return p.trim().slice(0, 12000);
    } catch {}
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const parts = trimmed.split("&");
    for (const part of parts) {
      const [k, v] = part.split("=");
      if ((k === "prompt" || k === "message") && v) {
        return decodeURIComponent(v.replace(/\+/g, " ")).trim().slice(0, 12000);
      }
    }
  }

  return trimmed.slice(0, 12000);
}

function extractOutputText(data: unknown): string {
  const d = data as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }>; choices?: Array<{ message?: { content?: string } }> };
  const out = d?.output;
  if (Array.isArray(out)) {
    let buf = "";
    for (const item of out) {
      const content = item?.content;
      if (Array.isArray(content)) {
        for (const c of content) {
          if (c?.type === "output_text" && typeof c?.text === "string") buf += c.text;
          if (typeof c?.text === "string" && !c?.type) buf += c.text;
        }
      }
    }
    if (buf.trim()) return buf.trim();
  }
  const cc = d?.choices?.[0]?.message?.content;
  if (typeof cc === "string" && cc.trim()) return cc.trim();
  return "";
}

export async function POST(req: NextRequest) {
  if (!isApiActive()) return apiUnavailableResponse();
  try {
    const p = await readPrompt(req);
    if (!p.trim()) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    const system = [
      "You are ClawGuru Runbook Factory.",
      "Return a practical, step-by-step runbook with clear sections:",
      "1) Goal 2) Preconditions 3) Steps 4) Verification 5) Rollback 6) Notes.",
      "Keep it concise and actionable.",
    ].join("\n");

    const { text } = await generateTextOrdered(system, p);
    if (!text) return NextResponse.json({ error: "No output" }, { status: 502 });
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
