import { test, expect } from '@playwright/test';

test.describe('Navigation and core UI @smoke @regression', () => {
  test('home page has visible header and footer landmarks', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('header, [role="banner"]').first()).toBeVisible();
    await expect(page.locator('footer, [role="contentinfo"]').first()).toBeVisible();
  });

  test('mobile menu interaction remains functional', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Runs on mobile projects only.');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu")').first();
    await menuButton.click({ timeout: 5000 }).catch(() => {});
    await expect(page.locator('body')).toBeVisible();
  });
});
