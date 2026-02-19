import { test as base, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { PublicPage } from '../pages/public.page';
import { CompanyAuthPage } from '../pages/company-auth.page';
import { CreateReferralPageObject } from '../pages/create-referral.page';
import { AppShellPage } from '../pages/app-shell.page';

type Fixtures = {
  publicPage: PublicPage;
  companyAuthPage: CompanyAuthPage;
  createReferralPage: CreateReferralPageObject;
  appShellPage: AppShellPage;
};

export const test = base.extend<Fixtures>({
  publicPage: async ({ page }, use) => {
    await use(new PublicPage(page));
  },
  companyAuthPage: async ({ page }, use) => {
    await use(new CompanyAuthPage(page));
  },
  createReferralPage: async ({ page }, use) => {
    await use(new CreateReferralPageObject(page));
  },
  appShellPage: async ({ page }, use) => {
    await use(new AppShellPage(page));
  }
});

export { expect };

export function requireCompanyCreds(): void {
  const hasCreds = Boolean(process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD);
  const metaPath = path.resolve('.auth/company-meta.json');
  let hasAuthenticatedSession = false;

  if (fs.existsSync(metaPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as { authenticated?: boolean };
      hasAuthenticatedSession = Boolean(parsed.authenticated);
    } catch {
      hasAuthenticatedSession = false;
    }
  }

  test.skip(!hasCreds, 'Missing COMPANY_EMAIL/COMPANY_PASSWORD');
  test.skip(!hasAuthenticatedSession, 'Company login setup did not establish an authenticated session.');
}

export async function assertNoSevereClientErrors(page: Page): Promise<void> {
  const errors: string[] = [];
  const failedFirstPartyRequests: string[] = [];

  const getOrigin = (u: string): string => {
    try {
      return new URL(u).origin;
    } catch {
      return '';
    }
  };

  const currentOrigin = getOrigin(page.url());

  page.on('pageerror', err => {
    errors.push(String(err));
  });

  page.on('requestfailed', req => {
    const url = req.url();
    const failureText = req.failure()?.errorText || 'UNKNOWN_REQUEST_FAILURE';
    const requestOrigin = getOrigin(url);
    const isFirstParty = !!currentOrigin && requestOrigin === currentOrigin;
    const isDataUrl = url.startsWith('data:');

    // Third-party failures are common in local/dev due to CORS/adblock/network policy.
    // First-party failures are treated as true regressions.
    if (isFirstParty && !isDataUrl) {
      failedFirstPartyRequests.push(`${failureText} :: ${url}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const isKnownNoise =
        text.includes('favicon') ||
        text.includes('ERR_BLOCKED_BY_CLIENT') ||
        text.includes('ipapi.co/json') ||
        text.includes("No 'Access-Control-Allow-Origin' header is present") ||
        text.trim() === 'Failed to load resource: net::ERR_FAILED';

      if (!isKnownNoise) {
        errors.push(text);
      }
    }
  });

  await page.waitForTimeout(300);
  const combined = [
    ...errors,
    ...failedFirstPartyRequests.map(e => `FIRST_PARTY_REQUEST_FAILED: ${e}`)
  ];
  expect(combined, `Detected client-side errors:\n${combined.join('\n')}`).toEqual([]);
}
