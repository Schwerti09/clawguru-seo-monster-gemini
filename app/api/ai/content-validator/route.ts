/**
 * PHASE 2b: Content Validator API Endpoint
 * 
 * POST /api/ai/content-validator
 * 
 * Validates batch-generated content against:
 * - Content structure (required fields)
 * - E-E-A-T scoring (Expertise, Authoritativeness, Trustworthiness)  
 * - Abo-Relevance scoring (subscription conversion signals)
 * - Flags low-confidence items for human review
 */

import { NextRequest, NextResponse } from "next/server"
import { validateAIContent, validateAIContentBatch } from "@/lib/ai/content-validator"
import { addToReviewQueue } from "@/app/api/ai/human-review-queue/route"
import type { BatchContentResult } from "@/lib/ai/batch-prompts"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

/**
 * POST /api/ai/content-validator
 * 
 * Accepts:
 * - Single content item: { contentType, contentData }
 * - Batch results: { contentType, results: [] (from batch API) }
 * - Job poll: { jobId } (fetch results from batch job and validate)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Case 1: Validate single content item
    if (body.contentData && !body.jobId && !body.results) {
      const { contentType, contentData } = body

      if (!contentType) {
        return NextResponse.json({ error: "Missing contentType" }, { status: 400 })
      }

      if (!contentData) {
        return NextResponse.json({ error: "Missing contentData" }, { status: 400 })
      }

      // Wrap in BatchContentResult format
      const result: BatchContentResult = {
        title: contentData.title || "Untitled",
        summary: contentData.summary || "",
        content: JSON.stringify(contentData),
        keywords: contentData.keywords || [],
        estimatedReadTime: contentData.estimatedReadTime || 0,
        metadata: {
          generatedAt: new Date().toISOString(),
          contentType,
          confidence: contentData.confidence || 0.85,
        },
      }

      const report = validateAIContent(result, contentType)

      return NextResponse.json(
        {
          status: "validated",
          report,
          recommendation: report.reviewRequired ? "REVIEW REQUIRED" : `READY TO PUBLISH (${report.tier}`,
        },
        { status: 200 }
      )
    }

    // Case 2: Validate batch results
    if (body.contentType && body.results && Array.isArray(body.results)) {
      const { contentType, results } = body

      if (!contentType) {
        return NextResponse.json({ error: "Missing contentType" }, { status: 400 })
      }

      const validation = validateAIContentBatch(results, contentType)

      // Auto-fill human review queue for low-confidence items
      try {
        validation.reports.forEach((report: any, idx: number) => {
          if (report.reviewRequired || report.tier === "bronze") {
            let parsedContent: any = null
            try {
              parsedContent = JSON.parse(results[idx]?.content || "{}")
            } catch {
              parsedContent = results[idx]?.content || {}
            }
            addToReviewQueue({
              contentId: report.contentId,
              title: report.title || results[idx]?.title || "Untitled",
              contentType,
              confidence: report.confidenceScore,
              tier: report.tier === "bronze" ? "bronze" : "review-required",
              reason: report.reviewReason || (report.violations?.[0]?.message ?? "Low confidence"),
              eeatScore: report.eeat?.overall ?? 0,
              aboScore: report.aboRelevance?.overall ?? 0,
              content: parsedContent,
            })
          }
        })
      } catch (e) {
        console.warn("[content-validator] Failed to enqueue review items:", e)
      }

      return NextResponse.json(
        {
          status: "batch-validated",
          results: validation.reports,
          summary: validation.summary,
          review_queue: validation.reports.filter((r) => r.reviewRequired).map((r) => ({
            contentId: r.contentId,
            title: r.title,
            reason: r.reviewReason,
            confidence: r.confidenceScore,
          })),
        },
        { status: 200 }
      )
    }

    // Case 3: Fetch & validate batch job results
    if (body.jobId) {
      const { jobId, contentType } = body

      if (!contentType) {
        return NextResponse.json({ error: "Missing contentType for batch job" }, { status: 400 })
      }

      // Fetch batch job status from batch-generate API
      try {
        const batchResponse = await fetch(
          new URL(`/api/ai/batch-generate/${jobId}`, request.nextUrl.origin),
          {
            method: "GET",
          }
        )

        if (!batchResponse.ok) {
          return NextResponse.json(
            { error: `Batch job not found: ${jobId}` },
            { status: 404 }
          )
        }

        const batchStatus = await batchResponse.json()

        if (batchStatus.status !== "completed") {
          return NextResponse.json(
            { error: `Batch job not completed yet (status: ${batchStatus.status})` },
            { status: 202 }
          )
        }

        const results: BatchContentResult[] = batchStatus.results || []
        const validation = validateAIContentBatch(results, contentType)

        // Auto-fill human review queue with batchId context
        try {
          validation.reports.forEach((report: any, idx: number) => {
            if (report.reviewRequired || report.tier === "bronze") {
              let parsedContent: any = null
              try {
                parsedContent = JSON.parse(results[idx]?.content || "{}")
              } catch {
                parsedContent = results[idx]?.content || {}
              }
              addToReviewQueue({
                contentId: report.contentId,
                batchId: jobId,
                title: report.title || results[idx]?.title || "Untitled",
                contentType,
                confidence: report.confidenceScore,
                tier: report.tier === "bronze" ? "bronze" : "review-required",
                reason: report.reviewReason || (report.violations?.[0]?.message ?? "Low confidence"),
                eeatScore: report.eeat?.overall ?? 0,
                aboScore: report.aboRelevance?.overall ?? 0,
                content: parsedContent,
              })
            }
          })
        } catch (e) {
          console.warn("[content-validator] Failed to enqueue review items for batch:", e)
        }

        return NextResponse.json(
          {
            status: "batch-validated",
            jobId,
            batchStats: {
              total: results.length,
              generatedTs: batchStatus.telemetry.startTime,
              tokensUsed: batchStatus.telemetry.tokensUsed,
              durationMs: batchStatus.telemetry.durationMs,
            },
            results: validation.reports,
            summary: validation.summary,
            review_queue: validation.reports.filter((r) => r.reviewRequired).map((r) => ({
              contentId: r.contentId,
              title: r.title,
              reason: r.reviewReason,
              confidence: r.confidenceScore,
              eeat: r.eeat.overall,
              aboRelevance: r.aboRelevance.overall,
            })),
          },
          { status: 200 }
        )
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to fetch batch job: " + (error instanceof Error ? error.message : String(error)) },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      {
        error: "Invalid request format. Provide one of: contentData, results array, or jobId",
      },
      { status: 400 }
    )
  } catch (error) {
    console.error("[content-validator] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ai/content-validator
 * 
 * Usage info + schema documentation
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      endpoint: "/api/ai/content-validator",
      methods: ["POST"],
      usage: {
        validateSingleContent: {
          description: "Validate a single AI-generated content item",
          body: {
            contentType: "runbook | security-guide | tool-review | faq",
            contentData: { title: "...", summary: "...", content: "..." },
          },
        },
        validateBatchResults: {
          description: "Validate batch API results (array of BatchContentResult)",
          body: {
            contentType: "runbook | security-guide | tool-review | faq",
            results: [
              {
                title: "...",
                summary: "...",
                content: "...",
                keywords: [],
                metadata: { generatedAt: "...", contentType: "..." },
              },
            ],
          },
        },
        validateBatchJob: {
          description: "Validate results from a completed batch job",
          body: {
            jobId: "batch_001",
            contentType: "runbook | security-guide | tool-review | faq",
          },
        },
      },
      response: {
        status: "validated | batch-validated",
        report: {
          title: "Content title",
          contentType: "Content type",
          confidenceScore: 0-100,
          tier: "gold | silver | bronze | review-required",
          eeat: {
            expertise: 0-100,
            authoritativeness: 0-100,
            trustworthiness: 0-100,
            overall: 0-100,
          },
          aboRelevance: {
            hasCTASignals: true,
            proposesTimelineForLimit: false,
            emphasizesEffort: true,
            hasEnterpriseContext: false,
            featureMaturity: 0-100,
            overall: 0-100,
          },
          reviewRequired: true,
          violations: [
            {
              category: "structure | eeat | abo-relevance | content",
              severity: "error | warning | info",
              message: "...",
            },
          ],
        },
        review_queue: [
          {
            contentId: "...",
            title: "...",
            reason: "Reason for review",
            confidence: 45,
            eeat: 52,
            aboRelevance: 38,
          },
        ],
        summary: {
          total: 100,
          gold: 25,
          silver: 45,
          bronze: 20,
          reviewRequired: 10,
          avgConfidence: 78,
          topViolations: [{ message: "...", count: 15 }],
        },
      },
    },
    { status: 200 }
  )
}
