# TankTide Automation Testing

Standalone, state-of-the-art QA automation framework for TankTide.

## Coverage model
- E2E web UI (desktop + mobile emulation)
- Authenticated workflow tests (company login, routing, create referral, applications ranking panel)
- Main app workflow health (messages, notifications, settings)
- API contract smoke tests
- Accessibility checks (axe)
- Visual regression snapshots
- CI for PR smoke and nightly regression

## Stack
- Playwright Test + TypeScript
- Axe Core Playwright
- GitHub Actions

## Project structure
- `tests/setup`: auth/session bootstrap (`company-auth.setup.ts`)
- `tests/e2e/core`: public pages + responsive shell
- `tests/e2e/company`: company auth and referral flows
- `tests/e2e/app`: authenticated app flows and AI ranking panel checks
- `tests/api`: API contracts
- `tests/a11y`: accessibility scans
- `tests/visual`: snapshot baselines
- `pages`: page objects
- `fixtures`: deterministic test data + route inventories
- `utils`: auth/env/helpers

## Quick start
1. `cp .env.example .env`
2. Fill required values in `.env`
3. `npm install`
4. `npx playwright install --with-deps`
5. Run:
- Smoke: `npm run test:smoke`
- Critical path: `npm run test:critical`
- Full regression: `npm run test:regression`
- Mobile only: `npm run test:mobile`
- API only: `npm run test:api`
- A11y only: `npm run test:a11y`
- Visual only: `npm run test:visual`

## Required env
- `BASE_URL` (required)

## Optional env
- `API_BASE_URL` for API tests
- `COMPANY_EMAIL`, `COMPANY_PASSWORD` for authenticated flows
- `TEST_REFERRAL_ID` for applications ranking page checks

Authenticated specs auto-skip if credentials are not present.

## CI secrets
Configure in GitHub repository secrets:
- `BASE_URL`
- `API_BASE_URL`
- `COMPANY_EMAIL`
- `COMPANY_PASSWORD`
- `TEST_REFERRAL_ID`

## Keep route coverage in sync
Generate route inventory from TankTide app router:

```bash
node scripts/generate-routes.mjs /Users/ganeshgowda/Desktop/TankTide/web/src/App.tsx
```

## Notes
- No changes are made to TankTide app code by this project.
- Failures include trace/video/screenshot artifacts for debugging.
