import { Page } from '@playwright/test';

export async function loginAsCompany(page: Page, baseUrl: string): Promise<void> {
  const email = process.env.COMPANY_EMAIL;
  const password = process.env.COMPANY_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing COMPANY_EMAIL/COMPANY_PASSWORD');
  }

  await page.goto(`${baseUrl}/company-login`, { waitUntil: 'domcontentloaded' });

  const emailSelectors = [
    'input[type="email"]',
    'input[name="email"]',
    'input[placeholder*="Email" i]'
  ];
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password"]'
  ];

  for (const selector of emailSelectors) {
    const loc = page.locator(selector).first();
    if (await loc.isVisible().catch(() => false)) {
      await loc.fill(email);
      break;
    }
  }

  for (const selector of passwordSelectors) {
    const loc = page.locator(selector).first();
    if (await loc.isVisible().catch(() => false)) {
      await loc.fill(password);
      break;
    }
  }

  const submitCandidates = [
    page.getByRole('button', { name: /log in|login|sign in/i }).first(),
    page.locator('button[type="submit"]').first()
  ];

  for (const button of submitCandidates) {
    if (await button.isVisible().catch(() => false)) {
      await button.click();
      break;
    }
  }

  await page.waitForLoadState('networkidle');
}
