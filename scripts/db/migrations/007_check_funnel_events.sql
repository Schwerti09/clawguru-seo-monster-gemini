-- Persistent analytics events for /check funnel reporting
CREATE TABLE IF NOT EXISTS check_funnel_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_check_funnel_events_created_at
  ON check_funnel_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_check_funnel_events_event_created_at
  ON check_funnel_events (event, created_at DESC);
