import { NextResponse } from "next/server";

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "No GEMINI_API_KEY configured", hasKey: false };
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(
    /\/$/,
    "",
  );

  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const prompt = `Respond ONLY with valid JSON, no other text:
{"reply":"Test response from Gemini","followups":["Follow-up 1"],"actions":[],"confidence":"high"}`;

  console.log("[GEMINI_TEST] Starting test...");
  console.log("[GEMINI_TEST] URL:", url.substring(0, 100));
  console.log("[GEMINI_TEST] Model:", model);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
      }),
    });

    console.log("[GEMINI_TEST] Response status:", response.status);
    console.log("[GEMINI_TEST] Response ok:", response.ok);

    const text = await response.text();
    console.log("[GEMINI_TEST] Response length:", text.length);
    console.log("[GEMINI_TEST] Response preview:", text.substring(0, 200));

    if (!response.ok) {
      return {
        error: "Gemini API error",
        status: response.status,
        message: text.substring(0, 500),
      };
    }

    const data = JSON.parse(text);
    const parts = data?.candidates?.[0]?.content?.parts;
    console.log("[GEMINI_TEST] Has parts:", Array.isArray(parts));
    console.log("[GEMINI_TEST] Parts count:", parts?.length);

    if (!Array.isArray(parts)) {
      return {
        error: "No content parts in response",
        data: text.substring(0, 500),
      };
    }

    const responseText = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
    console.log("[GEMINI_TEST] Extracted text length:", responseText.length);
    console.log("[GEMINI_TEST] Extracted text:", responseText);

    return {
      success: true,
      textLength: responseText.length,
      textPreview: responseText.substring(0, 300),
    };
  } catch (err) {
    console.error("[GEMINI_TEST] Error:", err instanceof Error ? err.message : String(err));
    return {
      error: "Fetch failed",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function GET() {
  const result = await testGemini();
  return NextResponse.json(result);
}
