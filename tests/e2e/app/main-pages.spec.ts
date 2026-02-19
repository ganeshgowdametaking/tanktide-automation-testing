import { test, requireCompanyCreds } from '../../../fixtures/test';
import { authenticatedRoutes } from '../../../fixtures/routes';

test.describe('Main app pages @critical @regression', () => {
  test('authenticated core pages load with expected content', async ({ appShellPage }) => {
    requireCompanyCreds();

    for (const route of authenticatedRoutes) {
      await appShellPage.gotoPath(route.path);
    }
  });
});
