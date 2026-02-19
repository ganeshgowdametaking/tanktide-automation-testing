import { test, requireCompanyCreds } from '../../../fixtures/test';
import { companyRoutes } from '../../../fixtures/routes';

test.describe('Authenticated route health @regression', () => {
  test('company user can open company routes', async ({ appShellPage }) => {
    requireCompanyCreds();

    for (const route of companyRoutes) {
      await appShellPage.gotoPath(route.path);
    }
  });
});
