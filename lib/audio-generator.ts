/**
 * Roast Audio Generator
 * Converts roast content to audio format for podcast distribution
 */

export interface AudioSegment {
  text: string
  speaker: "host" | "guest" | "ai"
  duration: number // seconds
}

export interface RoastAudioConfig {
  roastId: string
  stackName: string
  score: number
  findings: string[]
  locale?: string
}

// Mock audio generation (in production would use TTS API like ElevenLabs)
export function generateRoastAudio(config: RoastAudioConfig): AudioSegment[] {
  const { stackName, score, findings, locale = "en" } = config
  const isDE = locale === "de"
  const isGood = score >= 80
  const isBad = score < 50

  const intro = isDE
    ? "Willkommen zurück zu Roast My Moltbot, dem Podcast, der keine Höflichkeit kennt."
    : "Welcome back to Roast My Moltbot, the podcast with no politeness."

  const stackIntro = isDE
    ? `Heute rosten wir: ${stackName}.`
    : `Today we're roasting: ${stackName}.`

  const scoreAnnouncement = isDE
    ? `Der Score: ${score} von 100. ${isGood ? "Das ist gut." : isBad ? "Das ist... brutal." : "Das ist durchschnittlich."}`
    : `The score: ${score} out of 100. ${isGood ? "That's good." : isBad ? "That's... brutal." : "That's average."}`

  const findingsIntro = isDE
    ? "Lass uns uns die kritischen Lücken ansehen."
    : "Let's look at the critical vulnerabilities."

  const findingsList = findings.slice(0, 3).map(f => ({
    text: isDE ? f : f,
    speaker: "ai" as const,
    duration: 3,
  }))

  const conclusion = isDE
    ? "Am Ende des Tages: Sicherheit ist kein Ziel, es ist ein Prozess. Roaste deinen Stack auf clawguru.org."
    : "At the end of the day: Security is not a goal, it's a process. Roast your stack at clawguru.org."

  return [
    { text: intro, speaker: "host", duration: 4 },
    { text: stackIntro, speaker: "host", duration: 3 },
    { text: scoreAnnouncement, speaker: "ai", duration: 3 },
    { text: findingsIntro, speaker: "guest", duration: 2 },
    ...findingsList,
    { text: conclusion, speaker: "host", duration: 5 },
  ]
}

export function generatePodcastRSS(segments: AudioSegment[], locale = "en"): string {
  const isDE = locale === "de"
  const totalDuration = segments.reduce((sum, s) => sum + s.duration, 0)

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>${isDE ? "Roast My Moltbot Podcast" : "Roast My Moltbot Podcast"}</title>
    <description>${isDE ? "Brutal ehrliche Security-Roasts für jeden Stack" : "Brutally honest security roasts for every stack"}</description>
    <language>${locale}</language>
    <itunes:author>ClawGuru Security</itunes:author>
    <itunes:explicit>no</itunes:explicit>
    <itunes:image href="https://clawguru.org/podcast-cover.jpg"/>
    <item>
      <title>${isDE ? "Weekly Roast Digest" : "Weekly Roast Digest"}</title>
      <description>${isDE ? "Die besten Roasts der Woche" : "Best roasts of the week"}</description>
      <itunes:duration>${totalDuration * 60}</itunes:duration>
      <enclosure url="https://clawguru.org/audio/roast-weekly.mp3" type="audio/mpeg"/>
    </item>
  </channel>
</rss>`
}

export async function textToSpeech(text: string, voice: string = "default"): Promise<Blob> {
  // In production, this would call TTS API
  // For now, return empty blob
  return new Blob([], { type: "audio/mpeg" })
}

export function getAudioDuration(text: string): number {
  // Rough estimate: 150 words per minute = 2.5 words per second
  const words = text.split(/\s+/).length
  return Math.ceil(words / 2.5)
}
