ALTER TABLE geo_cities
  ADD COLUMN IF NOT EXISTS rollout_stage TEXT NOT NULL DEFAULT 'stable'
  CHECK (rollout_stage IN ('canary', 'stable'));

CREATE INDEX IF NOT EXISTS idx_geo_cities_rollout_active
  ON geo_cities (rollout_stage, is_active, priority DESC, population DESC);
