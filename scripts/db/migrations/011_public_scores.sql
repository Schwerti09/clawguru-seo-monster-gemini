-- Public Score Pages (Phase A1 - Viral Loop)
-- Stores shareable security check results accessible via public URL /score/[token]

CREATE TABLE IF NOT EXISTS public_scores (
  token        TEXT PRIMARY KEY,
  target       TEXT NOT NULL,
  score        INTEGER NOT NULL,
  vulnerable   BOOLEAN NOT NULL DEFAULT FALSE,
  top_risks    JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  locale       TEXT NOT NULL DEFAULT 'de',
  view_count   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_scores_created ON public_scores(created_at DESC);
