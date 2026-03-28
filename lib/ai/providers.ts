export type AiProvider = "deepseek" | "openai" | "gemini";

function extractJson(text: string): unknown {
  if (!text || typeof text !== "string") return null;
  const cleaned = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();
  if (!cleaned) return null;
  try {
    return JSON.parse(cleaned);
  } catch {
    let braceCount = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (ch === "{") {
        if (braceCount === 0) start = i;
        braceCount++;
      } else if (ch === "}") {
        braceCount--;
        if (braceCount === 0 && start !== -1) {
          end = i + 1;
          break;
        }
      }
    }
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(cleaned.substring(start, end));
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function generateWithDeepseek(prompt: string): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Antworte ausschließlich mit validem JSON ohne Markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Antworte ausschließlich mit validem JSON ohne Markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

async function generateWithGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return null;
    const text = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

export async function generateOrdered(prompt: string, preferred?: AiProvider): Promise<{ parsed: unknown | null; provider?: AiProvider; raw?: string; }>{
  const order: AiProvider[] = ["deepseek", "openai", "gemini"];
  const normalized = (preferred || (process.env.AI_PROVIDER as AiProvider) || "").toLowerCase() as AiProvider;
  const providers = normalized && order.includes(normalized)
    ? ([normalized, ...order.filter((p) => p !== normalized)])
    : order;

  for (const p of providers) {
    let raw: string | null = null;
    if (p === "deepseek") raw = await generateWithDeepseek(prompt);
    else if (p === "openai") raw = await generateWithOpenAI(prompt);
    else if (p === "gemini") raw = await generateWithGemini(prompt);

    if (!raw) continue;
    const parsed = extractJson(raw);
    if (parsed) return { parsed, provider: p, raw };
  }
  return { parsed: null };
}

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

function extractOpenAIText(data: unknown): string {
  const d = data as { choices?: Array<{ message?: { content?: string } }> };
  const cc = d?.choices?.[0]?.message?.content;
  return typeof cc === "string" ? cc.trim() : "";
}

export async function generateTextOrdered(system: string, user: string, preferred?: AiProvider): Promise<{ text: string | null; provider?: AiProvider }>{
  const order: AiProvider[] = ["deepseek", "openai", "gemini"];
  const normalized = (preferred || (process.env.AI_PROVIDER as AiProvider) || "").toLowerCase() as AiProvider;
  const providers = normalized && order.includes(normalized)
    ? ([normalized, ...order.filter((p) => p !== normalized)])
    : order;

  for (const p of providers) {
    try {
      if (p === "deepseek") {
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) continue;
        const model = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "deepseek-chat";
        const base = (process.env.DEEPSEEK_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
        const res = await fetch(`${base}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.35,
            max_tokens: 900,
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = extractOpenAIText(data);
        if (text) return { text, provider: p };
      } else if (p === "openai") {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) continue;
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
        const res = await fetch(`${base}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            temperature: 0.35,
            max_tokens: 900,
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = extractOpenAIText(data);
        if (text) return { text, provider: p };
      } else if (p === "gemini") {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) continue;
        const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
        const res = await fetch(`${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `${system}\n\nUSER REQUEST:\n${user}` }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const text = extractGeminiText(data);
        if (text) return { text, provider: p };
      }
    } catch {
      // try next
    }
  }
  return { text: null };
}
