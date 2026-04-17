/**
 * Roast Meme Generator — Viral Memes from Roasts
 * Generates shareable memes from roast results
 */

export interface MemeTemplate {
  id: string
  name: string
  description: string
  imageUrl: string
}

export interface Meme {
  id: string
  templateId: string
  topText: string
  bottomText: string
  imageUrl: string
  category: "funny" | "roast" | "viral" | "educational"
}

const memeTemplates: MemeTemplate[] = [
  {
    id: "1",
    name: "Drake Hotline Bling",
    description: "Drake rejecting bad security practices",
    imageUrl: "/memes/drake.png",
  },
  {
    id: "2",
    name: "Distracted Boyfriend",
    description: "Looking at new vulnerabilities instead of fixing old ones",
    imageUrl: "/memes/distracted-boyfriend.png",
  },
  {
    id: "3",
    name: "One Does Not Simply",
    description: "One does not simply secure production",
    imageUrl: "/memes/boromir.png",
  },
  {
    id: "4",
    name: "Success Kid",
    description: "Finally fixed all critical vulnerabilities",
    imageUrl: "/memes/success-kid.png",
  },
  {
    id: "5",
    name: "Batman Slapping Robin",
    description: "Slapping developers for committing secrets",
    imageUrl: "/memes/batman-slap.png",
  },
]

export function generateMeme(
  templateId: string,
  topText: string,
  bottomText: string,
  category: Meme["category"] = "funny"
): Meme {
  const template = memeTemplates.find((t) => t.id === templateId)
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  return {
    id: `meme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    templateId,
    topText,
    bottomText,
    imageUrl: template.imageUrl,
    category,
  }
}

export function generateRoastMeme(
  score: number,
  stackName: string,
  topIssue: string
): Meme {
  const isGood = score >= 80
  const isBad = score < 50

  let templateId = "1"
  let topText = ""
  let bottomText = ""

  if (isGood) {
    templateId = "4" // Success Kid
    topText = `${stackName}`
    bottomText = `Score: ${score}/100 — No critical issues!`
  } else if (isBad) {
    templateId = "5" // Batman Slap
    topText = `${stackName}`
    bottomText = `Score: ${score}/100 — ${topIssue}`
  } else {
    templateId = "3" // Boromir
    topText = `${stackName}`
    bottomText = `Score: ${score}/100 — Room for improvement`
  }

  return generateMeme(templateId, topText, bottomText, isGood ? "viral" : "funny")
}

export function getMemeTemplates(): MemeTemplate[] {
  return memeTemplates
}

export function generateMemeUrl(meme: Meme): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  return `${baseUrl}/meme/${meme.id}`
}

export function getViralMemes(count: number = 5): Meme[] {
  const viralMemes: Meme[] = []
  const categories: Meme["category"][] = ["viral", "funny", "roast"]
  
  for (let i = 0; i < count; i++) {
    const template = memeTemplates[i % memeTemplates.length]
    viralMemes.push(generateMeme(
      template.id,
      "When you realize your password is 'password123'",
      "Security 101: Don't do this",
      categories[i % categories.length]
    ))
  }
  
  return viralMemes
}

export function generateSocialPost(meme: Meme, platform: "twitter" | "linkedin"): string {
  const maxLength = platform === "twitter" ? 280 : 3000
  
  let content = `${meme.topText}\n\n${meme.bottomText}\n\n${generateMemeUrl(meme)}\n\n#RoastMeme #Security`
  
  if (content.length > maxLength) {
    content = `${meme.topText}\n\n${generateMemeUrl(meme)}\n\n#RoastMeme`
  }
  
  return content
}
