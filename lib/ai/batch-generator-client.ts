/**
 * Batch Content Generator Client
 * 
 * Use this to submit and monitor batch generation jobs from anywhere in the app.
 * 
 * Example:
 * ```
 * const client = new BatchGeneratorClient()
 * const jobId = await client.submitBatch([
 *   { contentType: "runbook", context: { provider: "AWS", service: "EC2", issue: "High CPU", year: "2024" } },
 *   { contentType: "security-guide", context: { topic: "SSH Hardening", technology: "Linux" } }
 * ])
 * 
 * const status = await client.getStatus(jobId)
 * console.log(`Progress: ${status.progress.percentage}%`)
 * ```
 */

import { BatchContentRequest, BatchContentResult } from "./batch-prompts"

export interface BatchJobStatus {
  jobId: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: {
    completed: number
    total: number
    percentage: number
  }
  results?: BatchContentResult[]
  errors?: Array<{ taskIndex: number; error: string }>
  telemetry: {
    startTime: number
    endTime?: number
    durationMs?: number
    tokensUsed: number
    avgResponseTimeMs: number
  }
}

export class BatchGeneratorClient {
  private baseUrl: string

  constructor(baseUrl: string = "/api/ai/batch-generate") {
    this.baseUrl = baseUrl
  }

  /**
   * Submit a batch generation job
   * 
   * @param tasks Array of content generation tasks
   * @param jobId Optional job ID (auto-generated if not provided)
   * @returns Job ID for polling updates
   */
  async submitBatch(
    tasks: BatchContentRequest[],
    jobId?: string
  ): Promise<string> {
    const id = jobId || `batch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, tasks }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to submit batch job (${response.status})`)
    }

    const data = await response.json()
    return data.jobId
  }

  /**
   * Get batch job status and results
   */
  async getStatus(jobId: string): Promise<BatchJobStatus> {
    const response = await fetch(`${this.baseUrl}/${jobId}`, {
      method: "GET",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Failed to get batch status (${response.status})`)
    }

    return response.json()
  }

  /**
   * Poll until batch job completes
   * 
   * @param jobId Job to monitor
   * @param maxWaitMs Maximum time to wait (default: 30 minutes)
   * @param pollIntervalMs Time between polls (default: 2 seconds)
   */
  async waitForCompletion(
    jobId: string,
    maxWaitMs: number = 30 * 60 * 1000,
    pollIntervalMs: number = 2000
  ): Promise<BatchJobStatus> {
    const startTime = Date.now()

    while (true) {
      const status = await this.getStatus(jobId)

      if (status.status === "completed" || status.status === "failed") {
        return status
      }

      if (Date.now() - startTime > maxWaitMs) {
        throw new Error(`Batch job ${jobId} did not complete within ${maxWaitMs}ms`)
      }

      console.log(`[batch] Job ${jobId}: ${status.progress.percentage}% (${status.progress.completed}/${status.progress.total})`)
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs))
    }
  }

  /**
   * Helper: Generate runbook content
   */
  generateRunbook({
    provider,
    service,
    issue,
    year = new Date().getFullYear().toString(),
  }: {
    provider: string
    service: string
    issue: string
    year?: string
  }): BatchContentRequest {
    return {
      contentType: "runbook",
      context: { provider, service, issue, year },
    }
  }

  /**
   * Helper: Generate tool review
   */
  generateToolReview({
    toolName,
    category,
    competitors,
    year = new Date().getFullYear().toString(),
  }: {
    toolName: string
    category: string
    competitors?: string[]
    year?: string
  }): BatchContentRequest {
    return {
      contentType: "tool-review",
      context: {
        toolName,
        category,
        competitors: competitors?.join(","),
        year,
      },
    }
  }

  /**
   * Helper: Generate security guide
   */
  generateSecurityGuide({
    topic,
    technology,
    severity = "P2-High",
    year = new Date().getFullYear().toString(),
  }: {
    topic: string
    technology: string
    severity?: "P1-Critical" | "P2-High" | "P3-Medium"
    year?: string
  }): BatchContentRequest {
    return {
      contentType: "security-guide",
      context: { topic, technology, severity, year },
    }
  }

  /**
   * Helper: Generate FAQ
   */
  generateFAQ({
    topic,
    answerLength = "medium",
  }: {
    topic: string
    answerLength?: "short" | "medium" | "long"
  }): BatchContentRequest {
    return {
      contentType: "faq",
      context: { topic, answerLength },
    }
  }
}
