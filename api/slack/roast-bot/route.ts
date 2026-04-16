import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Slack API configuration
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN

interface SlackMessage {
  text: string
  blocks?: any[]
  attachments?: any[]
}

/**
 * POST /api/slack/roast-bot
 * Handles Slack slash command: /roast-my-stack
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, user_name, team_id, channel_id } = body

    // Parse command arguments
    const stackName = text.trim() || "My Stack"
    const score = Math.floor(Math.random() * 70) + 30 // Mock: 30-100

    const isGood = score >= 80
    const isBad = score < 50

    // Generate Slack message
    const slackMessage: SlackMessage = {
      text: `🔥 Roast Results for *${stackName}*`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🔥 Roast Results: ${stackName}`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Score:* ${score}/100\n*Roasted by:* @${user_name}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: isGood
              ? `✅ *Great job!* Your stack is well-hardened.`
              : isBad
                ? `🔴 *Critical issues found.* Your stack needs immediate attention.`
                : `⚠️ *Average score.* Room for improvement.`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Top Findings:*\n• API keys in logs\n• Missing RBAC\n• No egress control`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Full Roast",
                emoji: true,
              },
              url: `https://clawguru.org/roast-my-moltbot?stack=${encodeURIComponent(stackName)}`,
              style: isGood ? "primary" : "danger",
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Roast Another",
                emoji: true,
              },
              action_id: "roast_another",
            },
          ],
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "Powered by ClawGuru — Roast My Moltbot",
            },
          ],
        },
      ],
    }

    // Send to Slack webhook
    if (SLACK_WEBHOOK_URL) {
      await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slackMessage),
      })
    }

    return NextResponse.json({
      response_type: "in_channel",
      text: `🔥 Roasting ${stackName}...`,
    })
  } catch (error) {
    console.error("Slack bot error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/slack/roast-bot/interactive
 * Handles interactive components (buttons)
 */
export async function POST_INTERACTIVE(request: NextRequest) {
  try {
    const body = await request.json()
    const { payload } = body
    const payloadData = JSON.parse(payload)

    if (payloadData.actions[0].action_id === "roast_another") {
      return NextResponse.json({
        response_type: "ephemeral",
        text: "Use `/roast-my-stack <stack-name>` to roast another stack!",
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Slack interactive error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
