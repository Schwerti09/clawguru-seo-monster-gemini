#!/bin/bash
# Phase 2a: Batch Content Generator Test Script
# 
# Quick test of the batch content generator API
# Usage: bash scripts/test-batch-generate.sh

set -e

API_BASE="http://localhost:3000/api/ai/batch-generate"
JOB_ID="test_batch_$(date +%s)"

echo "🚀 Phase 2a: Batch Content Generator Test"
echo "=========================================="
echo ""

# 1. Create test batch
echo "📦 Submitting batch job..."
echo "   Job ID: $JOB_ID"
echo ""

BATCH_RESPONSE=$(curl -s -X POST "$API_BASE" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobId\": \"$JOB_ID\",
    \"tasks\": [
      {
        \"contentType\": \"runbook\",
        \"context\": {
          \"provider\": \"AWS\",
          \"service\": \"EC2\",
          \"issue\": \"High CPU Usage\",
          \"year\": \"2024\"
        }
      },
      {
        \"contentType\": \"security-guide\",
        \"context\": {
          \"topic\": \"SSH Hardening\",
          \"technology\": \"Linux\",
          \"severity\": \"P1-Critical\"
        }
      },
      {
        \"contentType\": \"tool-review\",
        \"context\": {
          \"toolName\": \"Prometheus\",
          \"category\": \"Monitoring\",
          \"competitors\": \"Datadog,New Relic\",
          \"year\": \"2024\"
        }
      },
      {
        \"contentType\": \"faq\",
        \"context\": {
          \"topic\": \"Docker\",
          \"answerLength\": \"medium\"
        }
      }
    ]
  }")

echo "Response:"
echo "$BATCH_RESPONSE" | jq . 2>/dev/null || echo "$BATCH_RESPONSE"
echo ""

# 2. Poll status
echo "🔄 Polling job status..."
echo ""

MAX_POLLS=180  # 3 minutes with 1-second intervals
POLL_COUNT=0

while [ $POLL_COUNT -lt $MAX_POLLS ]; do
  STATUS=$(curl -s "$API_BASE/$JOB_ID")
  
  JOB_STATUS=$(echo "$STATUS" | jq -r '.status' 2>/dev/null || echo "unknown")
  PERCENTAGE=$(echo "$STATUS" | jq -r '.progress.percentage' 2>/dev/null || echo "0")
  COMPLETED=$(echo "$STATUS" | jq -r '.progress.completed' 2>/dev/null || echo "0")
  TOTAL=$(echo "$STATUS" | jq -r '.progress.total' 2>/dev/null || echo "0")
  
  printf "\r   Status: %-12s | Progress: %3d%% (%d/%d)" "$JOB_STATUS" "$PERCENTAGE" "$COMPLETED" "$TOTAL"
  
  if [ "$JOB_STATUS" = "completed" ] || [ "$JOB_STATUS" = "failed" ]; then
    echo ""
    echo ""
    break
  fi
  
  POLL_COUNT=$((POLL_COUNT + 1))
  sleep 1
done

if [ $POLL_COUNT -eq $MAX_POLLS ]; then
  echo ""
  echo "⏱️  Timeout: Job did not complete within 3 minutes"
  exit 1
fi

# 3. Display results
echo "📊 Final Status:"
echo "$STATUS" | jq . 2>/dev/null || echo "$STATUS"
echo ""

# Summary
RESULT_COUNT=$(echo "$STATUS" | jq '.results | length' 2>/dev/null || echo "0")
ERROR_COUNT=$(echo "$STATUS" | jq '.errors | length' 2>/dev/null || echo "0")
TOKEN_USAGE=$(echo "$STATUS" | jq '.telemetry.tokensUsed' 2>/dev/null || echo "0")
DURATION=$(echo "$STATUS" | jq '.telemetry.durationMs' 2>/dev/null || echo "0")

echo "✅ Test Summary:"
echo "   Generated: $RESULT_COUNT items"
echo "   Errors: $ERROR_COUNT"
echo "   Tokens Used: $TOKEN_USAGE"
echo "   Duration: ${DURATION}ms"
echo ""

if [ "$JOB_STATUS" = "completed" ]; then
  echo "🎉 Batch completed successfully!"
  exit 0
else
  echo "❌ Batch failed. Check errors above."
  exit 1
fi
