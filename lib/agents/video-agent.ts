// WORLD BEAST UPGRADE: lib/agents/video-agent.ts
// Automated Video Runbook Agent – generates short explanatory video scripts and
// HeyGen/Runway API payloads for each runbook. Produces structured video briefs
// when video API keys are not configured.

// WORLD BEAST UPGRADE: Gemini helper (self-contained)
async function callGeminiVideo(prompt: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const geminiBase = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")

  if (!geminiKey) return null

  try {
    const url = `${geminiBase}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 2000 },
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      return parts.map((p: { text?: string }) => p?.text ?? "").join("").trim() || null
    }
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VideoScene = {
  sceneNumber: number
  durationSeconds: number
  narration: string          // Voice-over text for this scene
  visualDescription: string  // What to show on screen
  codeSnippet?: string       // Optional code to highlight
}

export type VideoRunbook = {
  slug: string
  title: string
  totalDurationSeconds: number   // Target: 60-120s
  targetAudience: string         // e.g. "DevOps engineers, SREs"
  openingHook: string            // Attention-grabbing first sentence
  scenes: VideoScene[]
  closingCTA: string             // Call to action at end
  thumbnailPrompt: string        // AI image generation prompt for thumbnail
  heygenPayload?: HeyGenPayload  // Ready for HeyGen API (if key configured)
  generatedAt: string
}

// WORLD BEAST UPGRADE: HeyGen API v2 payload structure
type HeyGenPayload = {
  video_inputs: Array<{
    character: { type: "avatar"; avatar_id: string; avatar_style: string }
    voice: { type: "text"; input_text: string; voice_id: string }
    background: { type: "color"; value: string }
  }>
  test: boolean
  aspect_ratio: "16:9" | "9:16"
}

// WORLD BEAST UPGRADE: Build HeyGen payload from scenes
function buildHeyGenPayload(scenes: VideoScene[]): HeyGenPayload {
  return {
    video_inputs: scenes.slice(0, 5).map((scene) => ({
      character: {
        type: "avatar",
        avatar_id: process.env.HEYGEN_AVATAR_ID || "Wayne_20240711",
        avatar_style: "normal",
      },
      voice: {
        type: "text",
        input_text: scene.narration,
        voice_id: process.env.HEYGEN_VOICE_ID || "1bd001e7e50f421d891986aad5158bc8",
      },
      background: {
        type: "color",
        value: "#050608",
      },
    })),
    test: !process.env.HEYGEN_API_KEY,
    aspect_ratio: "16:9",
  }
}

/**
 * WORLD BEAST UPGRADE: generateVideoRunbook()
 * Creates a full video script + HeyGen/Runway payload for a runbook.
 */
export async function generateVideoRunbook(opts: {
  slug: string
  title: string
  summary: string
  mitigationSteps?: string[]
}): Promise<VideoRunbook> {
  const { slug, title, summary, mitigationSteps = [] } = opts

  const prompt = [
    "You are the ClawGuru Video Runbook Agent 2026.",
    "Create a short (60-90 second) explanatory video script for a security runbook.",
    "Style: Direct, technical, no fluff. Like a senior SRE explaining to a colleague.",
    "",
    `Runbook slug: ${slug}`,
    `Title: ${title}`,
    `Summary: ${summary}`,
    mitigationSteps.length > 0 ? `Steps: ${mitigationSteps.slice(0, 3).join(" | ")}` : "",
    "",
    "Return ONLY a JSON object with these exact keys:",
    "  title: string — video title (max 60 chars)",
    "  totalDurationSeconds: number — between 60 and 120",
    "  targetAudience: string — who this is for",
    "  openingHook: string — attention-grabbing first sentence (max 100 chars)",
    "  scenes: Array of 4-6 scenes, each with:",
    "    sceneNumber (number), durationSeconds (number), narration (string, max 150 chars),",
    "    visualDescription (string, max 100 chars), codeSnippet (string, optional)",
    "  closingCTA: string — call to action (max 100 chars)",
    '  thumbnailPrompt: string — DALL-E/Midjourney prompt for dark-themed thumbnail',
    "",
    "Do not add explanations outside the JSON.",
  ].filter(Boolean).join("\n")

  const text = await callGeminiVideo(prompt)

  const now = new Date().toISOString()

  if (!text) {
    return {
      slug,
      title: `Video: ${title}`,
      totalDurationSeconds: 90,
      targetAudience: "DevOps engineers, SREs",
      openingHook: `Are you dealing with ${title}? Here's the fix in 90 seconds.`,
      scenes: [
        {
          sceneNumber: 1,
          durationSeconds: 10,
          narration: `Today we're fixing ${title}. This is one of the most common ops issues in 2026.`,
          visualDescription: "Terminal screen, dark theme, ClawGuru logo",
        },
        {
          sceneNumber: 2,
          durationSeconds: 20,
          narration: summary,
          visualDescription: "Architecture diagram showing the problem",
        },
        {
          sceneNumber: 3,
          durationSeconds: 40,
          narration: mitigationSteps.slice(0, 2).join(". ") || "Apply the fix from the ClawGuru runbook.",
          visualDescription: "Code editor showing the fix",
          codeSnippet: mitigationSteps[0],
        },
        {
          sceneNumber: 4,
          durationSeconds: 20,
          narration: `Fixed. Full runbook at clawguru.org/runbook/${slug}`,
          visualDescription: "ClawGuru website with runbook page",
        },
      ],
      closingCTA: `Full runbook: clawguru.org/runbook/${slug}`,
      thumbnailPrompt: `Dark cyberpunk terminal screen, green neon text, showing "${title}", dramatic lighting, tech aesthetic`,
      heygenPayload: buildHeyGenPayload([]),
      generatedAt: now,
    }
  }

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as Partial<VideoRunbook>
    const scenes: VideoScene[] = Array.isArray(parsed.scenes)
      ? parsed.scenes.map((s, i) => ({
          sceneNumber: s.sceneNumber ?? i + 1,
          durationSeconds: s.durationSeconds ?? 15,
          narration: s.narration ?? "",
          visualDescription: s.visualDescription ?? "",
          codeSnippet: s.codeSnippet,
        }))
      : []

    return {
      slug,
      title: parsed.title || title,
      totalDurationSeconds: parsed.totalDurationSeconds || 90,
      targetAudience: parsed.targetAudience || "DevOps engineers",
      openingHook: parsed.openingHook || "",
      scenes,
      closingCTA: parsed.closingCTA || `Full runbook: clawguru.org/runbook/${slug}`,
      thumbnailPrompt: parsed.thumbnailPrompt || "",
      heygenPayload: buildHeyGenPayload(scenes),
      generatedAt: now,
    }
  } catch {
    return {
      slug,
      title,
      totalDurationSeconds: 90,
      targetAudience: "DevOps engineers",
      openingHook: `Fixing ${title} in 90 seconds.`,
      scenes: [],
      closingCTA: `clawguru.org/runbook/${slug}`,
      thumbnailPrompt: `Dark cyberpunk tech security illustration for ${title}`,
      heygenPayload: buildHeyGenPayload([]),
      generatedAt: now,
    }
  }
}

/**
 * WORLD BEAST UPGRADE: submitToHeyGen()
 * Submits a video generation request to HeyGen API v2.
 * Returns the video_id for status polling, or null if not configured.
 */
export async function submitToHeyGen(payload: HeyGenPayload): Promise<string | null> {
  const apiKey = process.env.HEYGEN_API_KEY
  if (!apiKey) return null

  try {
    const res = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return null
    const data = await res.json() as { data?: { video_id?: string } }
    return data?.data?.video_id ?? null
  } catch {
    return null
  }
}
