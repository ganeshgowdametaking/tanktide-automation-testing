import { test, expect } from '@playwright/test';
import routes from '../../fixtures/routes.json';
import { assertNoCriticalConsoleErrors, openAndAssertLive } from '../../utils/helpers';

test.describe('Public route health @smoke @regression', () => {
  for (const route of routes.filter(r => r.public)) {
    test(`loads ${route.name} (${route.path})`, async ({ page }) => {
      await openAndAssertLive(page, route.path);
      await assertNoCriticalConsoleErrors(page);
      await expect(page).toHaveURL(new RegExp(route.path === '/' ? '/$' : route.path));
    });
  }
});
