import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * POST /api/newsletter/sponsor-placement
 * Places roast content in sponsored newsletter slots
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roastId, stackName, score, newsletterId, locale = "en" } = body

    if (!roastId || !stackName || !score || !newsletterId) {
      return NextResponse.json(
        { error: "Missing required fields: roastId, stackName, score, newsletterId" },
        { status: 400 }
      )
    }

    const isDE = locale === "de"
    const isBad = score < 50

    // Generate sponsored content
    const sponsoredContent = isDE
      ? `🔥 **This Week's Worst Stack**: ${stackName}

Score: ${score}/100

${isBad ? "Kritische Sicherheitslücken gefunden!" : "Verbesserungspotentiale entdeckt."}

[Vollständiger Roast ansehen](https://clawguru.org/roast-my-moltbot?id=${roastId})

---
*Sponsored by ClawGuru — Roast My Moltbot*`
      : `🔥 **This Week's Worst Stack**: ${stackName}

Score: ${score}/100

${isBad ? "Critical security vulnerabilities found!" : "Improvement opportunities discovered."}

[View full roast](https://clawguru.org/roast-my-moltbot?id=${roastId})

---
*Sponsored by ClawGuru — Roast My Moltbot*`

    // In production, this would integrate with newsletter platforms like
    // Substack, ConvertKit, Mailchimp, etc.
    // For now, we return the generated content
    
    return NextResponse.json({
      success: true,
      content: sponsoredContent,
      newsletterId,
      roastId,
    })
  } catch (error) {
    console.error("Newsletter sponsor placement error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/newsletter/sponsor-placement/partners
 * Returns list of newsletter partners for manual outreach
 */
export async function GET(request: NextRequest) {
  const partners = [
    {
      id: "substack",
      name: "Substack",
      audience: "Tech & Security",
      subscribers: "50K+",
      contact: "partnerships@substack.com",
    },
    {
      id: "convertkit",
      name: "ConvertKit",
      audience: "Developers & Creators",
      subscribers: "100K+",
      contact: "partners@convertkit.com",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      audience: "SaaS & Startups",
      subscribers: "200K+",
      contact: "partners@mailchimp.com",
    },
  ]

  return NextResponse.json({ partners })
}
