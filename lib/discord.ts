// WORLD BEAST: lib/discord.ts
// Discord integration – auto-posts new runbooks and alerts to a Discord channel.

/**
 * WORLD BEAST: Posts a message to the configured Discord webhook.
 * Set DISCORD_WEBHOOK_URL in your environment to enable.
 */
export async function postToDiscord(message: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return false

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
      signal: AbortSignal.timeout(10_000),
    })
    return res.ok
  } catch {
    return false
  }
}

function isSlackWebhook(url: string) {
  try {
    return new URL(url).hostname === "hooks.slack.com"
  } catch {
    return false
  }
}

/**
 * Success-Pulse: posts a sale notification to Discord or Slack.
 * Configure SUCCESS_PULSE_WEBHOOK_URL (preferred) or SLACK_WEBHOOK_URL/DISCORD_WEBHOOK_URL.
 */
export async function postSuccessPulse(message: string): Promise<boolean> {
  const webhookUrl =
    process.env.SUCCESS_PULSE_WEBHOOK_URL ||
    process.env.SLACK_WEBHOOK_URL ||
    process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return false

  const payload = isSlackWebhook(webhookUrl) ? { text: message } : { content: message }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * WORLD BEAST: Posts a rich embed to Discord for a new runbook.
 */
export async function postRunbookToDiscord(opts: {
  slug: string
  title: string
  summary: string
  tags: string[]
  clawScore: number
}): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return false

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const url = `${siteUrl}/runbook/${opts.slug}`
  const topTags = opts.tags.slice(0, 5).join(", ")

  const embed = {
    title: `📘 ${opts.title}`,
    description: opts.summary,
    url,
    color: 0x06b6d4, // brand-cyan
    fields: [
      { name: "🏷️ Tags", value: topTags || "ops", inline: true },
      { name: "⚡ ClawScore", value: String(opts.clawScore), inline: true },
    ],
    footer: { text: "ClawGuru WorldBeast 2026 · clawguru.org" },
    timestamp: new Date().toISOString(),
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
      signal: AbortSignal.timeout(10_000),
    })
    return res.ok
  } catch {
    return false
  }
}
