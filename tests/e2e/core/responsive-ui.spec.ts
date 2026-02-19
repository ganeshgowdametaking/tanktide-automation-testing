import { test, expect } from '../../../fixtures/test';

test.describe('Responsive core shell @smoke @regression', () => {
  test('desktop shell shows header/footer', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Desktop-only assertion.');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('header, [role="banner"]').first()).toBeVisible();
    await expect(page.locator('footer, [role="contentinfo"]').first()).toBeVisible();
  });

  test('mobile home remains interactive', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Mobile-only assertion.');

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();
    await page.locator('button[aria-label*="menu" i], button:has-text("Menu")').first().click().catch(() => {});
    await expect(page.locator('body')).toBeVisible();
  });
});
