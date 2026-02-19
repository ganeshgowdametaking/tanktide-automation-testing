import { test, expect } from '../../../fixtures/test';
import { CandidateAuthPage } from '../../../pages/candidate-auth.page';

test.describe('Candidate User Journey @slow-mo @candidate', () => {
    let authPage: CandidateAuthPage;

    // Use env vars or defaults
    const CANDIDATE_EMAIL = process.env.CANDIDATE_EMAIL;
    const CANDIDATE_PASSWORD = process.env.CANDIDATE_PASSWORD;

    test.beforeEach(async ({ page }) => {
        authPage = new CandidateAuthPage(page);
        // Increase timeout for this long journey
        test.setTimeout(120000);
    });

    test('Candidate logs in and browses the full application', async ({ page }) => {
        // 1. Login
        if (!CANDIDATE_EMAIL || !CANDIDATE_PASSWORD) {
            test.skip(true, 'Skipping: CANDIDATE_EMAIL/PASSWORD not set');
            return;
        }

        await test.step('Login as Candidate', async () => {
            await authPage.login(CANDIDATE_EMAIL, CANDIDATE_PASSWORD);

            // FINAL STABILIZATION: Trust the URL and Key Page Elements
            // 1. Verify URL is correct (Candidate usually lands on /jobs or /dashboard)
            await expect(page).toHaveURL(/.*(jobs|dashboard)/, { timeout: 30000 });

            // 2. Verify "Job Referrals" header is present (Key content)
            await expect(page.locator('h1').filter({ hasText: /Job Referrals/i })).toBeVisible();

            // 3. Verify typically logged-in header elements exist (generic check)
            // We check for any link in the nav that implies a user profile or settings
            const navLinks = page.locator('nav a, header a');
            await expect(navLinks.filter({ hasText: /profile|settings|logout/i }).first()).toBeAttached();

            console.log("Login verified: URL is correct and key content is loaded.");
        });

        // 2. Explicit Navigation to Core Pages (Force "Deep" Testing)

        await test.step('Navigate to Jobs', async () => {
            // Try clicking nav link first, fallback to URL
            const jobsLink = page.getByRole('link', { name: /jobs|find work/i }).first();
            if (await jobsLink.isVisible()) {
                await jobsLink.click();
            } else {
                await page.goto('/jobs');
            }
            await expect(page).toHaveURL(/.*jobs/);
            await expect(page.locator('h1, h2')).toBeVisible();
        });

        await test.step('Navigate to Messages', async () => {
            await page.goto('/messages');
            await expect(page).toHaveURL(/.*messages/);
            await expect(page.locator('body')).toContainText(/messages|inbox/i);
        });

        await test.step('Navigate to Notifications', async () => {
            await page.goto('/notifications');
            await expect(page).toHaveURL(/.*notifications/);
        });

        await test.step('Navigate to Profile', async () => {
            await page.goto('/profile');
            await expect(page).toHaveURL(/.*profile/);
            // Check for personal details or edit button
            await expect(page.getByRole('button', { name: /edit|update/i }).first()).toBeVisible();
        });
    });
});
