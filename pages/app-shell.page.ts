import { type Page, expect } from '@playwright/test';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  async gotoPath(path: string): Promise<void> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);
    await expect(this.page.locator('body')).toBeVisible();
  }

  async assertPageHasExpectedText(expectedText: string[]): Promise<void> {
    const body = ((await this.page.textContent('body')) || '').toLowerCase();
    const matched = expectedText.some(token => body.includes(token.toLowerCase()));
    expect(matched, `Expected one of: ${expectedText.join(', ')}`).toBeTruthy();
  }
}
