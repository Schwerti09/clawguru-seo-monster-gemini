# Stripe Coupons — Phase B Launch

> **All coupons are for Pro Plan (49€/mo) only**
> **Max 1x per customer**
> **Create in Stripe Dashboard: Products → Coupons → Create**

---

## Coupon Specifications

### HUNTER50
- **Discount:** 50% off
- **Duration:** Once
- **Expires:** 13.05.2026 (T+7)
- **Applies to:** Pro Plan only
- **Purpose:** Product Hunt launch incentive

### SHOWHN50
- **Discount:** 50% off
- **Duration:** Once
- **Expires:** 13.05.2026 (T+7)
- **Applies to:** Pro Plan only
- **Purpose:** Hacker News launch incentive

### REDDIT30
- **Discount:** 30% off
- **Duration:** Once
- **Expires:** 20.05.2026 (T+14)
- **Applies to:** Pro Plan only
- **Purpose:** Reddit launch incentive

### BIRDS25
- **Discount:** 25% off
- **Duration:** Once
- **Expires:** 13.05.2026 (T+7)
- **Applies to:** Pro Plan only
- **Purpose:** Early bird incentive

### LINKEDIN25
- **Discount:** 25% off
- **Duration:** Once
- **Expires:** 20.05.2026 (T+14)
- **Applies to:** Pro Plan only
- **Purpose:** LinkedIn launch incentive

---

## Creation Steps (Stripe Dashboard)

1. Go to: https://dashboard.stripe.com/products/coupons
2. Click "Create coupon"
3. Fill in:
   - **Coupon code:** [HUNTER50 / SHOWHN50 / REDDIT30 / BIRDS25 / LINKEDIN25]
   - **Percent off:** [50 / 30 / 25]
   - **Duration:** Once
   - **Redemption limit:** 1 per customer
   - **Expires by:** [13.05.2026 / 20.05.2026]
4. Click "Add product restriction" → Select "Pro" only
5. Click "Create coupon"

---

## Verification

After creating all 5 coupons, verify:
- [ ] HUNTER50 — 50% off, expires 13.05.2026
- [ ] SHOWHN50 — 50% off, expires 13.05.2026
- [ ] REDDIT30 — 30% off, expires 20.05.2026
- [ ] BIRDS25 — 25% off, expires 13.05.2026
- [ ] LINKEDIN25 — 25% off, expires 20.05.2026

Test coupon codes in checkout flow to ensure they work correctly.
