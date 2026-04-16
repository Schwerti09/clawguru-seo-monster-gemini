import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Mock roast data - in production would come from database
const recentRoasts = [
  {
    id: "1",
    title: "Startup Stack gets roasted: 34/100",
    description: "API keys in logs, no egress control, RBAC missing. Fixed in 30 minutes with runbooks.",
    link: "https://clawguru.org/roast-my-moltbot",
    pubDate: new Date(Date.now() - 1000 * 60 * 30).toUTCString(), // 30 min ago
    category: "moltbot",
    score: 34,
  },
  {
    id: "2",
    title: "Enterprise Stack: 67/100 — Needs work",
    description: "Good base but webhook security and mTLS missing. 3 fixes applied.",
    link: "https://clawguru.org/roast-my-moltbot",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toUTCString(), // 2 hours ago
    category: "moltbot",
    score: 67,
  },
  {
    id: "3",
    title: "Hall of Fame entry: 94/100 PROTECTED",
    description: "Elite security setup. Zero critical findings. Perfect RBAC and egress control.",
    link: "https://clawguru.org/roast-my-moltbot/hall-of-fame",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toUTCString(), // 5 hours ago
    category: "hall-of-fame",
    score: 94,
  },
  {
    id: "4",
    title: "Weekly Roast KW16: 156 Teilnehmer",
    description: "Durchschnittliche Verbesserung: +31 Punkte. Leader: +67 Punkte in einer Woche.",
    link: "https://clawguru.org/roast-my-moltbot/weekly-roast",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toUTCString(), // 1 day ago
    category: "weekly-roast",
    score: 0,
  },
  {
    id: "5",
    title: "Roast Battle: Docker Compose vs Kubernetes",
    description: "Kubernetes gewinnt mit 892 zu 567 Votes. Bessere RBAC und Netzwerk-Policies.",
    link: "https://clawguru.org/roast-my-moltbot/battle",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toUTCString(), // 2 days ago
    category: "battle",
    score: 0,
  },
]

export async function GET(request: NextRequest) {
  const baseUrl = "https://clawguru.org"
  const lastBuildDate = new Date().toUTCString()

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>ClawGuru Roast Feed</title>
    <link>${baseUrl}/roast-my-moltbot</link>
    <description>Latest Moltbot security roasts, battles, and Hall of Fame entries. Get roasted, get fixed, get famous.</description>
    <language>de</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss/roasts" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/og-image.png</url>
      <title>ClawGuru Roast Feed</title>
      <link>${baseUrl}/roast-my-moltbot</link>
    </image>
    ${recentRoasts.map(roast => `
    <item>
      <title>${escapeXml(roast.title)}</title>
      <link>${roast.link}</link>
      <guid isPermaLink="false">roast-${roast.id}</guid>
      <pubDate>${roast.pubDate}</pubDate>
      <category>${roast.category}</category>
      <description>${escapeXml(roast.description)}</description>
      <content:encoded><![CDATA[
        <div style="font-family: system-ui, sans-serif; padding: 20px; background: #0a0a0a; color: #fff;">
          <h2 style="color: ${roast.score > 0 && roast.score < 50 ? '#ef4444' : roast.score >= 80 ? '#22c55e' : '#f59e0b'};">
            ${roast.title}
          </h2>
          <p>${roast.description}</p>
          ${roast.score > 0 ? `<div style="font-size: 48px; font-weight: bold; margin: 20px 0;">Score: ${roast.score}/100</div>` : ''}
          <a href="${roast.link}" style="display: inline-block; padding: 12px 24px; background: #0891b2; color: white; text-decoration: none; border-radius: 8px;">
            ${roast.category === 'hall-of-fame' ? 'View in Hall of Fame' : 'Roast Your Stack'}
          </a>
        </div>
      ]]></content:encoded>
    </item>
    `).join('')}
  </channel>
</rss>`

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300", // 5 min cache
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}
