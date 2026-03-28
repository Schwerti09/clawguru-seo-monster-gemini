# Phase 3: Database Storage & Publishing Schema

## Database: PostgreSQL (Neon)

### Tables

#### 1. content_items (Main content storage)
```sql
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content JSONB NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- runbook, security-guide, tool-review, faq
  keywords TEXT[] DEFAULT '{}',
  
  -- Metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  generated_by VARCHAR(100), -- "deepseek", "gpt-4o-mini", etc
  confidence_score DECIMAL(3,2), -- 0.00-1.00
  
  -- Approval workflow
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, published, rejected
  confidence_tier VARCHAR(20), -- gold, silver, bronze, review-required
  review_reason VARCHAR(500),
  
  -- Publishing
  published_at TIMESTAMP,
  published_url VARCHAR(255),
  seo_slug VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP,
  
  -- Indexes
  UNIQUE(batch_id, title),
  INDEX batch_id (batch_id),
  INDEX status (status),
  INDEX confidence_tier (confidence_tier)
);
```

#### 2. batch_jobs (Track generation batches)
```sql
CREATE TABLE batch_jobs (
  id VARCHAR(255) PRIMARY KEY,
  status VARCHAR(50) DEFAULT 'processing', -- processing, completed, failed
  total_tasks INT,
  completed_tasks INT DEFAULT 0,
  failed_tasks INT DEFAULT 0,
  
  quality_stats JSONB, -- {gold: 54, silver: 29, bronze: 16, review: 1}
  
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INT,
  cost_eur DECIMAL(8,2),
  
  primary_provider VARCHAR(100), -- deepseek, gpt-4o-mini
  metadata JSONB,
  
  INDEX status (status),
  INDEX started_at (started_at)
);
```

#### 3. review_queue (Human review items)
```sql
CREATE TABLE review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id),
  batch_id VARCHAR(255),
  
  title VARCHAR(500),
  confidence_score DECIMAL(3,2),
  confidence_tier VARCHAR(20),
  eeat_scores JSONB, -- {expertise, authoritativeness, trustworthiness, overall}
  abo_relevance_score DECIMAL(3,2),
  
  review_reason TEXT,
  enqueued_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, needs_edits
  
  reviewer VARCHAR(100),
  review_notes TEXT,
  reviewed_at TIMESTAMP,
  
  INDEX status (status),
  INDEX confidence_tier (confidence_tier),
  INDEX enqueued_at (enqueued_at)
);
```

#### 4. publishing_history (Audit log)
```sql
CREATE TABLE publishing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id),
  event VARCHAR(50), -- published, rejected, edited, approved
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(100),
  change_reason TEXT,
  changed_at TIMESTAMP DEFAULT NOW(),
  
  INDEX changed_at (changed_at)
);
```

## Migration Steps

1. Create tables in production (Neon PostgreSQL)
2. Seed batch_jobs table with 24-item test batch
3. Middleware to sync Redis review queue → review_queue table
4. Publishing endpoint: read from DB, auto-publish gold/silver items

## API Endpoints (Phase 3)

### POST /api/ai/publish-content
- Input: validated items from /api/ai/content-validator
- Output: { published, pending_review, errors }
- Auto-approve: gold items publish immediately, silver → manual review, bronze → review-required queue

### GET /api/ai/publishing-status?batchId=...
- Returns: batch stats, quality distribution, publishing progress

### POST /api/ai/publish-approve
- Approve individual item from review queue
- Update status: pending → approved → published
- Generate publishing URL

### GET /api/ai/published-content?limit=50&offset=0
- List all published items (for sitemap, feed, etc)

## Publishing Decision Tree

```
Content Generated (100)
├─ Gold (54%) → Auto-publish immediately
├─ Silver (29%) → Review queue (auto-approve after 24h no changes)
├─ Bronze (16%) → Manual review required
└─ Review-Req (1%) → Require major edits before publish
```

## Publishing URL Structure

- Runbooks: `/docs/runbooks/{provider}/{service}/{slug}`
- Security Guides: `/docs/security/{topic}/{slug}`
- Tool Reviews: `/docs/tools/{tool-name}`
- FAQs: `/docs/faq/{topic}`

## Timeline

- Phase 3a: Create DB schema + publish API (in progress)
- Phase 3b: Integrate batch job → DB storage
- Phase 3c: Approval workflow UI
- Phase 3d: Auto-publishing for gold items
- Phase 4: Abo-CTA optimization (upsell improvements)
- Phase 5: Full monitoring & analytics dashboard
