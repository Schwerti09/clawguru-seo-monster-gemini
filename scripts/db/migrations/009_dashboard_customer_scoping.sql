-- Tenant-scope cockpit data per Stripe customer (or session principal).
-- Rows with NULL customer_id are legacy/global and are not exposed in the customer dashboard.

ALTER TABLE threats ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);
ALTER TABLE mycelium_nodes ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS ix_threats_customer_id ON threats(customer_id);
CREATE INDEX IF NOT EXISTS ix_mycelium_nodes_customer_id ON mycelium_nodes(customer_id);
