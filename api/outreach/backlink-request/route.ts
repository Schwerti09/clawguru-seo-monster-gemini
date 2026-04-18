import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

/**
 * POST /api/outreach/backlink-request
 * Sends backlink request emails to companies featured in roasts
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { roastId, company, stackName, score, locale = "en" } = body

    if (!roastId || !company || !stackName) {
      return NextResponse.json(
        { error: "Missing required fields: roastId, company, stackName" },
        { status: 400 }
      )
    }

    const isDE = locale === "de"
    const isGood = score >= 80

    // Generate email content
    const subject = isDE
      ? `Ihr Stack wurde auf ClawGuru geröstet: ${company} (${score}/100)`
      : `Your stack was roasted on ClawGuru: ${company} (${score}/100)`

    const emailBody = isDE
      ? `Hallo ${company}-Team,

ich habe gerade euren Tech-Stack auf ClawGuru geröstet und wollte euch die Ergebnisse teilen.

**Stack:** ${stackName}
**Score:** ${score}/100

${isGood
  ? "🎉 Exzellent! Ihr Stack ist sicher und gut gehärtet."
  : score < 50
    ? "⚠️ Es wurden kritische Sicherheitslücken gefunden."
    : "⚠️ Es gibt Raum für Verbesserungen."
}

**Vorschlag:** Verlinkt auf euren Roast-Bericht für zusätzliche Glaubwürdigkeit und Social Proof:
https://clawguru.org/roast-my-moltbot?id=${roastId}

Dies ist ein "Not a Pentest" Bericht zur Härtung eurer eigenen Systeme. Keine Angriffstools.

Viele Grüße,
ClawGuru Security Team`
      : `Hi ${company} team,

I just roasted your tech stack on ClawGuru and wanted to share the results.

**Stack:** ${stackName}
**Score:** ${score}/100

${isGood
  ? "🎉 Excellent! Your stack is secure and well-hardened."
  : score < 50
    ? "⚠️ Critical security vulnerabilities were found."
    : "⚠️ There's room for improvement."
}

**Suggestion:** Link to your roast report for additional credibility and social proof:
https://clawguru.org/roast-my-moltbot?id=${roastId}

This is a "Not a Pentest" report for hardening your own systems. No attack tools.

Best,
ClawGuru Security Team`

    // In production, this would send the actual email via your email service
    // For now, we'll simulate and return the email content
    // await sendEmail({ to: companyEmail, subject, body: emailBody })

    return NextResponse.json({
      success: true,
      message: "Backlink request email generated",
      email: {
        subject,
        body: emailBody,
      },
    })
  } catch (error) {
    console.error("Backlink outreach error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/outreach/backlink-request/template
 * Returns email template for manual sending
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get("locale") || "en"

  const template = locale === "de"
    ? {
        subject: "Ihr Stack wurde auf ClawGuru geröstet: {company} ({score}/100)",
        body: `Hallo {company}-Team,

ich habe gerade euren Tech-Stack auf ClawGuru geröstet und wollte euch die Ergebnisse teilen.

**Stack:** {stackName}
**Score:** {score}/100

{statusMessage}

**Vorschlag:** Verlinkt auf euren Roast-Bericht für zusätzliche Glaubwürdigkeit:
https://clawguru.org/roast-my-moltbot?id={roastId}

Viele Grüße,
ClawGuru Security Team`,
      }
    : {
        subject: "Your stack was roasted on ClawGuru: {company} ({score}/100)",
        body: `Hi {company} team,

I just roasted your tech stack on ClawGuru and wanted to share the results.

**Stack:** {stackName}
**Score:** {score}/100

{statusMessage}

**Suggestion:** Link to your roast report for additional credibility:
https://clawguru.org/roast-my-moltbot?id={roastId}

Best,
ClawGuru Security Team`,
      }

  return NextResponse.json(template)
}
