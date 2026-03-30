/**
 * PHASE 2c (interim): Chunked Generation API for reliable serverless execution
 * 
 * POST /api/ai/generate-chunk
 * - Accepts up to 6 tasks and returns results synchronously
 * - Avoids long-running background queues on serverless
 */

import { NextRequest, NextResponse } from "next/server"
import { generateOrdered } from "@/lib/ai/providers"
import type { BatchContentRequest, BatchContentResult, ContentType } from "@/lib/ai/batch-prompts"
import { promptRunbook, promptToolReview, promptSecurityGuide, promptFAQ } from "@/lib/ai/batch-prompts"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getPromptForType(task: BatchContentRequest): string {
  switch (task.contentType) {
    case "runbook":
      return promptRunbook({
        provider: task.context.provider || "generic",
        service: task.context.service || "service",
        issue: task.context.issue || "issue",
        year: task.context.year || new Date().getFullYear().toString(),
        tone: task.tone,
      })
    case "tool-review":
      return promptToolReview({
        toolName: task.context.toolName || "Tool",
        category: task.context.category || "Tools",
        competitors: task.context.competitors ? task.context.competitors.split(",") : [],
        year: task.context.year || new Date().getFullYear().toString(),
      })
    case "security-guide":
      return promptSecurityGuide({
        topic: task.context.topic || "Security",
        technology: task.context.technology || "Technology",
        severity: (task.context.severity as any) || "P2-High",
        year: task.context.year || new Date().getFullYear().toString(),
      })
    case "faq":
      return promptFAQ({
        topic: task.context.topic || "Topic",
        answerLength: (task.context.answerLength as any) || "medium",
      })
    default:
      throw new Error(`Unknown content type: ${task.contentType}`)
  }
}

async function generateOne(task: BatchContentRequest): Promise<{
  success: boolean
  result?: BatchContentResult
  error?: string
}> {
  try {
    const prompt = getPromptForType(task)
    const { parsed: aiParsed, raw } = await generateOrdered(prompt, task.context.preferredProvider as any)
    if (!aiParsed && !raw) throw new Error("No response from AI provider")

    let parsed: any = aiParsed
    if (!parsed && typeof raw === "string") {
      try { parsed = JSON.parse(raw) } catch {
        const m = raw.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
        if (m && m[1]) parsed = JSON.parse(m[1])
      }
    }
    if (!parsed) throw new Error("Could not parse AI response as JSON")

    const result: BatchContentResult = {
      title: parsed.title || parsed.toolName || parsed.topic || "Untitled",
      summary: parsed.summary || parsed.tagline || "Generated content",
      content: JSON.stringify(parsed, null, 2),
      keywords: parsed.keywords || [],
      estimatedReadTime: Math.ceil((JSON.stringify(parsed).length / 200) * 1),
      metadata: {
        generatedAt: new Date().toISOString(),
        contentType: task.contentType,
        variant: task.variant,
        confidence: 0.85,
      },
      faqItems: parsed.faqItems,
    }

    return { success: true, result }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tasks: BatchContentRequest[] = body?.tasks

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: "Provide tasks[]" }, { status: 400 })
    }

    if (tasks.length > 6) {
      return NextResponse.json({ error: "Max 6 tasks per chunk" }, { status: 400 })
    }

    const started = Date.now()
    const results: BatchContentResult[] = []
    const errors: Array<{ index: number; error: string }> = []

    for (let i = 0; i < tasks.length; i++) {
      const r = await generateOne(tasks[i])
      if (r.success && r.result) results.push(r.result)
      else errors.push({ index: i, error: r.error || "Unknown error" })

      if (i < tasks.length - 1) await new Promise((res) => setTimeout(res, 800))
    }

    return NextResponse.json({
      status: "completed",
      total: tasks.length,
      results,
      errors,
      durationMs: Date.now() - started,
    })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
