import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Discord API configuration
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

interface DiscordMessage {
  content?: string
  embeds?: any[]
  components?: any[]
}

/**
 * POST /api/discord/roast-bot
 * Handles Discord slash command: /roast
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, member, guild_id } = body

    // Parse command arguments
    const stackName = data.options?.[0]?.value || "My Stack"
    const score = Math.floor(Math.random() * 70) + 30 // Mock: 30-100

    const isGood = score >= 80
    const isBad = score < 50

    // Generate Discord embed
    const embed = {
      title: `🔥 Roast Results: ${stackName}`,
      description: `Score: **${score}/100**\nRoasted by: <@${member.user.id}>`,
      color: isGood ? 5763719 : isBad ? 15548997 : 15105546, // Green, Red, Yellow
      fields: [
        {
          name: "Status",
          value: isGood
            ? "✅ Great job! Your stack is well-hardened."
            : isBad
              ? "🔴 Critical issues found. Immediate action required."
              : "⚠️ Average score. Room for improvement.",
          inline: false,
        },
        {
          name: "Top Findings",
          value: "• API keys in logs\n• Missing RBAC\n• No egress control",
          inline: false,
        },
      ],
      footer: {
        text: "Powered by ClawGuru — Roast My Moltbot",
      },
      timestamp: new Date().toISOString(),
    }

    // Generate action buttons
    const components = [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: isGood ? 3 : 4, // Primary or Danger
            label: "View Full Roast",
            url: `https://clawguru.org/roast-my-moltbot?stack=${encodeURIComponent(stackName)}`,
          },
          {
            type: 2,
            style: 1,
            label: "Roast Another",
            custom_id: "roast_another",
          },
        ],
      },
    ]

    // Send Discord message (via webhook or bot API)
    if (DISCORD_WEBHOOK_URL) {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
          components,
        }),
      })
    }

    return NextResponse.json({
      type: 4, // Channel message with source
      data: {
        content: `🔥 Roasting ${stackName}...`,
        embeds: [embed],
        components,
      },
    })
  } catch (error) {
    console.error("Discord bot error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/discord/roast-bot/interaction
 * Handles Discord button interactions
 */
export async function POST_INTERACTION(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, member } = body

    if (data.custom_id === "roast_another") {
      return NextResponse.json({
        type: 4,
        data: {
          content: "Use `/roast <stack-name>` to roast another stack!",
          flags: 64, // Ephemeral
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Discord interaction error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
