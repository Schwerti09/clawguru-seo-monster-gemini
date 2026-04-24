# Testing and Release Gates

## Core Commands

- `npm run test:autopilot`
  - Runs the autopilot-focused unit suites:
    - `__tests__/autopilot-offering.test.ts`
    - `__tests__/autopilot-delivery.test.ts`
    - `__tests__/checkout-upgrade-signals.test.ts`
    - `__tests__/autopilot-thresholds.test.ts`
    - `__tests__/autopilot-retention.test.ts`
  - Uses `--ci` and `--runInBand` for deterministic CI behavior.
- `npm run build`
  - Runs `build:data` and a production `next build`.

## CI Release Gate

The CI workflow enforces this sequence:

1. `unit-tests` job runs `npm run test:autopilot`
2. `build` job runs only after unit tests pass

If `test:autopilot` fails, the build step is blocked.
