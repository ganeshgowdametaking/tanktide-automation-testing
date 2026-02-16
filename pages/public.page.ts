import { type Locator, type Page, expect } from '@playwright/test';

export class PublicPage {
  readonly page: Page;
  readonly header: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header, [role="banner"]').first();
    this.footer = page.locator('footer, [role="contentinfo"]').first();
  }

  async goto(path = '/'): Promise<void> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response, `No response for ${path}`).not.toBeNull();
    expect(response!.status(), `Bad status for ${path}`).toBeLessThan(500);
  }

  async assertShellVisible(): Promise<void> {
    await expect(this.header).toBeVisible();
    await expect(this.footer).toBeVisible();
  }
}
