# TankTide Automation Testing

Standalone, production-grade QA automation framework for TankTide.

## What this covers
- End-to-end UI tests (desktop + mobile emulation)
- API smoke/contract checks
- Accessibility testing (axe)
- Visual regression snapshots
- CI pipeline for PR smoke + nightly regression

## Tech stack
- Playwright Test
- Axe Core Playwright
- TypeScript
- GitHub Actions

## Quick start
1. `cp .env.example .env`
2. Set `BASE_URL` and optional auth/API values in `.env`
3. `npm install`
4. `npx playwright install --with-deps`
5. Run tests:
   - `npm run test:smoke`
   - `npm run test:desktop`
   - `npm run test:mobile`
   - `npm run test:api`
   - `npm run test:a11y`
   - `npm run test:visual`

## Project layout
- `tests/e2e`: browser flows and UI behavior
- `tests/api`: backend endpoint checks
- `tests/a11y`: accessibility scans
- `tests/visual`: screenshot baseline tests
- `fixtures/routes.json`: route inventory
- `utils/`: shared helpers
- `.github/workflows/qa.yml`: CI smoke and nightly regression

## Environment variables
- `BASE_URL` (required)
- `API_BASE_URL` (optional, for API tests)
- `COMPANY_EMAIL` / `COMPANY_PASSWORD` (for authenticated tests)
- `TEST_REFERRAL_ID` (for applications ranking page checks)
- `HEADLESS`, `WORKERS`

## Notes
- Authenticated tests auto-skip when credentials are not supplied.
- Mobile and desktop run as separate projects in Playwright.
- Reports are in `playwright-report` and `test-results`.
