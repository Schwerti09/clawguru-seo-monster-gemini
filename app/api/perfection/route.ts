/**
 * PERFECTION MODE: Premium Content Generator API
 * 
 * Generiert Production-Ready Next.js Landingpages
 * Cost: ~$0.05-0.10 | Sell: €35-150 | Margin: 1000%+
 */

import { NextRequest, NextResponse } from "next/server"
import { generateTextOrdered } from "@/lib/ai/providers"

const PRICING = {
  basic: { name: "Basic", tokens: 2000, cost: 0.02, quality: "standard", price: 35 },
  premium: { name: "Premium", tokens: 4000, cost: 0.05, quality: "high", price: 75 },
  ultra: { name: "Ultra", tokens: 8000, cost: 0.10, quality: "perfection", price: 150 },
}

const PREMIUM_RULES = {
  minWords: 2000,
  minCodeExamples: 3,
}

interface PremiumRequest {
  jobId: string
  topic: string
  category: string
  keywords: string[]
  tier: keyof typeof PRICING
  includePricing?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: PremiumRequest = await request.json()
    
    if (!body.topic || !body.category) {
      return NextResponse.json({ error: "Missing topic or category" }, { status: 400 })
    }

    const tier = PRICING[body.tier || "premium"]
    
    // Build prompt
    const prompt = buildPrompt(body, tier)

    // Provider order is managed centrally via AI_PROVIDER_ORDER env var
    const system = "You are the ClawGuru Next.js Page Factory. Return ONLY valid Next.js 14 page.tsx JSX, no markdown fences, no explanations. Bilingual (DE+EN). Include SEO metadata, hero, features, real code examples inside <pre>, checklists, CTA, and JSON-LD. Escape any ${} that would conflict inside JSX string literals."
    const { text, provider } = await generateTextOrdered(system, prompt)
    if (!text) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 })
    }

    // Validate
    const content = text
    const validation = validateContent(content, tier)

    return NextResponse.json({
      jobId: body.jobId,
      status: "completed",
      tier: tier.name,
      content,
      validation,
      provider,
      roi: {
        cost: tier.cost,
        sellPrice: tier.price,
        margin: Math.round((tier.price / tier.cost) * 100),
      },
    })

  } catch (error) {
    console.error("[perfection] Error:", error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}

function buildPrompt(req: PremiumRequest, tier: any): string {
  const wordCount = tier.quality === "ultra" ? "3000-5000" : tier.quality === "premium" ? "2000-3000" : "1000-2000"
  const codeCount = tier.quality === "ultra" ? "5-8" : tier.quality === "premium" ? "3-5" : "2-3"
  
  return `Generate a PRODUCTION-READY Next.js 14 page.tsx for: "${req.topic}"

TIER: ${tier.name} (${tier.quality})
WORDS: ${wordCount}
CODE EXAMPLES: ${codeCount} (real, working)
KEYWORDS: ${req.keywords.join(", ")}

STRUCTURE:
1. SEO Metadata (10 keywords, OpenGraph, canonical)
2. Hero with gradient (unique colors for ${req.category})
3. Overview section (3-column feature grid)
4. ${codeCount} Code examples (Terraform, Docker, K8s YAML)
5. Interactive checklist (8-12 items with ☐)
6. CTA section with pricing
7. JSON-LD schema

OUTPUT: Complete page.tsx code only. German + English bilingual.`
}

function validateContent(content: string, tier: any) {
  const wordCount = content.split(/\s+/).length
  const codeExamples = (content.match(/<pre className=/g) || []).length
  
  return {
    wordCount,
    codeExamples,
    passed: wordCount >= PREMIUM_RULES.minWords && codeExamples >= PREMIUM_RULES.minCodeExamples,
    qualityScore: Math.min(100, Math.round((wordCount / 3000) * 50 + (codeExamples / 5) * 50)),
  }
}
