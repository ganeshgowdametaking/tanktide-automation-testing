import { test, expect } from '@playwright/test';

test.describe('Visual snapshots @regression', () => {
  test('home page snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
  });

  test('terms page snapshot', async ({ page }) => {
    await page.goto('/terms', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('terms-page.png', { fullPage: true });
  });

});
