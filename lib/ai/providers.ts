export type AiProvider = "deepseek" | "openai" | "gemini";

const RATE_LIMIT_RETRIES = 2; // up to 3 total attempts (1 initial + 2 retries)
const RATE_LIMIT_BASE_DELAY_MS = 1000; // 1 s → 2 s → 4 s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns true only when the provider has a non-empty API key configured. */
function hasKey(provider: AiProvider): boolean {
  if (provider === "deepseek") return !!process.env.DEEPSEEK_API_KEY?.trim();
  if (provider === "openai") return !!process.env.OPENAI_API_KEY?.trim();
  if (provider === "gemini") return !!process.env.GEMINI_API_KEY?.trim();
  return false;
}

/**
 * Builds the ordered list of providers to try.
 *
 * Priority:
 *  1. The `preferred` argument (if any key is present)
 *  2. Env-specified order via AI_PREFERRED (comma-separated) or AI_PROVIDER (single value)
 *  3. Hard-coded default: deepseek → openai → gemini
 *
 * Providers whose API key is empty/absent are always excluded so we never
 * send a request to a provider that cannot authenticate.
 */
function buildProviderList(preferred?: AiProvider): AiProvider[] {
  const all: AiProvider[] = ["deepseek", "openai", "gemini"];
  const envPref = (process.env.AI_PREFERRED || process.env.AI_PROVIDER || "").trim();

  // Parse env-specified order, dedup, restrict to known providers
  const envList = envPref
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is AiProvider => (all as string[]).includes(s))
    .filter((v, i, a) => a.indexOf(v) === i);

  // Start from env list; fall back to default order
  let ordered: AiProvider[] = envList.length ? [...envList] : [...all];

  // Append any providers not yet listed (full fallback chain)
  for (const p of all) {
    if (!ordered.includes(p)) ordered.push(p);
  }

  // Promote the explicitly requested provider to the front
  if (preferred) {
    ordered = [preferred, ...ordered.filter((p) => p !== preferred)];
  }

  // Remove providers that have no key – never send unauthenticated requests
  return ordered.filter(hasKey);
}

/** Logs a 429 retry warning with provider name and attempt context. */
function logRateLimit(provider: string, attempt: number, delayMs: number): void {
  console.warn(`[ai/${provider}] Rate-limited (429), retry ${attempt + 1}/${RATE_LIMIT_RETRIES} after ${delayMs}ms`);
}

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
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return null;
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
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
      if (res.status === 429) {
        if (attempt < RATE_LIMIT_RETRIES) {
          logRateLimit("deepseek", attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
          await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }
        console.error("[ai/deepseek] Rate limit exhausted after all retries.");
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return typeof text === "string" && text.trim() ? text.trim() : null;
    } catch {
      return null;
    }
  }
  return null;
}

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
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
      if (res.status === 429) {
        if (attempt < RATE_LIMIT_RETRIES) {
          logRateLimit("openai", attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
          await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }
        console.error("[ai/openai] Rate limit exhausted after all retries.");
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return typeof text === "string" && text.trim() ? text.trim() : null;
    } catch {
      return null;
    }
  }
  return null;
}

async function generateWithGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  // Try preferred model first, then fallbacks to maximize compatibility
  const candidates = [
    process.env.GEMINI_MODEL || "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter(Boolean);
  for (const model of candidates) {
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
          }),
        });
        if (res.status === 429) {
          if (attempt < RATE_LIMIT_RETRIES) {
            logRateLimit(`gemini/${model}`, attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
            await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
            continue;
          }
          console.error(`[ai/gemini/${model}] Rate limit exhausted after all retries.`);
          break; // try next model
        }
        if (!res.ok) break; // try next model
        const data = await res.json();
        const parts = data?.candidates?.[0]?.content?.parts;
        if (!Array.isArray(parts)) break;
        const text = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
        if (typeof text === "string" && text.trim()) return text.trim();
        break;
      } catch {
        break; // try next candidate
      }
    }
  }
  return null;
}

export async function generateOrdered(prompt: string, preferred?: AiProvider): Promise<{ parsed: unknown | null; provider?: AiProvider; raw?: string; }>{
  const providers = buildProviderList(preferred);

  if (providers.length === 0) {
    console.error("[ai] No AI provider with a valid API key is configured. Set DEEPSEEK_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY.");
    return { parsed: null };
  }

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

export async function generateTextOrdered(system: string, user: string, preferred?: AiProvider, strict?: boolean): Promise<{ text: string | null; provider?: AiProvider }>{
  let providers = buildProviderList(preferred);

  if (strict && preferred) {
    providers = providers.filter((p) => p === preferred);
  }

  if (providers.length === 0) {
    console.error("[ai] No AI provider with a valid API key is configured. Set DEEPSEEK_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY.");
    return { text: null };
  }

  for (const p of providers) {
    try {
      if (p === "deepseek") {
        const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
        if (!apiKey) continue;
        const model = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || "deepseek-chat";
        const base = (process.env.DEEPSEEK_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
        let res: Response | null = null;
        for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
          const r = await fetch(`${base}/chat/completions`, {
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
          if (r.status === 429) {
            if (attempt < RATE_LIMIT_RETRIES) {
              logRateLimit("deepseek", attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
              await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
              continue;
            }
            console.error("[ai/deepseek] Rate limit exhausted after all retries.");
            break;
          }
          res = r;
          break;
        }
        if (!res || !res.ok) continue;
        const data = await res.json();
        const text = extractOpenAIText(data);
        if (text) return { text, provider: p };
      } else if (p === "openai") {
        const apiKey = process.env.OPENAI_API_KEY?.trim();
        if (!apiKey) continue;
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
        const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
        let res: Response | null = null;
        for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
          const r = await fetch(`${base}/chat/completions`, {
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
          if (r.status === 429) {
            if (attempt < RATE_LIMIT_RETRIES) {
              logRateLimit("openai", attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
              await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
              continue;
            }
            console.error("[ai/openai] Rate limit exhausted after all retries.");
            break;
          }
          res = r;
          break;
        }
        if (!res || !res.ok) continue;
        const data = await res.json();
        const text = extractOpenAIText(data);
        if (text) return { text, provider: p };
      } else if (p === "gemini") {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (!apiKey) continue;
        const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
        const candidates = [
          process.env.GEMINI_MODEL || "gemini-2.0-flash",
          "gemini-1.5-flash",
          "gemini-1.5-pro",
        ].filter(Boolean);
        let got: string | null = null;
        for (const model of candidates) {
          for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
            try {
              const res = await fetch(`${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: `${system}\n\nUSER REQUEST:\n${user}` }] }],
                  generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
                }),
              });
              if (res.status === 429) {
                if (attempt < RATE_LIMIT_RETRIES) {
                  logRateLimit(`gemini/${model}`, attempt, RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
                  await sleep(RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt));
                  continue;
                }
                console.error(`[ai/gemini/${model}] Rate limit exhausted after all retries.`);
                break; // try next model
              }
              if (!res.ok) break;
              const data = await res.json();
              const text = extractGeminiText(data);
              if (text) { got = text; break; }
              break;
            } catch {
              break;
            }
          }
          if (got) break;
        }
        if (got) return { text: got, provider: p };
      }
    } catch {
      // try next
    }
  }
  return { text: null };
}
