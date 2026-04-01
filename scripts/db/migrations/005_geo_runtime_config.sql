-- Runtime config for geo sitemap guardrails / adaptive limits
CREATE TABLE IF NOT EXISTS geo_runtime_config (
  key TEXT PRIMARY KEY,
  value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_geo_runtime_config_updated_at
  ON geo_runtime_config (updated_at DESC);
