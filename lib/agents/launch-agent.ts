// WORLD BEAST FINAL LAUNCH: lib/agents/launch-agent.ts
// Launch Content Agent – generates ready-to-post launch content for all major platforms.

export type LaunchContent = {
  xThread: string[]          // 10 tweets, max 280 chars each
  linkedinPost: string       // professional post
  linkedinCarousel: string   // carousel slide descriptions
  redditPost: string         // Reddit post body
  hnTitle: string            // HackerNews title
  hnBody: string             // HackerNews Show HN body
  blueskyThread: string[]    // Bluesky posts
  generatedAt: string
}

// WORLD BEAST FINAL LAUNCH: Gemini helper (self-contained to avoid circular deps)
async function callGeminiLaunch(prompt: string): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash"
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
        generationConfig: { temperature: 0.7, maxOutputTokens: 2000, thinkingConfig: { thinkingBudget: 0 } },
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

// WORLD BEAST FINAL LAUNCH: Fallback content when Gemini is unavailable
function fallbackLaunchContent(): LaunchContent {
  return {
    xThread: [
      "🚨 LAUNCHING: ClawGuru WorldBeast 2026 — the #1 Ops Intelligence Platform for cloud operators. Thread 🧵 1/10",
      "2/10 Most ops teams still fix incidents manually. We built an AI agent swarm that hunts CVEs, generates runbooks, and heals itself. Zero human minutes. 🤖",
      "3/10 What's inside ClawGuru WorldBeast 2026:\n✅ 10,000+ AI runbooks\n✅ Live security scoring\n✅ Viral share engine\n✅ Discord community\n✅ Global leaderboard",
      "4/10 The security check takes 30 seconds. You get a Claw Score + exact next steps. No fluff, no 47-page PDFs. Just: fix this, then this, then this. ⚡",
      "5/10 Pro users get access to our AI Copilot that understands your infrastructure and generates custom runbooks on demand. Like having a senior SRE on call 24/7. 🧑‍💻",
      "6/10 Self-healing runbooks. Our system monitors itself, heals broken links, regenerates outdated content, and stays fresh — automatically. 🔧",
      "7/10 We've helped ops teams cut incident resolution time by 60%. Not with more tooling — with better runbooks and faster knowledge access. 📉",
      "8/10 Pricing that makes sense:\n💎 Pro: €9/month\n⚡ Day Pass: €4.99/24h\n🏢 Team: €29/month\n\nTry the free security check first → clawguru.org/check",
      "9/10 Built for: DevOps engineers, SREs, Cloud architects, and anyone who's ever been paged at 3am. We feel your pain. We built the solution. 🌙",
      "10/10 Ready to stop firefighting?\n\n🔗 Free check: clawguru.org/check\n📚 Runbooks: clawguru.org/runbooks\n💬 Discord: clawguru.org/discord\n\n#DevOps #CloudSecurity #SRE #Ops",
    ],
    linkedinPost: `🚀 Excited to announce the launch of ClawGuru WorldBeast 2026!\n\nAfter months of building, we're live with the most comprehensive Ops Intelligence Platform for cloud operators:\n\n✅ 10,000+ AI-generated security runbooks\n✅ Live Claw Security Score (30-second check)\n✅ AI agent swarm that hunts CVEs daily\n✅ Self-healing content engine\n✅ Global operator community\n\nWe built this because incident resolution is still broken. Most teams lose hours searching for the right fix. ClawGuru changes that.\n\nTry the free security check at clawguru.org/check\n\n#DevOps #CloudSecurity #SRE #PlatformEngineering #Ops`,
    linkedinCarousel: `Slide 1: "Stop firefighting. Start operating." — ClawGuru WorldBeast 2026\nSlide 2: The Problem — Ops teams waste 4+ hours per incident searching for fixes\nSlide 3: The Solution — 10,000+ AI runbooks, ready in seconds\nSlide 4: How it works — Check → Score → Runbook → Fix → Share\nSlide 5: The AI Agent Swarm — CVE Hunter, Growth Agent, Viral Content Agent\nSlide 6: Pricing — Free check · Pro €9/mo · Day Pass €4.99 · Team €29/mo\nSlide 7: Join 1000+ operators at clawguru.org`,
    redditPost: `**Show HN / r/devops: ClawGuru WorldBeast 2026 — AI-powered runbook platform for cloud ops**\n\nHey r/devops,\n\nWe just launched ClawGuru WorldBeast 2026. The TL;DR:\n\n- Enter your IP/domain → get a Claw Security Score in 30 seconds\n- Score unlocks relevant runbooks (we have 10,000+)\n- AI agent swarm hunts new CVEs daily and generates runbooks automatically\n- Share your score badge to help others\n\nBuilt for people who are tired of googling "nginx 502 kubernetes fix" at 3am.\n\nFree check: https://clawguru.org/check\n\nHappy to answer any questions about the tech stack (Next.js 14, Gemini AI, edge functions).`,
    hnTitle: `Show HN: ClawGuru – AI agent swarm that generates security runbooks from CVEs`,
    hnBody: `I built ClawGuru after getting paged one too many times without a clear runbook.\n\nThe core idea: an AI agent swarm that monitors CVE feeds daily, synthesizes them into actionable ops runbooks, and serves them instantly when you need them.\n\nTech stack:\n- Next.js 14 (App Router)\n- Gemini 1.5 Flash for runbook generation\n- Self-healing content pipeline\n- Stripe for monetization\n\nThe free security check (clawguru.org/check) gives you a heuristic Claw Score + next steps in 30 seconds.\n\nWould love feedback from the HN ops community.`,
    blueskyThread: [
      "🚀 Launching ClawGuru WorldBeast 2026 — AI-powered runbooks for cloud operators. 10,000+ runbooks. 30-second security check. Self-healing content engine. 🧵",
      "The Claw Security Score tells you exactly how exposed your infrastructure is — and the matching runbook tells you exactly what to fix. No fluff. Just ops. ⚡",
      "We built an AI agent swarm that hunts CVEs daily and auto-generates runbooks. It runs while you sleep. Literally. 🤖",
      "Pro: €9/month. Day Pass: €4.99. Or just use the free check first → clawguru.org/check #DevOps #CloudSecurity",
    ],
    generatedAt: new Date().toISOString(),
  }
}

/**
 * WORLD BEAST FINAL LAUNCH: generateLaunchContent()
 * Generates complete launch content for all major platforms.
 * Uses Gemini when available, falls back to hand-crafted content.
 */
export async function generateLaunchContent(): Promise<LaunchContent> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

  const prompt = [
    "You are the ClawGuru Launch Content Agent 2026.",
    "Generate complete launch content for ClawGuru WorldBeast — the #1 AI-powered Ops Intelligence Platform.",
    "",
    `Site URL: ${siteUrl}`,
    "Product: AI runbook platform for DevOps/SRE/cloud operators",
    "Key features: 10,000+ AI runbooks, Live Claw Security Score, CVE hunter agent, self-healing content, Discord, leaderboard",
    "Pricing: Free check · Pro €9/mo · Day Pass €4.99 · Team €29/mo",
    "",
    "Return ONLY a JSON object with these exact keys:",
    "  xThread: string[] — exactly 10 tweets, max 280 chars each, numbered 1/10 through 10/10",
    "  linkedinPost: string — professional LinkedIn post, max 600 chars",
    "  linkedinCarousel: string — descriptions for 7 LinkedIn carousel slides (one per line)",
    "  redditPost: string — r/devops Reddit post, max 900 chars",
    "  hnTitle: string — HackerNews Show HN title, max 80 chars",
    "  hnBody: string — HackerNews Show HN body, max 600 chars",
    "  blueskyThread: string[] — 4 Bluesky posts, max 300 chars each",
    "",
    "Be technical, honest, and avoid hype. Write for senior engineers.",
    "Do not add explanations outside the JSON.",
  ].join("\n")

  const text = await callGeminiLaunch(prompt)

  if (!text) return fallbackLaunchContent()

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as Partial<LaunchContent>
    return {
      xThread: Array.isArray(parsed.xThread) && parsed.xThread.length >= 5
        ? parsed.xThread
        : fallbackLaunchContent().xThread,
      linkedinPost: parsed.linkedinPost || fallbackLaunchContent().linkedinPost,
      linkedinCarousel: parsed.linkedinCarousel || fallbackLaunchContent().linkedinCarousel,
      redditPost: parsed.redditPost || fallbackLaunchContent().redditPost,
      hnTitle: parsed.hnTitle || fallbackLaunchContent().hnTitle,
      hnBody: parsed.hnBody || fallbackLaunchContent().hnBody,
      blueskyThread: Array.isArray(parsed.blueskyThread)
        ? parsed.blueskyThread
        : fallbackLaunchContent().blueskyThread,
      generatedAt: new Date().toISOString(),
    }
  } catch {
    return fallbackLaunchContent()
  }
}
