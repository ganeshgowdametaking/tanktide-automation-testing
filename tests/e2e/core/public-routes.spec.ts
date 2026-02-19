import { test, expect, assertNoSevereClientErrors } from '../../../fixtures/test';
import { publicRoutes } from '../../../fixtures/routes';

test.describe('Public route health @smoke @critical @regression', () => {
  for (const route of publicRoutes) {
    test(`loads ${route.name} (${route.path})`, async ({ publicPage, page }) => {
      await publicPage.goto(route.path);
      await expect(page.locator('body')).toBeVisible();
      const url = new URL(page.url());
      expect(url.pathname, `Expected path ${route.path} after navigation`).toBe(route.path);
      await assertNoSevereClientErrors(page);
    });
  }
});
