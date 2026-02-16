import { test, expect } from '@playwright/test';
import routes from '../../fixtures/routes.json';
import { hasAuthCreds } from '../../utils/env';
import { loginAsCompany } from '../../utils/auth';

test.describe('Authenticated core pages @regression', () => {
  test.skip(!hasAuthCreds(), 'Set COMPANY_EMAIL and COMPANY_PASSWORD to run authenticated tests.');

  test('company login and key pages are reachable', async ({ page, baseURL }) => {
    await loginAsCompany(page, baseURL || 'http://localhost:5173');

    const protectedRoutes = routes.filter(r => !r.public);
    for (const route of protectedRoutes) {
      const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
