# Phase 2a: Batch Content Generator API

## Overview

The Batch Content Generator API enables bulk content creation using Gemini/OpenAI/Deepseek AI models.

**Endpoint:** `POST /api/ai/batch-generate`  
**Status Check:** `GET /api/ai/batch-generate/:jobId`

## Quick Start

### 1. Submit a Batch Job

```bash
curl -X POST http://localhost:3000/api/ai/batch-generate \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "batch_001",
    "tasks": [
      {
        "contentType": "runbook",
        "context": {
          "provider": "AWS",
          "service": "EC2",
          "issue": "High CPU Usage",
          "year": "2024"
        }
      },
      {
        "contentType": "security-guide",
        "context": {
          "topic": "SSH Hardening",
          "technology": "Linux",
          "severity": "P1-Critical"
        }
      }
    ]
  }'
```

**Response (202 Accepted):**
```json
{
  "jobId": "batch_001",
  "status": "queued",
  "message": "Batch job submitted. Total tasks: 2. Poll /api/ai/batch-generate/batch_001 for status."
}
```

### 2. Poll Job Status

```bash
curl http://localhost:3000/api/ai/batch-generate/batch_001
```

**Response:**
```json
{
  "jobId": "batch_001",
  "status": "processing",
  "progress": {
    "completed": 1,
    "total": 2,
    "percentage": 50
  },
  "telemetry": {
    "startTime": 1704067200000,
    "endTime": null,
    "durationMs": null,
    "tokensUsed": 4521,
    "avgResponseTimeMs": 4521
  }
}
```

When `status === "completed"`, the response includes `results`:

```json
{
  "jobId": "batch_001",
  "status": "completed",
  "progress": { "completed": 2, "total": 2, "percentage": 100 },
  "results": [
    {
      "title": "Fix AWS EC2 High CPU Usage",
      "summary": "Step-by-step runbook for incident response",
      "content": "{...full JSON...}",
      "keywords": ["aws", "ec2", "cpu", "monitoring"],
      "estimatedReadTime": 8,
      "metadata": {
        "generatedAt": "2024-01-01T12:00:00.000Z",
        "contentType": "runbook",
        "confidence": 0.95
      }
    },
    ...
  ],
  "telemetry": {
    "startTime": 1704067200000,
    "endTime": 1704067230000,
    "durationMs": 30000,
    "tokensUsed": 9042,
    "avgResponseTimeMs": 4521
  }
}
```

## Using the TypeScript Client

```typescript
import { BatchGeneratorClient } from "@/lib/ai/batch-generator-client"

const client = new BatchGeneratorClient()

// Submit batch
const jobId = await client.submitBatch([
  client.generateRunbook({
    provider: "AWS",
    service: "EC2",
    issue: "High CPU",
  }),
  client.generateSecurityGuide({
    topic: "SSH Hardening",
    technology: "Linux",
    severity: "P1-Critical",
  }),
])

// Wait for completion
const status = await client.waitForCompletion(jobId)
console.log(`✅ Generated ${status.results?.length} items`)
```

## Content Types Supported

### 1. Runbook
Generate step-by-step incident response procedures.

**Required Context:**
- `provider`: "AWS", "GCP", "Azure", "Linux", etc.
- `service`: Service name
- `issue`: Problem description
- `year`: Target year for best practices

**Output includes:** Triage steps, root cause, fix commands, verification, prevention tips

### 2. Tool Review
Compare features, pricing, pros/cons of DevOps tools.

**Required Context:**
- `toolName`: Name of the tool
- `category`: "Monitoring", "CI/CD", "Security", etc.
- `competitors`: Optional comma-separated list

**Output includes:** Features, pricing, pros/cons, when to use, alternatives

### 3. Security Guide
Hardening guides with compliance & CVE context.

**Required Context:**
- `topic`: Security topic
- `technology`: Technology to harden
- `severity`: "P1-Critical", "P2-High", "P3-Medium"

**Output includes:** Compliance mappings, CVEs, hardening steps, monitoring

### 4. FAQ
Generate question-answer pairs for a topic.

**Required Context:**
- `topic`: Topic name
- `answerLength`: "short", "medium", or "long" (default: medium)

**Output includes:** 8-12 Q&A pairs from beginner → advanced

## Quality Validation

All generated content is automatically validated against rules:

| Content Type | Min Steps | Max Steps | Min Keywords | Validation |
|---|---|---|---|---|
| Runbook | 3 | 15 | 3 | Title, steps, keywords, summary |
| Tool Review | 5 features | 12 features | - | Features, pros, cons |
| Security Guide | 4 steps | 12 steps | - | CVE references, hardening steps |

**Low-confidence content** (validation fails) is still returned but marked with `confidence: 0.7` instead of `0.95`.

## Rate Limiting & Performance

- **Sequential Processing:** Tasks are processed sequentially (1 per second) to respect AI provider rate limits
- **Max Batch Size:** 1000 tasks per job
- **Timeout:** Default 30 minutes per batch
- **Tokens:** Estimated 4K tokens per task (varies by content type)

## Advanced Usage

### Custom Prompts

Extend batch generation by creating custom prompt functions in [lib/ai/batch-prompts.ts](../lib/ai/batch-prompts.ts):

```typescript
export function promptCustomType(ctx: { /* params */ }): string {
  return `You are an expert...
  Generate content with this structure:
  [your prompt]`
}
```

### Monitoring & Telemetry

Each batch job includes telemetry:

```json
{
  "telemetry": {
    "startTime": 1704067200000,
    "endTime": 1704067230000,
    "durationMs": 30000,
    "tokensUsed": 9042,
    "avgResponseTimeMs": 4521,
    "provider": "gemini"
  }
}
```

Use this to track:
- Generation costs (tokens × rate)
- Provider performance (which AI gives best quality?)
- Batch efficiency (throughput over time)

### Scaling to Production

Current implementation uses **in-memory queue**. For production, integrate with:

- **Redis:** Persistent job state + pub/sub for notifications
- **Bull/RabbitMQ:** Distributed job queue
- **Temporal/Airflow:** Workflow orchestration
- **Database:** Store results in PostgreSQL instead of memory

## Error Handling

**At task level:** Failed tasks are logged but don't stop the batch. Results will include `errors` array:

```json
{
  "errors": [
    {
      "taskIndex": 2,
      "error": "Content validation failed: Not enough keywords (min 3)"
    }
  ]
}
```

**At job level:** Job can fail if all tasks fail or system error occurs. Check `status === "failed"` in response.

## Example: Batch Generate 100 Runbooks

```typescript
import { BatchGeneratorClient } from "@/lib/ai/batch-generator-client"

const PROVIDERS = ["AWS", "GCP", "Azure"]
const SERVICES = ["EC2", "ECS", "Lambda", "RDS"]
const ISSUES = ["High CPU", "High Memory", "Network Latency", "Auth Failures"]

async function generateRunbookBatch() {
  const client = new BatchGeneratorClient()
  const tasks = []

  for (const provider of PROVIDERS) {
    for (const service of SERVICES) {
      for (const issue of ISSUES) {
        tasks.push(
          client.generateRunbook({
            provider,
            service,
            issue,
            year: "2024",
          })
        )
      }
    }
  }

  console.log(`📦 Submitting ${tasks.length} tasks...`)
  const jobId = await client.submitBatch(tasks)

  console.log(`🔄 Waiting for completion...`)
  const status = await client.waitForCompletion(jobId, 60 * 60 * 1000) // 1 hour max

  console.log(`✅ Batch complete:`)
  console.log(`   - Generated: ${status.results?.length}`)
  console.log(`   - Failed: ${status.errors?.length}`)
  console.log(`   - Duration: ${status.telemetry.durationMs}ms`)
  console.log(`   - Tokens: ${status.telemetry.tokensUsed}`)

  // Save results to database
  // db.bulkInsert(status.results)
}
```

## Cost Estimation

Using Gemini API pricing (as of 2024):
- ~1000 tokens per task = ~$0.01 per task
- 100 tasks = ~$1 per batch
- 10,000 tasks = ~$100

Optimize with:
- Caching (deduplicate similar requests)
- Rate limiting (1 task/sec = natural throttle)
- Quality gates (reject low-confidence content early)

## Files

- [app/api/ai/batch-generate/route.ts](../../app/api/ai/batch-generate/route.ts) — API endpoint
- [lib/ai/batch-prompts.ts](../../lib/ai/batch-prompts.ts) — Content generation prompts
- [lib/ai/batch-generator-client.ts](../../lib/ai/batch-generator-client.ts) — TypeScript client
- [lib/ai/providers.ts](../../lib/ai/providers.ts) — AI provider fallback chain
