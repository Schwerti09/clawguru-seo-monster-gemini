-- Admin tables for ClawGuru SEO Monster (Neon Postgres)
-- Run with: psql $DATABASE_URL -f scripts/db/001_admin_tables.sql
-- Safe to run multiple times (CREATE TABLE IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_metrics (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claw_score  NUMERIC DEFAULT 0,
  last_active TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_tier (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier       TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id                        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id                   TEXT REFERENCES users(id) ON DELETE SET NULL,
  amount                    NUMERIC NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'usd',
  status                    TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id  TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  tier       TEXT NOT NULL DEFAULT 'free',
  status     TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS runbooks (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS runbook_executions (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  runbook_id   TEXT REFERENCES runbooks(id) ON DELETE SET NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  duration     TEXT,
  success_rate NUMERIC DEFAULT 0,
  output       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gemini_usage (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  date        DATE NOT NULL,
  tokens_used BIGINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gemini_requests (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  model      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
