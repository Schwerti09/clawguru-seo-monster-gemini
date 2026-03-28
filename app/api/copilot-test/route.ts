import { NextResponse } from "next/server";

// Test extractJson function
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
    let jsonStart = -1;
    let jsonEnd = -1;

    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (braceCount === 0) jsonStart = i;
        braceCount++;
      } else if (cleaned[i] === "}") {
        braceCount--;
        if (braceCount === 0 && jsonStart !== -1) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        return JSON.parse(cleaned.substring(jsonStart, jsonEnd));
      } catch {
        return null;
      }
    }

    return null;
  }
}

export async function GET() {
  const testCases = [
    {
      name: "Plain JSON",
      input:
        '{"reply":"test","followups":["a"],"actions":[{"label":"x","href":"/y"}],"confidence":"medium"}',
      expected: true,
    },
    {
      name: "JSON with code fences",
      input: '```json\n{"reply":"test","followups":["a"],"actions":[],"confidence":"low"}\n```',
      expected: true,
    },
    {
      name: "JSON with text before",
      input:
        'Hier ist die Antwort:\n{"reply":"test","followups":[],"actions":[],"confidence":"high"}',
      expected: true,
    },
    {
      name: "Invalid (no JSON)",
      input: "Just some text without JSON",
      expected: false,
    },
    {
      name: "Empty string",
      input: "",
      expected: false,
    },
  ];

  const results = testCases.map((tc) => {
    const result = extractJson(tc.input);
    const success = result !== null;
    return {
      name: tc.name,
      input: tc.input?.substring(0, 50),
      parsed: success,
      expected: tc.expected,
      pass: success === tc.expected,
      result: success ? JSON.stringify(result).substring(0, 100) : null,
    };
  });

  return NextResponse.json({
    testCount: testCases.length,
    passCount: results.filter((r) => r.pass).length,
    results,
  });
}
