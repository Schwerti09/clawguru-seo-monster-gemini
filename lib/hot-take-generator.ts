/**
 * Hot Take Generator — AI-Powered Controversial Takes
 * Generates engaging, controversial statements for social media
 */

export interface HotTake {
  id: string
  title: string
  content: string
  category: "security" | "devops" | "cloud" | "ai"
  controversy: "mild" | "medium" | "spicy"
  engagement: {
    likes: number
    comments: number
    shares: number
  }
}

const hotTakeTemplates = [
  {
    category: "security",
    templates: [
      "90% of companies don't need zero-trust. They just need to rotate their secrets.",
      "RBAC is the new SQL injection — everyone claims to have it, almost nobody does.",
      "Your firewall isn't security. It's just a false sense of security.",
      "If you're not automating security, you're not doing security.",
      "The best security tool is the one you actually use — not the one with the most features.",
    ],
  },
  {
    category: "devops",
    templates: [
      "Kubernetes is overrated for 90% of use cases. Docker Compose is enough.",
      "Microservices are a distributed monolith with extra latency.",
      "GitOps is just fancy git hooks.",
      "CI/CD pipelines are the new single point of failure.",
      "Infrastructure as Code is great until someone deploys production to staging.",
    ],
  },
  {
    category: "cloud",
    templates: [
      "Cloud vendor lock-in is a feature, not a bug.",
      "Serverless is just renting someone else's computer by the millisecond.",
      "Multi-cloud is a myth. Pick one and master it.",
      "The cloud isn't cheaper. It's just faster to spend money.",
      "Your cloud bill is the only metric that scales perfectly with your business.",
    ],
  },
  {
    category: "ai",
    templates: [
      "AI security is regular security with buzzwords.",
      "LLMs will replace junior developers, not senior engineers.",
      "Prompt engineering is just being good at asking questions.",
      "AI code review is like having a junior developer who never sleeps.",
      "The best AI is the one that doesn't hallucinate — which doesn't exist yet.",
    ],
  },
]

export function generateHotTake(category?: string): HotTake {
  const categoryGroup = category
    ? hotTakeTemplates.find((t) => t.category === category)
    : hotTakeTemplates[Math.floor(Math.random() * hotTakeTemplates.length)]

  if (!categoryGroup) {
    throw new Error(`Invalid category: ${category}`)
  }

  const template = categoryGroup.templates[Math.floor(Math.random() * categoryGroup.templates.length)]
  const controversyLevels: ("mild" | "medium" | "spicy")[] = ["mild", "medium", "spicy"]
  const controversy = controversyLevels[Math.floor(Math.random() * controversyLevels.length)]

  return {
    id: `hot-take-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: generateTitle(template),
    content: template,
    category: categoryGroup.category as any,
    controversy,
    engagement: {
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
      shares: Math.floor(Math.random() * 50) + 5,
    },
  }
}

function generateTitle(content: string): string {
  const words = content.split(" ")
  if (words.length <= 5) {
    return content
  }
  return words.slice(0, 6).join(" ") + "..."
}

export function getTrendingHotTakes(count: number = 5): HotTake[] {
  const takes: HotTake[] = []
  for (let i = 0; i < count; i++) {
    takes.push(generateHotTake())
  }
  return takes.sort((a, b) => b.engagement.likes - a.engagement.likes)
}

export function getHotTakeByCategory(category: string, count: number = 3): HotTake[] {
  const takes: HotTake[] = []
  for (let i = 0; i < count; i++) {
    takes.push(generateHotTake(category))
  }
  return takes
}
