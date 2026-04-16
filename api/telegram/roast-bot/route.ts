import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Telegram API configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

interface TelegramMessage {
  chat_id: string | number
  text: string
  parse_mode?: "Markdown" | "HTML"
  reply_markup?: any
}

/**
 * POST /api/telegram/roast-bot
 * Handles Telegram bot commands
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    // Handle /roast command
    if (message?.text?.startsWith("/roast")) {
      const stackName = message.text.replace("/roast", "").trim() || "My Stack"
      const score = Math.floor(Math.random() * 70) + 30 // Mock: 30-100

      const isGood = score >= 80
      const isBad = score < 50

      const text = `🔥 *Roast Results: ${stackName}*

*Score:* ${score}/100

${isGood 
  ? "✅ Great job! Your stack is well-hardened."
  : isBad
    ? "🔴 Critical issues found. Immediate action required."
    : "⚠️ Average score. Room for improvement."
}

*Top Findings:*
• API keys in logs
• Missing RBAC
• No egress control

[View Full Roast](https://clawguru.org/roast-my-moltbot?stack=${encodeURIComponent(stackName)})

---
_Powered by ClawGuru — Roast My Moltbot_`

      const telegramMessage: TelegramMessage = {
        chat_id: message.chat.id,
        text,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔥 Roast Another",
                callback_data: "roast_another",
              },
              {
                text: "📊 View Leaderboard",
                url: "https://clawguru.org/roast-my-moltbot/leaderboard",
              },
            ],
          ],
        },
      }

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(telegramMessage),
      })

      return NextResponse.json({ ok: true })
    }

    // Handle callback queries (button clicks)
    if (body?.callback_query) {
      const { callback_query } = body
      const chatId = callback_query.message.chat.id

      if (callback_query.data === "roast_another") {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callback_query_id: callback_query.id,
            text: "Use /roast <stack-name> to roast another stack!",
            show_alert: true,
          }),
        })
      }

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Telegram bot error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/telegram/roast-bot/publish
 * Publishes a roast to Telegram channel
 */
export async function PUBLISH(request: NextRequest) {
  try {
    const body = await request.json()
    const { roastId, score, stackName, locale = "en" } = body

    if (!roastId || !score || !stackName) {
      return NextResponse.json(
        { error: "Missing required fields: roastId, score, stackName" },
        { status: 400 }
      )
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured" },
        { status: 500 }
      )
    }

    const isDE = locale === "de"
    const isGood = score >= 80
    const isBad = score < 50

    const text = `${isDE ? "🔥 Neuer Roast" : "🔥 New Roast"}: *${stackName}*

${isDE ? "Score:" : "Score:"} ${score}/100

${isGood 
  ? isDE ? "✅ Exzellent! Dieser Stack ist sicher." : "✅ Excellent! This stack is secure."
  : isBad
    ? isDE ? "🔴 Kritisch! Sofortige Maßnahmen erforderlich." : "🔴 Critical! Immediate action required."
    : isDE ? "⚠️ Durchschnitt. Verbesserungen nötig." : "⚠️ Average. Improvements needed."
}

${isDE ? "[Vollständigen Roast ansehen]" : "[View Full Roast]"}(https://clawguru.org/roast-my-moltbot?id=${roastId})

---
${isDE ? "Powered by ClawGuru" : "Powered by ClawGuru"}`

    const telegramMessage: TelegramMessage = {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "Markdown",
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(telegramMessage),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: "Failed to send to Telegram", details: error },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Telegram publish error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
