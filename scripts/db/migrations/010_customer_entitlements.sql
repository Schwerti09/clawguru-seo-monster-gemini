-- C3: customer_entitlements – persistent Stripe plan state as fallback when JWT cookie is absent.
-- Populated by the Stripe webhook on checkout.session.completed + invoice.paid (renewal).
-- Revoked on customer.subscription.deleted.

CREATE TABLE IF NOT EXISTS customer_entitlements (
  customer_id  VARCHAR(255) PRIMARY KEY,
  plan         VARCHAR(50)  NOT NULL,          -- 'pro' | 'team' | 'daypass' | 'explorer'
  stripe_subscription_id VARCHAR(255),
  valid_until  TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_customer_entitlements_valid ON customer_entitlements(valid_until);
