import { test as base, expect, type Page } from '@playwright/test';
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
  test.skip(!(process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD), 'Missing COMPANY_EMAIL/COMPANY_PASSWORD');
}

export async function assertNoSevereClientErrors(page: Page): Promise<void> {
  const errors: string[] = [];

  page.on('pageerror', err => {
    errors.push(String(err));
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const isKnownNoise =
        text.includes('favicon') ||
        text.includes('ERR_BLOCKED_BY_CLIENT') ||
        text.includes('ipapi.co/json') ||
        text.includes("No 'Access-Control-Allow-Origin' header is present");

      if (!isKnownNoise) {
        errors.push(text);
      }
    }
  });

  await page.waitForTimeout(300);
  expect(errors, `Detected client-side errors:\n${errors.join('\n')}`).toEqual([]);
}
