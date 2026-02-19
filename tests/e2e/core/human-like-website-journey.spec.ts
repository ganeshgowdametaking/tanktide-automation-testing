import { test, expect } from '../../../fixtures/test';
import { PublicPage } from '../../../pages/public.page';

test.describe('Public Website Walker @slow-mo @public', () => {
  let publicPage: PublicPage;

  test.beforeEach(async ({ page }) => {
    publicPage = new PublicPage(page);
    // Extra slow-mo for this specific test to make it super watchable
    // extending the config's default
  });

  test('Simulate a user browsing the website naturally', async ({ page }) => {
    // 1. Start at Home
    await test.step('Start at Home Page', async () => {
      await publicPage.goto('/');
      await expect(page).toHaveTitle(/.*TankTide|.*Home/i);
    });

    // 2. Define the journey
    const journey = [
      { name: 'Terms of Service', linkName: /terms of service/i, expectedUrl: /.*terms/ },
      { name: 'Privacy Policy', linkName: /privacy policy/i, expectedUrl: /.*privacy/ },
      // { name: 'Pricing', linkName: /pricing/i, expectedUrl: /.*pricing/ }, // If exists
      // Note: Login buttons on this page are buttons, not links, so we handle them differently or 
      // look for a specific "Link" role if available. 
      // Based on snapshot, Login/Signup are buttons.
    ];

    // 3. Walk the journey
    for (const step of journey) {
      await test.step(`User navigates to ${step.name}`, async () => {
        // Always start from home to ensure we can find the links
        // (Simulates a user returning to the "hub" or using the nav bar)
        await publicPage.goto('/');

        const link = page.getByRole('link', { name: step.linkName }).first();
        await expect(link).toBeVisible();

        // Highlight the link before clicking so the user sees it
        await link.scrollIntoViewIfNeeded();

        await link.click();
        await expect(page).toHaveURL(step.expectedUrl);

        // Look around for a bit (implicit due to slowMo)
        // Verify something specific
        if (step.name === 'Sign In') {
          await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
        } else {
          await expect(page.locator('h1, h2, h3').first()).toBeVisible();
        }
      });
    }
  });
});
