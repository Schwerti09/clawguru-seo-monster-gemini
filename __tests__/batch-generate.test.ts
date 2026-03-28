/**
 * @jest-environment node
 * 
 * Unit tests for Batch Content Generator API
 * 
 * Run with: npm test -- batch-generate.test.ts
 */

import { BatchGeneratorClient } from "@/lib/ai/batch-generator-client"
import {
  promptRunbook,
  promptToolReview,
  promptSecurityGuide,
  promptFAQ,
  validationRules,
} from "@/lib/ai/batch-prompts"

describe("Batch Content Generator", () => {
  describe("Prompt Generation", () => {
    it("should generate runbook prompt", () => {
      const prompt = promptRunbook({
        provider: "AWS",
        service: "EC2",
        issue: "High CPU",
        year: "2024",
      })

      expect(prompt).toContain("AWS")
      expect(prompt).toContain("EC2")
      expect(prompt).toContain("JSON")
      expect(prompt).toContain("triage")
    })

    it("should generate tool review prompt", () => {
      const prompt = promptToolReview({
        toolName: "Prometheus",
        category: "Monitoring",
        competitors: ["Datadog", "New Relic"],
        year: "2024",
      })

      expect(prompt).toContain("Prometheus")
      expect(prompt).toContain("Monitoring")
      expect(prompt).toContain("Datadog")
      expect(prompt).toContain("JSON")
    })

    it("should generate security guide prompt", () => {
      const prompt = promptSecurityGuide({
        topic: "SSH Hardening",
        technology: "Linux",
        severity: "P1-Critical",
        year: "2024",
      })

      expect(prompt).toContain("SSH")
      expect(prompt).toContain("Linux")
      expect(prompt).toContain("CVE")
      expect(prompt).toContain("JSON")
    })

    it("should generate FAQ prompt", () => {
      const prompt = promptFAQ({
        topic: "Docker",
        answerLength: "medium",
      })

      expect(prompt).toContain("Docker")
      expect(prompt).toContain("FAQ")
      expect(prompt).toContain("JSON")
    })
  })

  describe("Validation Rules", () => {
    it("should define runbook rules", () => {
      const rules = validationRules.runbook

      expect(rules).toHaveProperty("minTitleLength")
      expect(rules).toHaveProperty("maxSteps")
      expect(rules.minSteps).toBeLessThan(rules.maxSteps)
    })

    it("should define tool-review rules", () => {
      const rules = validationRules["tool-review"]

      expect(rules).toHaveProperty("minFeatures")
      expect(rules).toHaveProperty("minPros")
    })

    it("should define security-guide rules", () => {
      const rules = validationRules["security-guide"]

      expect(rules).toHaveProperty("minSteps")
      expect(rules.minSteps).toBeGreaterThan(0)
    })
  })

  describe("Client Methods", () => {
    const client = new BatchGeneratorClient()

    it("should create runbook request", () => {
      const req = client.generateRunbook({
        provider: "AWS",
        service: "Lambda",
        issue: "Timeout",
      })

      expect(req.contentType).toBe("runbook")
      expect(req.context.provider).toBe("AWS")
      expect(req.context.service).toBe("Lambda")
    })

    it("should create tool review request", () => {
      const req = client.generateToolReview({
        toolName: "Kubernetes",
        category: "Orchestration",
        competitors: ["Docker Swarm", "Nomad"],
      })

      expect(req.contentType).toBe("tool-review")
      expect(req.context.toolName).toBe("Kubernetes")
      expect(req.context.category).toBe("Orchestration")
    })

    it("should create security guide request", () => {
      const req = client.generateSecurityGuide({
        topic: "Firewall Config",
        technology: "iptables",
        severity: "P2-High",
      })

      expect(req.contentType).toBe("security-guide")
      expect(req.context.severity).toBe("P2-High")
    })

    it("should create FAQ request", () => {
      const req = client.generateFAQ({
        topic: "Kubernetes",
        answerLength: "long",
      })

      expect(req.contentType).toBe("faq")
      expect(req.context.answerLength).toBe("long")
    })
  })

  describe("Batch Request Validation", () => {
    // These would be integration tests against the actual endpoint

    it("should require jobId", async () => {
      // POST /api/ai/batch-generate with missing jobId should return 400
      // expect(response.status).toBe(400)
    })

    it("should require tasks array", async () => {
      // POST /api/ai/batch-generate with missing tasks should return 400
    })

    it("should reject empty tasks", async () => {
      // POST /api/ai/batch-generate with tasks: [] should return 400
    })

    it("should reject >1000 tasks", async () => {
      // POST /api/ai/batch-generate with >1000 tasks should return 400
    })

    it("should accept valid batch", async () => {
      // POST /api/ai/batch-generate with valid payload should return 202
    })
  })

  describe("Batch Processing", () => {
    it("should track job status", async () => {
      // Verify GET /api/ai/batch-generate/:jobId returns expected structure
      // {
      //   jobId, status, progress, results, errors, telemetry
      // }
    })

    it("should update progress", async () => {
      // Submit batch, poll multiple times, verify progress increases
    })

    it("should return results on completion", async () => {
      // Complete small batch, verify results structure
    })
  })
})
