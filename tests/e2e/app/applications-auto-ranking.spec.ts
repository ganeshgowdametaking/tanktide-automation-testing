import { test, expect, requireCompanyCreds } from '../../../fixtures/test';

const referralId = process.env.TEST_REFERRAL_ID;

test.describe('Applications auto-ranking integration @critical @regression', () => {
  test('applications page surfaces ranking panel automatically', async ({ page }) => {
    requireCompanyCreds();
    test.skip(!referralId, 'Set TEST_REFERRAL_ID to validate applications ranking page.');

    await page.goto(`/applications/${referralId}`, { waitUntil: 'networkidle' });
    await expect(page.locator('text=/AI Ranking|Auto Ranking Enabled|AI Ranking In Progress/i').first()).toBeVisible();
  });
});
