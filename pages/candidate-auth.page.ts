import { type Page, expect } from '@playwright/test';

export class CandidateAuthPage {
    constructor(private readonly page: Page) { }

    async gotoLogin(): Promise<void> {
        console.log('Navigating to home...');
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });

        const loginButton = this.page.getByRole('button', { name: /login/i }).first(); // Be specific to "Login" not "Sign in" which might be the submit button
        if (await loginButton.isVisible()) {
            console.log('Clicking Login button...');
            await loginButton.click();

            // Wait for modal OR email input
            console.log('Waiting for login form...');
            // We just need the email input to be visible to proceed
            await expect(this.page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
        } else {
            console.log('Login button not found, assuming logic page or already logged in.');
        }
    }

    async login(email: string, password: string): Promise<void> {
        await this.gotoLogin();

        console.log('Filling credentials...');
        // Find inputs globally or locally (playwright handles visibility automatically)
        const emailInput = this.page.locator('input[type="email"], input[name="email"]').first();
        await emailInput.fill(email);

        // Fill user password
        const passwordInput = this.page.getByPlaceholder(/password/i)
            .or(this.page.locator('input[type="password"]'))
            .or(this.page.locator('input[name="password"]'))
            .first();
        await passwordInput.fill(password);

        // START FIX: Wait for the network to settle or URL to change
        // We use Promise.all to ensure we catch the navigation triggered by the click
        console.log('Submitting login form and waiting for navigation...');
        const submitButton = this.page.getByRole('button', { name: /sign in|login/i }).last();
        await Promise.all([
            // Snapshot showed redirection to /jobs, matching user request to use waitForURL
            this.page.waitForURL(/.*(jobs|dashboard).*/, { waitUntil: 'networkidle' }),
            submitButton.click()
        ]);

        console.log('Login confirmed: URL changed.');
    }
}
