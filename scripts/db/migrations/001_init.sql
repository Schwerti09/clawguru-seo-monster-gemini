-- Enable UUID generation (Neon supports pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) content_items
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content JSONB NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  keywords TEXT[] DEFAULT '{}',

  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by VARCHAR(100),
  confidence_score DECIMAL(5,2),

  status VARCHAR(50) DEFAULT 'draft',
  confidence_tier VARCHAR(20),
  review_reason VARCHAR(500),

  published_at TIMESTAMP WITH TIME ZONE,
  published_url VARCHAR(255),
  seo_slug VARCHAR(255),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_content_items_batch_title ON content_items(batch_id, title);
CREATE INDEX IF NOT EXISTS ix_content_items_status ON content_items(status);
CREATE INDEX IF NOT EXISTS ix_content_items_tier ON content_items(confidence_tier);

-- 2) batch_jobs
CREATE TABLE IF NOT EXISTS batch_jobs (
  id VARCHAR(255) PRIMARY KEY,
  status VARCHAR(50) DEFAULT 'processing',
  total_tasks INT,
  completed_tasks INT DEFAULT 0,
  failed_tasks INT DEFAULT 0,
  quality_stats JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INT,
  cost_eur DECIMAL(10,2),
  primary_provider VARCHAR(100),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS ix_batch_jobs_status ON batch_jobs(status);
CREATE INDEX IF NOT EXISTS ix_batch_jobs_started_at ON batch_jobs(started_at);

-- 3) review_queue
CREATE TABLE IF NOT EXISTS review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  batch_id VARCHAR(255),
  title VARCHAR(500),
  confidence_score DECIMAL(5,2),
  confidence_tier VARCHAR(20),
  eeat_scores JSONB,
  abo_relevance_score DECIMAL(5,2),
  review_reason TEXT,
  enqueued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'pending',
  reviewer VARCHAR(100),
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS ix_review_queue_status ON review_queue(status);
CREATE INDEX IF NOT EXISTS ix_review_queue_tier ON review_queue(confidence_tier);
CREATE INDEX IF NOT EXISTS ix_review_queue_enqueued_at ON review_queue(enqueued_at);

-- 4) publishing_history
CREATE TABLE IF NOT EXISTS publishing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  event VARCHAR(50),
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(100),
  change_reason TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_publishing_history_changed_at ON publishing_history(changed_at);
