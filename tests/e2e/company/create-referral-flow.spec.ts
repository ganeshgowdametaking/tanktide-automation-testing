import { test, requireCompanyCreds } from '../../../fixtures/test';
import { buildReferralData } from '../../../fixtures/test-data';

test.describe('Create referral workflow @critical @regression', () => {
  test('create referral end-to-end from form submission', async ({ createReferralPage }) => {
    requireCompanyCreds();

    const referral = buildReferralData();
    await createReferralPage.goto();
    await createReferralPage.fillReferralForm(referral);
    await createReferralPage.submit();
    await createReferralPage.assertReferralAppears(referral.title);
  });
});
