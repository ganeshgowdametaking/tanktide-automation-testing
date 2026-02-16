import { test } from '../../../fixtures/test';

test.describe('Company auth validation @smoke @regression', () => {
  test('company login form validates empty submission', async ({ companyAuthPage }) => {
    await companyAuthPage.assertLoginValidation();
  });

  test('company signup rejects generic email domains', async ({ companyAuthPage }) => {
    await companyAuthPage.assertSignupRejectsGenericEmail();
  });
});
