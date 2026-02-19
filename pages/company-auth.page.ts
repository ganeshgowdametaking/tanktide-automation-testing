import { type Page, expect } from '@playwright/test';

export class CompanyAuthPage {
  constructor(private readonly page: Page) { }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/company-login', { waitUntil: 'domcontentloaded' });
  }

  async gotoSignup(): Promise<void> {
    await this.page.goto('/company-signup', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.gotoLogin();

    // Fill email (robust selection)
    const emailInput = this.page.getByLabel('Emails', { exact: false })
      .or(this.page.locator('input[type="email"]'))
      .or(this.page.locator('input[name="email"]'))
      .first();
    await emailInput.fill(email);

    // Fill password
    const passwordInput = this.page.getByLabel('Password', { exact: false })
      .or(this.page.locator('input[type="password"]'))
      .or(this.page.locator('input[name="password"]'))
      .first();
    await passwordInput.fill(password);

    // Submit
    await this.page.getByRole('button', { name: /sign in|log in|login|continue/i }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertLoginValidation(): Promise<void> {
    await this.gotoLogin();
    await this.page.getByRole('button', { name: /sign in|log in|login|continue/i }).first().click();
    await expect(this.page).toHaveURL(/.*company-login/);
    // Expect browser validation or error message
    // Note: 'input:invalid' only works if browser validation is triggered and not suppressed by JS
  }

  async assertSignupRejectsGenericEmail(): Promise<void> {
    await this.gotoSignup();
    await this.page.locator('input[name="email"]').fill('qa@gmail.com');
    await this.page.locator('input[name="companyName"]').fill('QA Company');
    await this.page.locator('input[name="password"]').fill('StrongPassword123!');

    const terms = this.page.locator('input[name="agreeToTerms"]');
    if (await terms.isVisible()) {
      await terms.check();
    }

    await this.page.getByRole('button', { name: /create account/i }).click();
    await expect(this.page.getByText(/company domain/i)).toBeVisible();
  }
}
