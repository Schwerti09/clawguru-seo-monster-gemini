/**
 * TikTok Integration for Roast Clips
 * Uploads short-form content to TikTok for Gen Z audience
 */

export interface TikTokClip {
  roastId: string
  stackName: string
  score: number
  caption: string
  hashtags: string[]
  videoUrl: string
}

export function generateTikTokCaption(stackName: string, score: number, locale = "en"): string {
  const isDE = locale === "de"
  const isBad = score < 50
  const isGood = score >= 80

  const emoji = isGood ? "✅" : isBad ? "🔥" : "⚠️"
  const status = isGood 
    ? (isDE ? "SICHER" : "SECURE") 
    : isBad 
      ? (isDE ? "KRITISCH" : "CRITICAL") 
      : (isDE ? "MITTEL" : "AVERAGE")

  return `${emoji} ${stackName} Security Roast\n\n${status}: ${score}/100\n\n${isDE 
    ? "Roaste deinen Stack 👇" 
    : "Roast your stack 👇"}\n\nclawguru.org/roast-my-moltbot`
}

export function generateTikTokHashtags(stackName: string): string[] {
  const baseTags = ["#security", "#devops", "#roast", "#moltbot", "#tech", "#cybersecurity"]
  const stackWords = stackName.toLowerCase().split(" ")
  const stackTags = stackWords.slice(0, 2).map(w => `#${w.replace(/[^a-z0-9]/g, "")}`)
  return [...baseTags, ...stackTags]
}

export function generateTikTokVideoMetadata(stackName: string, score: number): {
  title: string
  description: string
  hashtags: string[]
} {
  return {
    title: `${stackName} Roast: ${score}/100`,
    description: generateTikTokCaption(stackName, score),
    hashtags: generateTikTokHashtags(stackName),
  }
}

export async function uploadToTikTok(clip: TikTokClip): Promise<{ videoId: string; url: string }> {
  // In production, this would call TikTok API
  // For now, return mock response
  return {
    videoId: "mock_tiktok_id",
    url: "https://tiktok.com/@clawguru/video/mock",
  }
}

export function generateTikTokShareUrl(videoId: string): string {
  return `https://www.tiktok.com/@clawguru/video/${videoId}`
}
