# E2E Payment-Flow Tests (Playwright)

This directory contains the **end-to-end test suite** for the ClawGuru payment flow.  
The suite targets ≥ 95 % functional coverage of the Stripe checkout → access-cookie → dashboard path.

---

## Directory Structure

```
e2e/
├── helpers/
│   └── auth.ts                       # Shared token-signing helper
└── payment-flow/
    ├── smoke-dashboard-shadow-realm.spec.ts   # Shadow Realm overlay tests
    ├── e2e-daypass-purchase.spec.ts           # Day Pass full flow
    ├── e2e-pro-purchase.spec.ts               # Pro subscription full flow
    ├── cookie-and-tier-access.spec.ts         # Cookie properties & tier gates
    └── success-page-redirect.spec.ts          # /success & /api/auth/activate
```

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20 + | Runtime |
| npm | 10 + | Package manager |
| Playwright browsers | auto-installed | Chromium, Firefox, WebKit |
| (optional) Stripe CLI | latest | Webhook tests against real Stripe |

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 3. Configure the test secret

The tests sign `claw_access` cookies using the same HMAC-SHA256 algorithm as the app.  
Both the **running Next.js dev server** and the **test runner** must share the same secret.

Create a `.env.test.local` file (never commit it):

```env
# .env.test.local
ACCESS_TOKEN_SECRET=playwright-test-secret-32-bytes!!
```

`playwright.config.ts` already passes this value to the `webServer` process, so you only
need to ensure the value matches if you start the dev server manually.

### 4. Run all E2E tests (headless)

```bash
npm run test:e2e
```

### 5. Open the interactive Playwright UI

```bash
npm run test:e2e:ui
```

### 6. Run in headed Chromium

```bash
npm run test:e2e:headed
```

### 7. Run a single spec file

```bash
npx playwright test e2e/payment-flow/smoke-dashboard-shadow-realm.spec.ts
```

### 8. Show the HTML report

```bash
npx playwright show-report
```

---

## Test Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ACCESS_TOKEN_SECRET` | `playwright-test-secret-32-bytes!!` | HMAC secret for token signing. **Must match the running Next.js server.** |
| `BASE_URL` | `http://localhost:3000` | Override the target URL (e.g. staging). |

---

## Stripe Mocking Strategy

Because Stripe's hosted checkout page cannot be reliably automated in CI, the tests use
`page.route()` to intercept two API calls:

| Intercepted route | What the mock returns |
|-------------------|-----------------------|
| `POST /api/stripe/checkout` | `{ url: "…/api/auth/activate?session_id=<test_id>" }` |
| `GET /api/auth/activate?session_id=<test_id>` | Sets a valid `claw_access` cookie + `Location: /dashboard` |

This covers the **full browser-side redirect chain** without real Stripe credentials.

---

## Running Against Real Stripe (Stripe CLI Webhooks)

To validate the server-side activation path against live Stripe test mode:

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.dev/api/stable/stripe-deb.gpg | sudo apt-key add -
echo "deb https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# Windows
scoop install stripe
```

### 2. Login and start webhook forwarding

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the **webhook signing secret** (starts with `whsec_`) and add it to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PRICE_DAYPASS=price_xxx
STRIPE_PRICE_PRO=price_yyy
```

### 3. Trigger a test checkout event

```bash
stripe trigger checkout.session.completed
```

### 4. Run Playwright against the live webhook path

```bash
BASE_URL=http://localhost:3000 npx playwright test e2e/payment-flow/ --project=chromium
```

---

## Stripe Test Cards

Use these card numbers on the Stripe-hosted checkout page in test mode:

| Card number | Scenario |
|-------------|---------|
| `4242 4242 4242 4242` | Always succeeds |
| `4000 0000 0000 0002` | Always declined |
| `4000 0025 0000 3155` | 3D Secure required |
| `4000 0000 0000 9995` | Insufficient funds |

Expiry: any future date · CVC: any 3 digits · ZIP: any value

---

## Coverage Goals

| Area | Target | How validated |
|------|--------|---------------|
| Dashboard loads per tier | 100 % | `smoke-dashboard-shadow-realm.spec.ts` |
| Shadow Realm shows/hides | 100 % | `smoke-dashboard-shadow-realm.spec.ts`, `cookie-and-tier-access.spec.ts` |
| Day Pass full purchase flow | 100 % | `e2e-daypass-purchase.spec.ts` |
| Pro subscription full flow | 100 % | `e2e-pro-purchase.spec.ts` |
| Cookie properties (HttpOnly, Lax, expiry) | 100 % | `cookie-and-tier-access.spec.ts` |
| Tier-feature gates (all tabs × all tiers) | 100 % | `cookie-and-tier-access.spec.ts` |
| /success page states | 100 % | `success-page-redirect.spec.ts` |
| /api/auth/activate redirect chain | 100 % | `success-page-redirect.spec.ts` |

**Combined: ≥ 95 % of the payment flow is exercised by this suite.**

---

## CI Integration

The suite runs automatically on every PR via GitHub Actions (`.github/workflows/e2e.yml`).  
The workflow:
1. Installs Node.js + Playwright browsers
2. Starts the Next.js dev server (via `webServer` in `playwright.config.ts`)
3. Runs all tests in headless mode
4. Uploads the HTML report as a build artifact

---

## Debugging Tips

- **Headed mode**: `npm run test:e2e:headed` — watch the browser in real time
- **Slow mode**: `PWSLOWMO=500 npm run test:e2e` — add 500 ms delay between actions
- **Debug single test**: `npx playwright test --debug e2e/payment-flow/smoke-dashboard-shadow-realm.spec.ts`
- **Trace viewer**: After a failure, run `npx playwright show-report` to inspect traces and screenshots
