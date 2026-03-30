-- Dashboard tables for ClawGuru cockpit

-- 1) runbook_executions – tracks tool/runbook runs per customer
CREATE TABLE IF NOT EXISTS runbook_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR(255) NOT NULL,
  runbook_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_runbook_executions_customer ON runbook_executions(customer_id);
CREATE INDEX IF NOT EXISTS ix_runbook_executions_created ON runbook_executions(created_at DESC);

-- 2) threats – detected security threats
CREATE TABLE IF NOT EXISTS threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  severity VARCHAR(20) DEFAULT 'low',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_threats_status ON threats(status);
CREATE INDEX IF NOT EXISTS ix_threats_severity ON threats(severity);

-- 3) mycelium_nodes – network graph nodes
CREATE TABLE IF NOT EXISTS mycelium_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) DEFAULT 'runbook',
  status VARCHAR(50) DEFAULT 'active',
  connections JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_mycelium_nodes_status ON mycelium_nodes(status);
