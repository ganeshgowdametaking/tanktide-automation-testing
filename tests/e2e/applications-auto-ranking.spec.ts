import { test, expect } from '@playwright/test';
import { hasAuthCreds } from '../../utils/env';
import { loginAsCompany } from '../../utils/auth';

const referralId = process.env.TEST_REFERRAL_ID;

test.describe('Applications AI auto-ranking surface @regression', () => {
  test.skip(!hasAuthCreds(), 'Set COMPANY_EMAIL and COMPANY_PASSWORD to run authenticated tests.');
  test.skip(!referralId, 'Set TEST_REFERRAL_ID to validate applications ranking page.');

  test('applications page loads and shows ranking panel', async ({ page, baseURL }) => {
    await loginAsCompany(page, baseURL || 'http://localhost:5173');
    await page.goto(`/applications/${referralId}`, { waitUntil: 'networkidle' });

    const panel = page.locator('text=/AI Ranking|Auto Ranking Enabled|AI Ranking In Progress/i').first();
    await expect(panel).toBeVisible();
  });
});
