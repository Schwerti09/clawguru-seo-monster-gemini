const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^"(.*)"$/, "$1");
    if (key) process.env[key] = value;
  }
});

const apiKey = process.env.GEMINI_API_KEY;
const baseUrl = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";
const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

console.log("Testing Gemini API...");
console.log("API Key present:", !!apiKey);
console.log("Base URL:", baseUrl);
console.log("Model:", model);
console.log("Full URL:", url.substring(0, 100) + "...");

const prompt = "Respond with valid JSON only: " +
  JSON.stringify({
    reply: "Test response",
    followups: ["Test followup"],
    actions: [],
    confidence: "high",
  });

(async () => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
      }),
    });

    console.log("\nResponse status:", response.status);
    console.log("Response ok:", response.ok);

    const text = await response.text();
    console.log("Response length:", text.length);
    console.log("Response preview:", text.substring(0, 300));

    if (response.ok) {
      const data = JSON.parse(text);
      const parts = data?.candidates?.[0]?.content?.parts;
      console.log("\nHas parts:", Array.isArray(parts));
      if (Array.isArray(parts)) {
        const contentText = parts.map((p) => p?.text).filter(Boolean).join("");
        console.log("Extracted content:", contentText.substring(0, 200));
      }
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
