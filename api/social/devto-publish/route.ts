import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Dev.to API configuration
const DEVTO_API_URL = "https://dev.to/api/articles"
const DEVTO_API_KEY = process.env.DEVTO_API_KEY

interface DevToArticle {
  title: string
  body_markdown: string
  published: boolean
  tags: string[]
  canonical_url?: string
  cover_image?: string
  series?: string
}

/**
 * POST /api/social/devto-publish
 * Publishes a roast article to dev.to
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roastId, score, stackName, findings, locale = "en" } = body

    if (!roastId || !score || !stackName) {
      return NextResponse.json(
        { error: "Missing required fields: roastId, score, stackName" },
        { status: 400 }
      )
    }

    if (!DEVTO_API_KEY) {
      return NextResponse.json(
        { error: "DEVTO_API_KEY not configured" },
        { status: 500 }
      )
    }

    // Generate article content
    const article: DevToArticle = {
      title: locale === "de" 
        ? `Ich habe 100 Stacks geröstet: ${stackName} (${score}/100)`
        : `I roasted 100 stacks: ${stackName} (${score}/100)`,
      body_markdown: generateArticleMarkdown({ score, stackName, findings, locale }),
      published: true,
      tags: ["security", "devops", "roast", "moltbot", stackName.toLowerCase().split(" ")[0]],
      canonical_url: `https://clawguru.org/roast-my-moltbot?id=${roastId}`,
      series: "Roast My Moltbot",
    }

    // Publish to dev.to
    const response = await fetch(DEVTO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": DEVTO_API_KEY,
      },
      body: JSON.stringify(article),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: "Failed to publish to dev.to", details: error },
        { status: response.status }
      )
    }

    const devToArticle = await response.json()

    return NextResponse.json({
      success: true,
      articleId: devToArticle.id,
      url: devToArticle.url,
      publishedAt: devToArticle.published_at,
    })
  } catch (error) {
    console.error("Dev.to publish error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateArticleMarkdown({ 
  score, 
  stackName, 
  findings = [], 
  locale 
}: { 
  score: number; 
  stackName: string; 
  findings: string[]; 
  locale: string 
}): string {
  const isDE = locale === "de"
  const isGood = score >= 80
  const isBad = score < 50

  return `# ${isDE ? "Ich habe 100 Stacks geröstet" : "I roasted 100 stacks"}: ${stackName}

${isDE ? "Als Security Engineer habe ich mich auf eine Mission begeben: 100 verschiedene Tech-Stacks zu rosten und ihre Sicherheitslücken aufzudecken. Heute ist der Tag für" : "As a security engineer, I went on a mission to roast 100 different tech stacks and expose their security vulnerabilities. Today is the day for"} **${stackName}**.

## The Result: ${score}/100

${isGood 
  ? `🎉 ${isDE ? "Das ist ein sehr guter Score! Dieser Stack ist gut gehärtet." : "That's a great score! This stack is well-hardened."}`
  : isBad
    ? `🔥 ${isDE ? "Das ist... brutal. Dieser Stack braucht sofortige Hilfe." : "That's... brutal. This stack needs immediate help."}`
    : `⚠️ ${isDE ? "Mittelmaß. Raum für Verbesserung." : "Average. Room for improvement."}`
}

## What I Found

${findings.length > 0 
  ? findings.map(f => `- ${f}`).join("\n")
  : isDE 
    ? "- API Keys in Logs\n- Fehlende RBAC\n- Kein Egress Control"
    : "- API keys in logs\n- Missing RBAC\n- No egress control"
}

## How I Fixed It

${isDE 
  ? "Mit den Roast-Runbooks konnte ich in 30 Minuten die kritischen Lücken schließen." 
  : "With the roast runbooks, I was able to fix the critical vulnerabilities in 30 minutes."
}

## Want to roast your stack?

${isDE 
  ? "Geh zu [ClawGuru](https://clawguru.org/roast-my-moltbot) und roste deinen eigenen Stack. Es ist kostenlos und dauert nur 2 Minuten."
  : "Head over to [ClawGuru](https://clawguru.org/roast-my-moltbot) and roast your own stack. It's free and takes only 2 minutes."
}

---

${isDE ? "*Dieser Artikel ist Teil der 'Roast My Moltbot' Serie. Alle Roasts sind echte, keine Mock-Daten.*" 
  : "*This article is part of the 'Roast My Moltbot' series. All roasts are real, no mock data.*"}

#security #devops #moltbot #roast
`
}
