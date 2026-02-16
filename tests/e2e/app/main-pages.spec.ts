import { test, requireCompanyCreds } from '../../../fixtures/test';

test.describe('Main app pages @critical @regression', () => {
  test('messages, notifications and settings load', async ({ appShellPage }) => {
    requireCompanyCreds();

    await appShellPage.gotoPath('/messages');
    await appShellPage.assertPageHasOneOf([/messages|conversation|search/i]);

    await appShellPage.gotoPath('/notifications');
    await appShellPage.assertPageHasOneOf([/notifications|mark all/i]);

    await appShellPage.gotoPath('/settings');
    await appShellPage.assertPageHasOneOf([/settings|account|feedback/i]);
  });
});
