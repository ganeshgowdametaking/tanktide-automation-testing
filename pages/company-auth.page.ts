import { type Page, expect } from '@playwright/test';

export class CompanyAuthPage {
  constructor(private readonly page: Page) {}

  async gotoLogin(): Promise<void> {
    await this.page.goto('/company-login', { waitUntil: 'domcontentloaded' });
  }

  async gotoSignup(): Promise<void> {
    await this.page.goto('/company-signup', { waitUntil: 'domcontentloaded' });
  }

  async login(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.page.getByLabel(/email address/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertLoginValidation(): Promise<void> {
    await this.gotoLogin();
    await this.page.getByRole('button', { name: /sign in/i }).click();
    await expect(this.page).toHaveURL(/\/company-login$/);
    await expect(this.page.locator('input:invalid')).toHaveCount(2);
  }

  async assertSignupRejectsGenericEmail(): Promise<void> {
    await this.gotoSignup();
    await this.page.locator('input[name="email"]').fill('qa@gmail.com');
    await this.page.locator('input[name="companyName"]').fill('QA Company');
    await this.page.locator('input[name="password"]').fill('StrongPassword123!');
    await this.page.locator('input[name="agreeToTerms"]').check();
    await this.page.getByRole('button', { name: /create account/i }).click();
    await expect(this.page.getByText(/company domain email address/i)).toBeVisible();
  }
}
