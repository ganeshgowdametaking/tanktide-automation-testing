import { Page, expect } from '@playwright/test';

async function fillFirstVisible(page: Page, selectors: string[], value: string): Promise<void> {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      try {
        await locator.fill(value);
        return;
      } catch {
        // try next selector
      }
    }
  }
  throw new Error(`Unable to fill input. Tried selectors: ${selectors.join(', ')}`);
}

export async function loginAsCompany(page: Page, baseUrl: string): Promise<void> {
  const email = process.env.COMPANY_EMAIL;
  const password = process.env.COMPANY_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing COMPANY_EMAIL/COMPANY_PASSWORD');
  }

  await page.goto(`${baseUrl}/company-login`, { waitUntil: 'domcontentloaded' });

  await fillFirstVisible(page, [
    'input[name="email"]',
    'input[type="email"]',
    'input[autocomplete="email"]',
    'input[placeholder*="email" i]',
    'label:has-text("Email") + input',
    'label:has-text("Work Email") + input'
  ], email);
  await fillFirstVisible(page, [
    'input[name="password"]',
    'input[type="password"]',
    'input[autocomplete="current-password"]',
    'input[placeholder*="password" i]',
    'label:has-text("Password") + input'
  ], password);
  await page.getByRole('button', { name: /sign in|log in|login|continue/i }).first().click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/\/company-dashboard|\/jobs/);
}
