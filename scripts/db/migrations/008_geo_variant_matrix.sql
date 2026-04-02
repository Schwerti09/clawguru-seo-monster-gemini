-- Persisted Geo-Living Matrix variants for SEO/mycelium linkage
CREATE TABLE IF NOT EXISTS geo_variant_matrix (
  id BIGSERIAL PRIMARY KEY,
  locale TEXT NOT NULL,
  base_slug TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  variant_slug TEXT NOT NULL,
  city_name TEXT NOT NULL,
  region_name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  local_title TEXT NOT NULL,
  local_summary TEXT NOT NULL,
  links_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  quality_score INTEGER NOT NULL DEFAULT 0,
  model TEXT NOT NULL DEFAULT 'gemini',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale, variant_slug)
);

CREATE INDEX IF NOT EXISTS idx_geo_variant_matrix_lookup
  ON geo_variant_matrix (locale, base_slug, city_slug, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_geo_variant_matrix_updated_at
  ON geo_variant_matrix (updated_at DESC);
