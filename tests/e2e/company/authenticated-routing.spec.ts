import { test, requireCompanyCreds } from '../../../fixtures/test';
import { protectedRoutes } from '../../../fixtures/routes';

test.describe('Authenticated route health @regression', () => {
  test('company can open protected pages', async ({ appShellPage }) => {
    requireCompanyCreds();

    for (const route of protectedRoutes) {
      await appShellPage.gotoPath(route.path);
    }
  });
});
