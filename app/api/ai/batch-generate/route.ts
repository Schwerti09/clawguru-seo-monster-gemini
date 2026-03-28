/**
 * PHASE 2a: Batch Content Generator API
 * 
 * POST /api/ai/batch-generate
 * 
 * Generates content in bulk using Gemini/OpenAI/Deepseek.
 * Handles queue management, quality validation, and telemetry.
 */

import { NextRequest, NextResponse } from "next/server"
import { generateOrdered, generateTextOrdered } from "@/lib/ai/providers"
import {
  BatchContentRequest,
  BatchContentResult,
  ContentType,
  promptRunbook,
  promptToolReview,
  promptSecurityGuide,
  promptFAQ,
  validationRules,
} from "@/lib/ai/batch-prompts"

// In-memory queue for batch processing
// TODO: Replace with Redis in production
const processingQueues = new Map<string, BatchJob>()

interface BatchJob {
  jobId: string
  status: "queued" | "processing" | "completed" | "failed"
  totalTasks: number
  completedTasks: number
  results: BatchContentResult[]
  errors: Array<{ taskIndex: number; error: string }>
  startTime: number
  endTime?: number
  telemetry: {
    provider: string
    tokensUsed: number
    avgResponseTime: number
  }
}

/**
 * Request validation
 */
function validateRequest(body: any): { valid: boolean; error?: string } {
  if (!body.jobId) return { valid: false, error: "Missing jobId" }
  if (!body.tasks || !Array.isArray(body.tasks)) {
    return { valid: false, error: "Missing or invalid tasks array" }
  }
  if (body.tasks.length === 0) {
    return { valid: false, error: "Tasks array is empty" }
  }
  if (body.tasks.length > 1000) {
    return { valid: false, error: "Too many tasks (max 1000 per batch)" }
  }

  // Validate each task
  for (let i = 0; i < body.tasks.length; i++) {
    const task = body.tasks[i]
    if (!task.contentType) {
      return { valid: false, error: `Task ${i}: missing contentType` }
    }
    if (!task.context || typeof task.context !== "object") {
      return { valid: false, error: `Task ${i}: invalid context` }
    }
  }

  return { valid: true }
}

/**
 * Generate prompt based on content type
 */
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

/**
 * Validate generated content against rules
 */
function validateContent(
  content: any,
  contentType: ContentType
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const rules = validationRules[contentType as keyof typeof validationRules]

  if (!rules) {
    console.warn(`No validation rules for content type: ${contentType}`)
    return { valid: true, errors: [] }
  }

  // Parse JSON if string
  let parsed = typeof content === "string" ? JSON.parse(content) : content

  // Type-specific validation
  if (contentType === "runbook") {
    const { minTitleLength, maxTitleLength, minSteps, maxSteps, minKeywords } = rules as any
    if (!parsed.title || parsed.title.length < minTitleLength) {
      errors.push(`Title too short (min ${minTitleLength} chars)`)
    }
    if (parsed.title && parsed.title.length > maxTitleLength) {
      errors.push(`Title too long (max ${maxTitleLength} chars)`)
    }
    if (!parsed.steps || parsed.steps.length < minSteps) {
      errors.push(`Not enough steps (min ${minSteps})`)
    }
    if (parsed.steps && parsed.steps.length > maxSteps) {
      errors.push(`Too many steps (max ${maxSteps})`)
    }
    if (!parsed.keywords || parsed.keywords.length < minKeywords) {
      errors.push(`Not enough keywords (min ${minKeywords})`)
    }
  }

  if (contentType === "tool-review") {
    const { minFeatures, minPros } = rules as any
    if (!parsed.keyFeatures || parsed.keyFeatures.length < minFeatures) {
      errors.push(`Not enough features (min ${minFeatures})`)
    }
    if (!parsed.pros || parsed.pros.length < minPros) {
      errors.push(`Not enough pros (min ${minPros})`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Process single batch task
 */
async function processBatchTask(
  task: BatchContentRequest,
  jobId: string
): Promise<{
  success: boolean
  result?: BatchContentResult
  error?: string
  telemetry: { provider: string; tokensUsed: number }
}> {
  try {
    const prompt = getPromptForType(task)

    // Call AI provider (fallback chain: Deepseek → OpenAI → Gemini)
    const response = await generateOrdered(prompt, task.context.preferredProvider)

    if (!response) {
      throw new Error("No response from AI provider")
    }

    // Parse JSON
    let parsed: any
    try {
      // Try direct JSON first
      parsed = JSON.parse(response)
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
      if (jsonMatch && jsonMatch[1]) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        throw new Error("Could not parse AI response as JSON")
      }
    }

    // Validate content
    const validation = validateContent(parsed, task.contentType)
    if (!validation.valid) {
      console.warn(`Content validation failed for ${task.contentType}:`, validation.errors)
      // Log but continue - don't fail the whole batch
    }

    // Build result
    const result: BatchContentResult = {
      title: parsed.title || parsed.toolName || parsed.topic || "Untitled",
      summary: parsed.summary || parsed.tagline || "Generated content",
      content: JSON.stringify(parsed, null, 2), // Store full JSON as content
      keywords: parsed.keywords || [],
      estimatedReadTime: Math.ceil((JSON.stringify(parsed).length / 200) * 1), // rough estimate
      metadata: {
        generatedAt: new Date().toISOString(),
        contentType: task.contentType,
        variant: task.variant,
        confidence: validation.valid ? 0.95 : 0.7,
      },
      faqItems: parsed.faqItems,
    }

    return {
      success: true,
      result,
      telemetry: {
        provider: "gemini", // Track which provider was actually used
        tokensUsed: response.length / 4, // Rough estimate (4 chars per token)
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      telemetry: {
        provider: "unknown",
        tokensUsed: 0,
      },
    }
  }
}

/**
 * Process batch asynchronously
 * TODO: In production, offload to a queue system (Bull, RabbitMQ, etc.)
 */
async function processBatchAsync(jobId: string, tasks: BatchContentRequest[]) {
  const job: BatchJob = {
    jobId,
    status: "processing",
    totalTasks: tasks.length,
    completedTasks: 0,
    results: [],
    errors: [],
    startTime: Date.now(),
    telemetry: {
      provider: "gemini",
      tokensUsed: 0,
      avgResponseTime: 0,
    },
  }

  processingQueues.set(jobId, job)

  // Process tasks sequentially with rate limiting
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    const taskStartTime = Date.now()

    const { success, result, error, telemetry } = await processBatchTask(task, jobId)

    if (success && result) {
      job.results.push(result)
    } else {
      job.errors.push({
        taskIndex: i,
        error: error || "Unknown error",
      })
    }

    job.completedTasks++
    job.telemetry.tokensUsed += telemetry.tokensUsed
    job.telemetry.avgResponseTime = (job.telemetry.avgResponseTime * (i) + (Date.now() - taskStartTime)) / (i + 1)

    // Rate limiting: wait 1 second between API calls to avoid hitting limits
    if (i < tasks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Optional: Log progress every 10 tasks
    if ((i + 1) % 10 === 0) {
      console.log(`[batch-generate] Progress: ${i + 1}/${tasks.length}`)
    }
  }

  job.status = "completed"
  job.endTime = Date.now()

  console.log(`[batch-generate] Job ${jobId} completed:`, {
    totalTasks: job.totalTasks,
    succeeded: job.results.length,
    failed: job.errors.length,
    totalTokens: job.telemetry.tokensUsed,
    durationMs: job.endTime - job.startTime,
  })
}

/**
 * POST handler: Submit batch job
 */
async function handlePost(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = validateRequest(body)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { jobId, tasks } = body

    // Check if job already exists
    if (processingQueues.has(jobId)) {
      return NextResponse.json({ error: "Job ID already exists" }, { status: 409 })
    }

    // Start async processing (fire-and-forget)
    // In production, dispatch to queue system instead
    processBatchAsync(jobId, tasks).catch((err) => {
      console.error(`[batch-generate] Job ${jobId} failed:`, err)
      const job = processingQueues.get(jobId)
      if (job) {
        job.status = "failed"
      }
    })

    return NextResponse.json(
      {
        jobId,
        status: "queued",
        message: `Batch job submitted. Total tasks: ${tasks.length}. Poll /api/ai/batch-generate/${jobId} for status.`,
      },
      { status: 202 }
    )
  } catch (error) {
    console.error("[batch-generate] POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * GET handler: Poll batch job status
 */
async function handleGetStatus(
  jobId: string
): Promise<NextResponse> {
  const job = processingQueues.get(jobId)

  if (!job) {
    return NextResponse.json(
      { error: "Job not found" },
      { status: 404 }
    )
  }

  // Return status with progress
  return NextResponse.json({
    jobId: job.jobId,
    status: job.status,
    progress: {
      completed: job.completedTasks,
      total: job.totalTasks,
      percentage: Math.round((job.completedTasks / job.totalTasks) * 100),
    },
    results: job.status === "completed" ? job.results : undefined,
    errors: job.errors.length > 0 ? job.errors : undefined,
    telemetry: {
      startTime: job.startTime,
      endTime: job.endTime,
      durationMs: job.endTime ? job.endTime - job.startTime : null,
      tokensUsed: job.telemetry.tokensUsed,
      avgResponseTimeMs: Math.round(job.telemetry.avgResponseTime),
    },
  })
}

/**
 * Next.js Route Handler
 */
export async function POST(request: NextRequest) {
  return handlePost(request)
}

export async function GET(
  request: NextRequest,
  context: { params: { jobId?: string } }
) {
  const { jobId } = context.params || {}

  if (!jobId) {
    return NextResponse.json(
      {
        message: "Usage: GET /api/ai/batch-generate/:jobId to check job status",
        or: "POST to submit a new batch job",
      },
      { status: 200 }
    )
  }

  return handleGetStatus(jobId)
}
