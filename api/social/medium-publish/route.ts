import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Medium API configuration
const MEDIUM_API_URL = "https://api.medium.com/v1"
const MEDIUM_API_KEY = process.env.MEDIUM_API_KEY
const MEDIUM_USER_ID = process.env.MEDIUM_USER_ID

interface MediumPost {
  title: string
  content: string
  contentFormat: "markdown" | "html"
  tags: string[]
  publishStatus: "draft" | "public" | "unlisted"
  canonicalUrl?: string
}

/**
 * POST /api/social/medium-publish
 * Publishes a roast article to Medium
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

    if (!MEDIUM_API_KEY || !MEDIUM_USER_ID) {
      return NextResponse.json(
        { error: "MEDIUM_API_KEY or MEDIUM_USER_ID not configured" },
        { status: 500 }
      )
    }

    // Get user's Medium posts
    const postsUrl = `${MEDIUM_API_URL}/users/${MEDIUM_USER_ID}/posts`
    const postsResponse = await fetch(postsUrl, {
      headers: {
        "Authorization": `Bearer ${MEDIUM_API_KEY}`,
      },
    })

    if (!postsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to get Medium user data" },
        { status: postsResponse.status }
      )
    }

    // Generate article content
    const post: MediumPost = {
      title: locale === "de" 
        ? `The Stack Roast: ${stackName} (${score}/100) — Brutal Ehrlich`
        : `The Stack Roast: ${stackName} (${score}/100) — Brutally Honest`,
      content: generateMediumContent({ score, stackName, findings, locale }),
      contentFormat: "markdown",
      tags: ["Security", "DevOps", "Technology", "Engineering", stackName.split(" ")[0]],
      publishStatus: "public",
      canonicalUrl: `https://clawguru.org/roast-my-moltbot?id=${roastId}`,
    }

    // Publish to Medium
    const publishUrl = `${MEDIUM_API_URL}/users/${MEDIUM_USER_ID}/posts`
    const response = await fetch(publishUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MEDIUM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: "Failed to publish to Medium", details: error },
        { status: response.status }
      )
    }

    const mediumPost = await response.json()

    return NextResponse.json({
      success: true,
      postId: mediumPost.data.id,
      url: mediumPost.data.url,
      publishedAt: mediumPost.data.publishedAt,
    })
  } catch (error) {
    console.error("Medium publish error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateMediumContent({ 
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

  return `# ${isDE ? "Der Stack Roast" : "The Stack Roast"}: ${stackName}

${isDE 
  ? "Willkommen zu 'The Stack Roast' — wo wir Tech-Stacks auf ihre Sicherheit prüfen. Keine Höflichkeit, nur Fakten." 
  : "Welcome to 'The Stack Roast' — where we put tech stacks to the security test. No politeness, just facts."
}

---

## Score: ${score}/100

${isGood 
  ? `🟢 ${isDE ? "Gut gearbeitet. Dieser Stack ist sicher." : "Good job. This stack is secure."}`
  : isBad
    ? `🔴 ${isDE ? "Kritisch. Dieser Stack ist ein Sicherheitsrisiko." : "Critical. This stack is a security risk."}`
    : `🟡 ${isDE ? "Verbesserungswürdig. Nicht sicher genug." : "Needs improvement. Not secure enough."}`
}

---

## What We Found

${findings.length > 0 
  ? findings.map(f => `* ${f}`).join("\n")
  : isDE 
    ? "* API Keys in Logs\n* Fehlende RBAC\n* Kein Egress Control\n* Ungesicherte Endpoints"
    : "* API keys in logs\n* Missing RBAC\n* No egress control\n* Unsecured endpoints"
}

---

## The Fix

${isDE 
  ? "Mit den richtigen Tools und Runbooks können diese Probleme in weniger als einer Stunde behoben werden. Die kritischen Lücken zuerst, dann die mittleren." 
  : "With the right tools and runbooks, these issues can be fixed in less than an hour. Critical vulnerabilities first, then the medium ones."
}

---

## About This Series

${isDE 
  ? "'The Stack Roast' ist eine Serie, die echte Sicherheitslücken in echten Stacks aufdeckt. Alle Roasts basieren auf echten Scans, keine Mock-Daten." 
  : "'The Stack Roast' is a series that exposes real security vulnerabilities in real stacks. All roasts are based on real scans, no mock data."
}

---

${isDE 
  ? "Roaste deinen eigenen Stack auf [ClawGuru](https://clawguru.org/roast-my-moltbot). Kostenlos, 2 Minuten." 
  : "Roast your own stack at [ClawGuru](https://clawguru.org/roast-my-moltbot). Free, 2 minutes."
}

---

*${isDE ? "Veröffentlicht von ClawGuru Security" : "Published by ClawGuru Security"}*
`
}
