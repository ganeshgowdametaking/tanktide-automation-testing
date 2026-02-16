import { Page, expect } from '@playwright/test';

export async function loginAsCompany(page: Page, baseUrl: string): Promise<void> {
  const email = process.env.COMPANY_EMAIL;
  const password = process.env.COMPANY_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing COMPANY_EMAIL/COMPANY_PASSWORD');
  }

  await page.goto(`${baseUrl}/company-login`, { waitUntil: 'domcontentloaded' });

  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveURL(/\/company-dashboard|\/jobs/);
}
