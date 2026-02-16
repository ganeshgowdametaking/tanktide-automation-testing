import { type Page, expect } from '@playwright/test';

export class AppShellPage {
  constructor(private readonly page: Page) {}

  async gotoPath(path: string): Promise<void> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);
    await expect(this.page.locator('body')).toBeVisible();
  }

  async assertPageHasOneOf(texts: RegExp[]): Promise<void> {
    const body = (await this.page.textContent('body')) || '';
    const matched = texts.some(re => re.test(body));
    expect(matched, `Expected one of: ${texts.map(t => t.toString()).join(', ')}`).toBeTruthy();
  }
}
