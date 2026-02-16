import { test, expect } from '@playwright/test';

test.describe('Visual snapshots @regression', () => {
  test('home page snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
  });

  test('company login page snapshot', async ({ page }) => {
    await page.goto('/company-login', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('company-login-page.png', { fullPage: true });
  });

  test('create referral page snapshot (authenticated)', async ({ page }) => {
    test.skip(!(process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD), 'Requires company auth.');
    await page.goto('/create-referral', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('create-referral-page.png', { fullPage: true });
  });
});
