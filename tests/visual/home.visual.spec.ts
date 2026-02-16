import { test, expect } from '@playwright/test';

test.describe('Visual baselines @regression', () => {
  test('home page visual snapshot', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
  });

  test('companies landing visual snapshot', async ({ page }) => {
    await page.goto('/companies', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('companies-page.png', { fullPage: true });
  });
});
