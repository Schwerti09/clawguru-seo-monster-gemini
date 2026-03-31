import { getCircuitBreaker } from "@/lib/circuit-breaker";

/** Type-safe enum of all supported AI providers. */
export type AiProvider = "deepseek" | "gemini" | "openai";

/** Human-readable labels used in log output. */
const PROVIDER_LABEL: Record<AiProvider, string> = {
  deepseek: "DeepSeek",
  gemini: "Gemini",
  openai: "GPT",
};

/**
 * Circuit-breaker options per provider.
 * After 3 consecutive failures the provider is paused for 30 seconds,
 * then a single probe call is allowed through (HALF_OPEN state).
 */
const BREAKER_OPTIONS = { failureThreshold: 3, recoveryTimeoutMs: 30_000 };

/** HTTP status codes that indicate a permanent or quota failure → try next provider. */
const SKIP_STATUSES = new Set([400, 401, 403, 404, 429, 500, 502, 503, 504]);

const RATE_LIMIT_RETRIES = 2; // up to 3 total attempts per provider (1 initial + 2 retries)
const RATE_LIMIT_BASE_DELAY_MS = 1_000; // 1 s → 2 s → 4 s

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
 *  2. AI_PROVIDER_ORDER env var (comma-separated, e.g. "deepseek,gemini,openai")
 *  3. AI_PREFERRED env var (legacy alias for AI_PROVIDER_ORDER)
 *  4. Hard-coded default: deepseek → gemini → openai
 *
 * Providers whose API key is empty/absent are always excluded so we never
 * send a request to a provider that cannot authenticate.
 */
function buildProviderList(preferred?: AiProvider): AiProvider[] {
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

  let ordered: AiProvider[] = envList.length ? [...envList] : [...all];

  // Append any providers not yet listed (full fallback chain)
  for (const p of all) {
    if (!ordered.includes(p)) ordered.push(p);
  }

  // Promote the explicitly requested provider to the front
  if (preferred) {
    ordered = [preferred, ...ordered.filter((p) => p !== preferred)];
  }

  // Remove providers that have no key
  return ordered.filter(hasKey);
}

/** Logs a 429 retry warning with provider name and attempt context. */
function logRateLimit(provider: string, attempt: number, delayMs: number): void {
  console.warn(`[AI] ${provider} rate-limited (429), retry ${attempt + 1}/${RATE_LIMIT_RETRIES} after ${delayMs}ms`);
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

/** Internal call result carrying the HTTP status for circuit-breaker decisions. */
type CallResult = { text: string | null; status: number };

async function callDeepseek(messages: Array<{ role: string; content: string }>): Promise<CallResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return { text: null, status: 401 };
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: 0.35, stream: false }),
      });
      if (res.status === 429) {
        if (attempt < RATE_LIMIT_RETRIES) {
          const delay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
          logRateLimit("DeepSeek", attempt, delay);
          await sleep(delay);
          continue;
        }
        console.error("[AI] DeepSeek rate limit exhausted after all retries.");
        return { text: null, status: 429 };
      }
      if (!res.ok) return { text: null, status: res.status };
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return { text: typeof text === "string" && text.trim() ? text.trim() : null, status: res.status };
    } catch {
      return { text: null, status: 0 };
    }
  }
  return { text: null, status: 429 };
}

async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<CallResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return { text: null, status: 401 };
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;
  for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: 0.35, stream: false }),
      });
      if (res.status === 429) {
        if (attempt < RATE_LIMIT_RETRIES) {
          const delay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
          logRateLimit("GPT", attempt, delay);
          await sleep(delay);
          continue;
        }
        console.error("[AI] GPT rate limit exhausted after all retries.");
        return { text: null, status: 429 };
      }
      if (!res.ok) return { text: null, status: res.status };
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content;
      return { text: typeof text === "string" && text.trim() ? text.trim() : null, status: res.status };
    } catch {
      return { text: null, status: 0 };
    }
  }
  return { text: null, status: 429 };
}

async function callGemini(prompt: string): Promise<CallResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { text: null, status: 401 };
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "");
  // Try preferred model first, then fallbacks to maximize compatibility
  const candidates = [
    process.env.GEMINI_MODEL || "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter(Boolean);
  let lastStatus = 0;
  for (const model of candidates) {
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    for (let attempt = 0; attempt <= RATE_LIMIT_RETRIES; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || "2048", 10),
            },
          }),
        });
        lastStatus = res.status;
        if (res.status === 429) {
          if (attempt < RATE_LIMIT_RETRIES) {
            const delay = RATE_LIMIT_BASE_DELAY_MS * Math.pow(2, attempt);
            logRateLimit(`Gemini/${model}`, attempt, delay);
            await sleep(delay);
            continue;
          }
          console.error(`[AI] Gemini/${model} rate limit exhausted after all retries, trying next model.`);
          break; // try next model
        }
        if (!res.ok) break; // try next model
        const data = await res.json();
        const parts = data?.candidates?.[0]?.content?.parts;
        if (!Array.isArray(parts)) break;
        const text = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
        if (typeof text === "string" && text.trim()) return { text: text.trim(), status: res.status };
        break;
      } catch {
        break; // try next model
      }
    }
  }
  return { text: null, status: lastStatus };
}

export async function generateOrdered(prompt: string, preferred?: AiProvider): Promise<{ parsed: unknown | null; provider?: AiProvider; raw?: string; }>{
  const providers = buildProviderList(preferred);

  if (providers.length === 0) {
    console.error("[AI] Kein AI-Provider verfügbar. Bitte überprüfe deine API-Keys.");
    return { parsed: null };
  }

  if (providers[0] === "deepseek") {
    console.info("[AI] DeepSeek is cheapest – using it");
  }

  const systemJson = "Antworte ausschließlich mit validem JSON ohne Markdown.";
  let lastFail: { provider: AiProvider; status: number } | null = null;

  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    const label = PROVIDER_LABEL[p];
    const breaker = getCircuitBreaker(`ai:${p}`, BREAKER_OPTIONS);

    if (!breaker.isCallAllowed()) {
      console.warn(`[AI] ${label} circuit OPEN – skipping`);
      continue;
    }

    const role =
      i === 0
        ? "primary"
        : lastFail
        ? `fallback after ${lastFail.status} from ${PROVIDER_LABEL[lastFail.provider]}`
        : "fallback";
    console.info(`[AI] Provider: ${label} (${role})`);

    let result: CallResult = { text: null, status: 0 };
    if (p === "deepseek") {
      result = await callDeepseek([
        { role: "system", content: systemJson },
        { role: "user", content: prompt },
      ]);
    } else if (p === "openai") {
      result = await callOpenAI([
        { role: "system", content: systemJson },
        { role: "user", content: prompt },
      ]);
    } else if (p === "gemini") {
      result = await callGemini(`${systemJson}\n\n${prompt}`);
    }

    if (result.text) {
      const parsed = extractJson(result.text);
      if (parsed) {
        breaker.recordSuccess();
        return { parsed, provider: p, raw: result.text };
      }
    }

    breaker.recordFailure();
    lastFail = { provider: p, status: result.status };
    const next = providers[i + 1];
    if (result.status === 0) {
      console.warn(`[AI] ${label} network error${next ? `, trying next: ${PROVIDER_LABEL[next]}` : " – no more providers"}`);
    } else if (SKIP_STATUSES.has(result.status)) {
      console.error(
        `[AI] ${label} failed (status: ${result.status})${next ? `, trying next: ${PROVIDER_LABEL[next]}` : " – no more providers"}`
      );
    } else if (next) {
      console.warn(`[AI] ${label} returned no usable output, trying next: ${PROVIDER_LABEL[next]}`);
    }
  }

  console.error("[AI] Alle Provider fehlgeschlagen. Kein AI-Provider verfügbar.");
  return { parsed: null };
}

export async function generateTextOrdered(system: string, user: string, preferred?: AiProvider, strict?: boolean): Promise<{ text: string | null; provider?: AiProvider }>{
  let providers = buildProviderList(preferred);

  if (strict && preferred) {
    providers = providers.filter((p) => p === preferred);
  }

  if (providers.length === 0) {
    console.error("[AI] Kein AI-Provider verfügbar. Bitte überprüfe deine API-Keys.");
    return { text: null };
  }

  if (providers[0] === "deepseek") {
    console.info("[AI] DeepSeek is cheapest – using it");
  }

  let lastFail: { provider: AiProvider; status: number } | null = null;

  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    const label = PROVIDER_LABEL[p];
    const breaker = getCircuitBreaker(`ai:${p}`, BREAKER_OPTIONS);

    if (!breaker.isCallAllowed()) {
      console.warn(`[AI] ${label} circuit OPEN – skipping`);
      continue;
    }

    const role =
      i === 0
        ? "primary"
        : lastFail
        ? `fallback after ${lastFail.status} from ${PROVIDER_LABEL[lastFail.provider]}`
        : "fallback";
    console.info(`[AI] Provider: ${label} (${role})`);

    try {
      let result: CallResult = { text: null, status: 0 };

      if (p === "deepseek") {
        const combined = system
          ? [{ role: "system", content: system }, { role: "user", content: user }]
          : [{ role: "user", content: user }];
        result = await callDeepseek(combined);
      } else if (p === "openai") {
        const combined = system
          ? [{ role: "system", content: system }, { role: "user", content: user }]
          : [{ role: "user", content: user }];
        result = await callOpenAI(combined);
      } else if (p === "gemini") {
        const combined = system ? `${system}\n\nUSER REQUEST:\n${user}` : user;
        result = await callGemini(combined);
      }

      if (result.text) {
        breaker.recordSuccess();
        return { text: result.text, provider: p };
      }

      breaker.recordFailure();
      lastFail = { provider: p, status: result.status };
      const next = providers[i + 1];
      if (result.status === 0) {
        console.warn(`[AI] ${label} network error${next ? `, trying next: ${PROVIDER_LABEL[next]}` : " – no more providers"}`);
      } else if (SKIP_STATUSES.has(result.status)) {
        console.error(
          `[AI] ${label} failed (status: ${result.status})${next ? `, trying next: ${PROVIDER_LABEL[next]}` : " – no more providers"}`
        );
      } else if (next) {
        console.warn(`[AI] ${label} returned no usable output, trying next: ${PROVIDER_LABEL[next]}`);
      }
    } catch {
      breaker.recordFailure();
      lastFail = { provider: p, status: 0 };
      const next = providers[i + 1];
      if (next) {
        console.warn(`[AI] ${label} threw an error, trying next: ${PROVIDER_LABEL[next]}`);
      }
    }
  }

  console.error("[AI] Alle Provider fehlgeschlagen. Kein AI-Provider verfügbar.");
  return { text: null };
}
