/**
 * YouTube Shorts Generator for Roasts
 * Creates short-form video content for algorithmic boost
 */

export interface YouTubeShortConfig {
  roastId: string
  stackName: string
  score: number
  topFinding: string
  locale?: string
}

export interface ShortSegment {
  text: string
  duration: number // seconds
  style: "dramatic" | "fast" | "slow"
}

export function generateYouTubeShort(config: YouTubeShortConfig): ShortSegment[] {
  const { stackName, score, topFinding, locale = "en" } = config
  const isDE = locale === "de"
  const isGood = score >= 80
  const isBad = score < 50

  const intro = isDE
    ? `Ich habe ${stackName} geröstet...`
    : `I roasted ${stackName}...`

  const scoreReveal = isDE
    ? `Der Score: ${score}.`
    : `The score: ${score}.`

  const reaction = isGood
    ? (isDE ? "Exzellent!" : "Excellent!")
    : isBad
      ? (isDE ? "Kritisch!" : "Critical!")
      : (isDE ? "Mittelmaß." : "Average.")

  const finding = isDE
    ? `Problem: ${topFinding}`
    : `Problem: ${topFinding}`

  const cta = isDE
    ? "Roaste deinen Stack bei clawguru.org"
    : "Roast your stack at clawguru.org"

  return [
    { text: intro, duration: 2, style: "dramatic" },
    { text: scoreReveal, duration: 2, style: "fast" },
    { text: reaction, duration: 1, style: "dramatic" },
    { text: finding, duration: 3, style: "slow" },
    { text: cta, duration: 2, style: "fast" },
  ]
}

export function generateShortTitle(stackName: string, score: number, locale = "en"): string {
  const isDE = locale === "de"
  const isBad = score < 50
  
  if (isBad) {
    return isDE 
      ? `${stackName} wurde vernichtet 🔥` 
      : `${stackName} got destroyed 🔥`
  }
  
  return isDE
    ? `${stackName} Roast: ${score}/100`
    : `${stackName} Roast: ${score}/100`
}

export function generateShortDescription(stackName: string, score: number, locale = "en"): string {
  const isDE = locale === "de"
  const isBad = score < 50
  
  return isDE
    ? `${isBad ? "BRUTAL" : "EHRKLICH"} Security Roast von ${stackName}. Score: ${score}/100.`
    : `${isBad ? "BRUTAL" : "HONEST"} Security Roast of ${stackName}. Score: ${score}/100.`
}

export function generateShortTags(stackName: string): string[] {
  const tags = ["security", "devops", "roast", "moltbot", "tech"]
  const stackWords = stackName.toLowerCase().split(" ")
  return [...tags, ...stackWords.slice(0, 2)]
}

export function generateYouTubeMetadata(config: YouTubeShortConfig): {
  title: string
  description: string
  tags: string[]
  categoryId: string
} {
  const { stackName, score } = config
  
  return {
    title: generateShortTitle(stackName, score, config.locale),
    description: generateShortDescription(stackName, score, config.locale),
    tags: generateShortTags(stackName),
    categoryId: "28", // Science & Technology
  }
}

export async function uploadToYouTube(
  videoBlob: Blob,
  metadata: ReturnType<typeof generateYouTubeMetadata>
): Promise<{ videoId: string; url: string }> {
  // In production, this would call YouTube API
  // For now, return mock response
  return {
    videoId: "mock_video_id",
    url: "https://youtube.com/shorts/mock",
  }
}
