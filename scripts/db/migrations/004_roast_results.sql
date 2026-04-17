-- roast_results table for storing Roast My Moltbot results
-- Enables real-time statistics and Hall of Fame/Shame leaderboards

CREATE TABLE IF NOT EXISTS roast_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  stack_summary TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  roast_level TEXT NOT NULL CHECK (roast_level IN ('mild', 'medium', 'spicy')),
  weaknesses TEXT[] NOT NULL,
  fixes TEXT[] NOT NULL,
  roast_text TEXT NOT NULL,
  top_roasts TEXT[] NOT NULL,
  locale TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries on score (Hall of Fame/Shame)
CREATE INDEX IF NOT EXISTS idx_roast_results_score ON roast_results(score DESC);

-- Index for recent roasts
CREATE INDEX IF NOT EXISTS idx_roast_results_created_at ON roast_results(created_at DESC);

-- Index for user roasts
CREATE INDEX IF NOT EXISTS idx_roast_results_user_id ON roast_results(user_id);

-- Index for locale filtering
CREATE INDEX IF NOT EXISTS idx_roast_results_locale ON roast_results(locale);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_roast_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roast_results_updated_at
  BEFORE UPDATE ON roast_results
  FOR EACH ROW
  EXECUTE FUNCTION update_roast_results_updated_at();

-- Add table comment
COMMENT ON TABLE roast_results IS 'Stores Roast My Moltbot results for statistics and leaderboards';

COMMENT ON COLUMN roast_results.score IS 'Security score 0-100, higher is better';
COMMENT ON COLUMN roast_results.roast_level IS 'Roast intensity: mild, medium, or spicy';
COMMENT ON COLUMN roast_results.ip_address IS 'Client IP for rate limiting and analytics';
