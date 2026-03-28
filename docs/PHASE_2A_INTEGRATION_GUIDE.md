# Phase 2a: Batch Content Generator — Integration Guide

## 🎯 What Just Got Built

**Three new files for scaling AI content generation:**

| File | Purpose |
|------|---------|
| `/api/ai/batch-generate` | REST API endpoint (POST to submit, GET to poll) |
| `lib/ai/batch-prompts.ts` | Content generation prompt templates (Runbook, Security Guide, Tool Review, FAQ) |
| `lib/ai/batch-generator-client.ts` | TypeScript client for submitting & monitoring batches |

**Key capabilities:**
- ✅ Bulk content generation (1-1000 items per batch)
- ✅ Quality validation (auto-validates runbooks, tool reviews, etc.)
- ✅ Provider fallback (Deepseek → OpenAI → Gemini)
- ✅ Progress tracking & telemetry
- ✅ Graceful error handling (failed tasks don't stop the batch)

---

## 🚀 How to Use (Quick Start)

### Option 1: Via cURL (fastest test)

```bash
# 1. Submit batch
curl -X POST http://localhost:3000/api/ai/batch-generate \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test_001",
    "tasks": [
      {
        "contentType": "runbook",
        "context": {
          "provider": "AWS",
          "service": "EC2",
          "issue": "High Memory",
          "year": "2024"
        }
      }
    ]
  }'

# Returns: { "jobId": "test_001", "status": "queued" }

# 2. Poll status  
curl http://localhost:3000/api/ai/batch-generate/test_001
```

### Option 2: Via TypeScript (recommended)

```typescript
import { BatchGeneratorClient } from "@/lib/ai/batch-generator-client"

async function testBatchGeneration() {
  const client = new BatchGeneratorClient()
  
  // Submit
  const jobId = await client.submitBatch([
    client.generateRunbook({
      provider: "AWS",
      service: "Lambda",
      issue: "Timeout Errors",
    }),
  ])
  
  // Wait for completion
  const status = await client.waitForCompletion(jobId)
  
  console.log(`✅ Generated ${status.results?.length} items`)
  console.log(`📊 Tokens used: ${status.telemetry.tokensUsed}`)
}
```

### Option 3: Run Test Script

```bash
cd /app && bash scripts/test-batch-generate.sh
```

---

## 📋 Content Types

### 1. **Runbook** — Incident Response Procedures
```typescript
client.generateRunbook({
  provider: "AWS",      // Provider (AWS, GCP, Azure, Linux, etc)
  service: "EC2",       // Service name
  issue: "High CPU",    // Problem description
  year: "2024",         // Optional year for best practices
})
```
**Output:** Title, summary, triage checklist, root cause, step-by-step fix, verification, prevention tips

**Example:** "Fix AWS EC2 High CPU Usage — 12 steps with bash commands, 8-min incident response"

---

### 2. **Security Guide** — Hardening Procedures
```typescript
client.generateSecurityGuide({
  topic: "SSH Hardening",
  technology: "Linux",
  severity: "P1-Critical",  // P1-Critical | P2-High | P3-Medium
  year: "2024",
})
```
**Output:** Executive summary, risk, compliance (GDPR/SOC2/PCI), CVEs, hardening steps, monitoring

**Example:** "SSH Hardening on Linux — NIST-compliant, includes 7 CVEs (2024), 5-step hardening"

---

### 3. **Tool Review** — DevOps Tool Comparison
```typescript
client.generateToolReview({
  toolName: "Prometheus",
  category: "Monitoring",
  competitors: ["Datadog", "New Relic"],  // Optional
  year: "2024",
})
```
**Output:** Features, pricing, pros/cons, use cases, learning curve, alternatives

**Example:** "Prometheus vs Datadog vs New Relic — Feature matrix, pros/cons, when to use"

---

### 4. **FAQ** — Q&A Content
```typescript
client.generateFAQ({
  topic: "Docker",
  answerLength: "medium",  // short | medium | long
})
```
**Output:** 8-12 Q&A pairs from beginner → advanced

**Example:** "Docker FAQ — Why use containers, how to optimize images, debugging tips"

---

## 🎨 Typical Batch Size & Time

| Batch Size | Est. Time | Cost (Gemini) | Use Case |
|---|---|---|---|
| 10 items | 10-15 sec | ~$0.10 | Quick test |
| 100 items | 2-3 min | ~$1 | Weekly content refresh |
| 500 items | 10-15 min | ~$5 | Monthly expansion |
| 1000 items | 20-30 min | ~$10 | Quarterly sprint |

---

## 📊 Monitoring Results

After batch completes, results include:

```json
{
  "results": [
    {
      "title": "Fix AWS EC2 High CPU Usage",
      "summary": "...",
      "content": "{...full JSON...}",
      "keywords": ["aws", "ec2", "cpu"],
      "estimatedReadTime": 8,
      "metadata": {
        "generatedAt": "2024-01-01T12:00:00Z",
        "contentType": "runbook",
        "confidence": 0.95
      }
    }
  ],
  "telemetry": {
    "tokensUsed": 4521,
    "avgResponseTimeMs": 2260,
    "durationMs": 22600
  }
}
```

**Quality Signals:**
- `confidence: 0.95` = Passed validation (good content)
- `confidence: 0.7` = Validation failed but returned (review before publishing)

---

## 🔧 Integration Checklist

- [ ] **Test locally first**
  ```bash
  npm run dev
  bash scripts/test-batch-generate.sh
  ```

- [ ] **Monitor generated content quality**
  - Check `confidence` scores
  - Sample 10% of generated content manually
  - Iterate on prompt templates if needed

- [ ] **Save to database** (next phase)
  ```typescript
  const status = await client.waitForCompletion(jobId)
  for (const result of status.results) {
    await db.content.create({
      type: result.metadata.contentType,
      title: result.title,
      content: result.content,
      keywords: result.keywords,
      confidence: result.metadata.confidence,
    })
  }
  ```

- [ ] **Setup cost tracking**
  - Monitor `telemetry.tokensUsed` per batch
  - Project monthly budget: `(tokens/1000) * 0.00002` (Gemini pricing)

- [ ] **Scale to production**
  - Replace in-memory queue with Redis/Bull
  - Add batch job persistence (PostgreSQL)
  - Setup monitoring dashboard (Datadog/New Relic)

---

## 🚀 Phase 2: Next Steps

**2a ✅ (DONE):** Batch Content Generator API → You are here  
**2b (NEXT):** Content Quality Validation + Human Review Queue  
**2c (THEN):** Batch Job Tracking & Monitoring Dashboard

**Phase 2b will add:**
- Content quality rubric (length, structure, E-E-A-T signals, abo-relevance)
- Human review queue (flag low-confidence items)
- Feedback loop (improve prompts based on reviewer comments)

---

## 📢 Cost & Scale Analysis

**Current Status:**
- 350k pages indexed
- 195k pages not indexed (need content)
- Generation capacity: ~5 content pieces/min per provider

**Phase 2 Goal:** Generate 500-1000 quality content pieces → target 50-100k additional indexed pages

**Budget (Gemini):**
- 500 pieces @ 4.5k tokens = ~$0.45
- 1000 pieces @ 4.5k tokens = ~$0.90  
- 10,000 pieces/month = ~$9/month

**Timeline:**
- Week 1: Generate 100 pieces (test quality)
- Week 2-4: Generate 500-1000 pieces (human review)
- Month 2: Iterative generation + quality improvements

---

## ❓ FAQ

**Q: Can I generate 10,000 items in one batch?**  
A: Yes, max is 1000 per batch. Submit 10 batches sequentially or in parallel.

**Q: How do I know content quality before publishing?**  
A: Check `confidence` score (0.95 = validated, 0.7 = needs review). Phase 2b adds human review queue.

**Q: What if an AI provider fails?**  
A: Fallback chain handles it (Deepseek → OpenAI → Gemini). Batch continues even if some tasks fail.

**Q: Can I customize the prompts?**  
A: Yes! Edit functions in `lib/ai/batch-prompts.ts` and redeploy.

**Q: How long does 100 items take?**  
A: ~2-3 minutes (1 request/sec rate limit). 1000 items = ~15-20 minutes.

---

## 📚 Files

- **API Endpoint:** [app/api/ai/batch-generate/route.ts](../../app/api/ai/batch-generate/route.ts)
- **Prompt Templates:** [lib/ai/batch-prompts.ts](../../lib/ai/batch-prompts.ts)
- **TypeScript Client:** [lib/ai/batch-generator-client.ts](../../lib/ai/batch-generator-client.ts)
- **Full API Docs:** [docs/BATCH_GENERATOR_API.md](../../docs/BATCH_GENERATOR_API.md)
- **Test Script:** [scripts/test-batch-generate.sh](../../scripts/test-batch-generate.sh)
- **Unit Tests:** [__tests__/batch-generate.test.ts](../../__tests__/batch-generate.test.ts)
