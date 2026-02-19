import { type Page, expect } from '@playwright/test';
import type { ReferralData } from '../fixtures/test-data';

export class CreateReferralPageObject {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/create-referral', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: /create referral/i })).toBeVisible();
  }

  async fillReferralForm(data: ReferralData): Promise<void> {
    await this.page.locator('input[placeholder*="Senior Product Designer" i]').fill(data.title);
    await this.page.locator('input[placeholder*="Acme Corp" i]').fill(data.company);
    await this.page.locator('input[placeholder*="Product Design" i]').fill(data.department);

    const locationInput = this.page.locator('input[placeholder*="City, State or Remote" i]').first();
    await locationInput.fill(data.location);

    await this.page.locator('textarea[placeholder*="role requirements" i]').fill(data.description);

    for (const skill of data.skills) {
      await this.page.locator('input[placeholder*="Add a skill" i]').fill(skill);
      await this.page.locator('button[type="button"]:has(span.material-symbols-outlined:text("add"))').first().click();
    }
  }

  async submit(): Promise<void> {
    await this.page.getByRole('button', { name: /^create referral$/i }).click();
  }

  async assertReferralAppears(title: string): Promise<void> {
    await expect(this.page.locator('h4', { hasText: title }).first()).toBeVisible({ timeout: 10000 });
  }
}
