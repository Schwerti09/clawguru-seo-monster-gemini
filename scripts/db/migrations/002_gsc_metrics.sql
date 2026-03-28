-- Migration: add gsc_metrics table
CREATE TABLE IF NOT EXISTS gsc_metrics (
  id BIGSERIAL PRIMARY KEY,
  site TEXT NOT NULL,
  date DATE NOT NULL,
  query TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  ctr REAL NOT NULL DEFAULT 0,
  position REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gsc_metrics_site_date ON gsc_metrics(site, date);
