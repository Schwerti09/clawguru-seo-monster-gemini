/**
 * Roast Podcast Clipper — Best of Highlights
 * Extracts highlights from podcast episodes for social media
 */

export interface PodcastClip {
  id: string
  episodeId: string
  title: string
  duration: number // seconds
  transcript: string
  timestamp: string
  category: "funny" | "educational" | "viral" | "controversial"
  engagement: {
    likes: number
    shares: number
  }
}

export interface PodcastEpisode {
  id: string
  title: string
  duration: number
  publishDate: string
  clips: PodcastClip[]
}

const mockClips: PodcastClip[] = [
  {
    id: "1",
    episodeId: "ep1",
    title: "The moment they realized their password was 'password123'",
    duration: 45,
    transcript: "Wait, you're using password123? In production? That's... that's actually impressive in a terrible way.",
    timestamp: "12:34",
    category: "funny",
    engagement: { likes: 1247, shares: 456 },
  },
  {
    id: "2",
    episodeId: "ep1",
    title: "Why Kubernetes is overrated for 90% of use cases",
    duration: 60,
    transcript: "Look, if you have 3 microservices and you're running Kubernetes, you're not being smart. You're being fashionable.",
    timestamp: "23:45",
    category: "controversial",
    engagement: { likes: 892, shares: 312 },
  },
  {
    id: "3",
    episodeId: "ep2",
    title: "The fastest way to get hacked: API keys in logs",
    duration: 30,
    transcript: "Number one fastest way to get hacked? Put your API keys in your logs. It's like leaving your keys in the door.",
    timestamp: "08:12",
    category: "educational",
    engagement: { likes: 2341, shares: 847 },
  },
  {
    id: "4",
    episodeId: "ep2",
    title: "Cloud vendor lock-in is a feature, not a bug",
    duration: 55,
    transcript: "People complain about vendor lock-in. But you know what lock-in gives you? Peace of mind. It works.",
    timestamp: "45:23",
    category: "controversial",
    engagement: { likes: 567, shares: 234 },
  },
  {
    id: "5",
    episodeId: "ep3",
    title: "The time someone deployed production to staging",
    duration: 40,
    transcript: "So they deployed production to staging. And then staging to production. And then... everything worked.",
    timestamp: "31:45",
    category: "funny",
    engagement: { likes: 1567, shares: 623 },
  },
]

export function getBestClips(count: number = 5): PodcastClip[] {
  return mockClips
    .sort((a, b) => b.engagement.likes - a.engagement.likes)
    .slice(0, count)
}

export function getClipsByCategory(category: PodcastClip["category"], count: number = 3): PodcastClip[] {
  return mockClips
    .filter((clip) => clip.category === category)
    .sort((a, b) => b.engagement.likes - a.engagement.likes)
    .slice(0, count)
}

export function generateClipUrl(clipId: string): string {
  return `https://clawguru.org/podcast/clip/${clipId}`
}

export function generateSocialPost(clip: PodcastClip, platform: "twitter" | "linkedin" | "tiktok"): string {
  const maxLength = platform === "twitter" ? 280 : platform === "linkedin" ? 3000 : 150
  
  let content = `"${clip.title}"\n\n${clip.transcript}\n\n🎧 Full episode: ${generateClipUrl(clip.id)}\n\n#RoastPodcast #Security`
  
  if (content.length > maxLength) {
    content = `"${clip.title}"\n\n🎧 Listen: ${generateClipUrl(clip.id)}\n\n#RoastPodcast #Security`
  }
  
  return content
}

export function getViralClips(threshold: number = 1000): PodcastClip[] {
  return mockClips.filter((clip) => clip.engagement.shares >= threshold)
}
