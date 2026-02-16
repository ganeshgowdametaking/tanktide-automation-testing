import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

const pages = ['/', '/privacy-policy', '/cookie-policy', '/terms'];

test.describe('Accessibility checks @regression', () => {
  for (const path of pages) {
    test(`a11y scan ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const results = await new AxeBuilder({ page })
        .disableRules(['color-contrast'])
        .analyze();

      expect(results.violations, `A11y violations on ${path}`).toEqual([]);
    });
  }
});
