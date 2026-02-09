import { NextRequest, NextResponse } from "next/server";

type ReqBody = {
  prompt?: string;
};

function extractGeminiText(data: any): string {
  // Gemini: candidates[0].content.parts[].text
  const cand = data?.candidates?.[0];
  const parts = cand?.content?.parts;
  if (Array.isArray(parts)) {
    const txt = parts
      .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
      .join("")
      .trim();
    if (txt) return txt;
  }
  // Some responses use: candidates[0].content.text
  const t = cand?.content?.text;
  if (typeof t === "string" && t.trim()) return t.trim();
  return "";
}

function extractOutputText(data: any): string {
  // Responses API: data.output[...].content[...].text
  const out = data?.output;
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
  // Chat Completions fallback shape
  const cc = data?.choices?.[0]?.message?.content;
  if (typeof cc === "string" && cc.trim()) return cc.trim();
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json().catch(() => ({}))) as ReqBody;
    const p = (prompt || "").toString().slice(0, 12000);
    if (!p.trim()) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

    const system = [
      "You are ClawGuru Runbook Factory.",
      "Return a practical, step-by-step runbook with clear sections:",
      "1) Goal 2) Preconditions 3) Steps 4) Verification 5) Rollback 6) Notes.",
      "Keep it concise and actionable.",
    ].join("\n");

    if (provider === "gemini") {
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY missing on server (Netlify env vars)" },
          { status: 500 },
        );
      }

      const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
      const base = (
        process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
      ).replace(/\/$/, "");

      const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(
        geminiKey,
      )}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${system}\n\nUSER REQUEST:\n${p}` }],
            },
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 900,
          },
        }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        return NextResponse.json(
          { error: "Gemini request failed", status: res.status, detail: t.slice(0, 2000) },
          { status: 502 },
        );
      }

      const data = await res.json();
      const text = extractGeminiText(data);
      if (!text) return NextResponse.json({ error: "No output" }, { status: 502 });
      return NextResponse.json({ text });
    }

    // Default: OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY missing on server (Netlify env vars)" },
        { status: 500 },
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

    // Prefer Responses API (modern). If the account/model doesn't support it, OpenAI will return 404/400,
    // and we fall back to Chat Completions.
    const responsesUrl = `${base}/responses`;
    const res = await fetch(responsesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: system },
          { role: "user", content: p },
        ],
        temperature: 0.35,
        max_output_tokens: 900,
      }),
    });

    let data: any = null;
    if (res.ok) {
      data = await res.json();
    } else {
      // Fallback to chat completions
      const chatUrl = `${base}/chat/completions`;
      const res2 = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: p },
          ],
          temperature: 0.35,
          max_tokens: 900,
        }),
      });
      if (!res2.ok) {
        const t = await res2.text().catch(() => "");
        return NextResponse.json(
          { error: "OpenAI request failed", status: res2.status, detail: t.slice(0, 2000) },
          { status: 502 },
        );
      }
      data = await res2.json();
    }

    const text = extractOutputText(data);
    if (!text) return NextResponse.json({ error: "No output" }, { status: 502 });

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
