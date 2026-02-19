import { test, expect } from '../../../fixtures/test';

test.describe('Public interaction coverage @critical @regression', () => {
  test('home page exposes primary auth actions', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const signIn = page.getByRole('button', { name: /sign in|log in|login/i }).first();
    const joinNow = page.getByRole('button', { name: /join now|sign up|get started/i }).first();
    const authLink = page.getByRole('link', { name: /sign in|log in|login|join now|sign up|get started/i }).first();

    const hasSignIn = await signIn.count();
    const hasJoinNow = await joinNow.count();
    const hasAuthLink = await authLink.count();
    expect(hasSignIn + hasJoinNow + hasAuthLink, 'Expected at least one auth entry point on home page').toBeGreaterThan(0);
  });

  test('legal footer links are navigable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const checks: Array<{ expectedPath: string; required: boolean }> = [
      { expectedPath: '/privacy-policy', required: true },
      { expectedPath: '/terms', required: true },
      { expectedPath: '/cookie-policy', required: false },
      { expectedPath: '/data-request', required: false }
    ].filter((item, index, arr) => arr.findIndex(x => x.expectedPath === item.expectedPath) === index);

    for (const check of checks) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const link = page.locator(`a[href="${check.expectedPath}"]`).first();
      const count = await link.count();
      if (check.required) {
        expect(count, `Missing required legal footer link ${check.expectedPath}`).toBeGreaterThan(0);
      }
      if (!count) {
        continue;
      }
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${check.expectedPath}$`));
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
