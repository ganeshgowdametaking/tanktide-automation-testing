import { test, expect } from '../../../fixtures/test';
import { CandidateAuthPage } from '../../../pages/candidate-auth.page';

test.describe('Exhaustive "Recursive Walker" Deep-Dive Test @slow-mo @spider', () => {

    test('Crawls and interacts with every public page and element', async ({ page }) => {
        const visitedUrls = new Set<string>();
        const urlsToVisit = ['/'];

        // 1. Initial Land
        await page.goto('/');
        await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();

        const domain = new URL(page.url()).origin;

        // 2. Handle Cookie Banner once
        const acceptBtn = page.getByRole('button', { name: /accept/i }).first();
        if (await acceptBtn.isVisible()) {
            await test.step('Accept Cookies', async () => {
                await acceptBtn.click();
                await expect(acceptBtn).not.toBeVisible();
            });
        }

        while (urlsToVisit.length > 0) {
            const path = urlsToVisit.shift()!;
            const fullUrl = new URL(path, domain).href;

            if (visitedUrls.has(fullUrl)) continue;
            visitedUrls.add(fullUrl);

            await test.step(`Deep-Dive: ${path}`, async () => {
                console.log(`Navigating to: ${fullUrl}`);
                await page.goto(fullUrl);

                // --- VERIFICATION START ---
                await expect(page.locator('body')).toBeVisible();

                // Hero Section Check (Only on Home)
                if (path === '/') {
                    await test.step('Verify Hero Section', async () => {
                        const heroHeading = page.locator('h1').first();
                        await expect(heroHeading).toBeVisible();
                        await heroHeading.highlight();
                        console.log(`Hero Heading: ${await heroHeading.innerText()}`);
                    });
                }

                // Global Layout Check
                await expect(page.locator('header, nav').first()).toBeAttached();
                await expect(page.locator('footer, [role="contentinfo"]').first()).toBeAttached();
                // --- VERIFICATION END ---

                // --- INTERACTION: DISCOVER LINKS ---
                const links = await page.evaluate((origin) => {
                    return Array.from(document.querySelectorAll('a'))
                        .map(a => a.href)
                        .filter(href => href.startsWith(origin) && !href.includes('#'));
                }, domain);

                for (const link of links) {
                    const linkPath = new URL(link).pathname;
                    if (!visitedUrls.has(link) && !urlsToVisit.includes(linkPath)) {
                        urlsToVisit.push(linkPath);
                    }
                }

                // --- INTERACTION: BUTTONS ---
                const buttons = page.getByRole('button').filter({ visible: true });
                const buttonCount = await buttons.count();

                // We don't click every button on every page (too destructive), 
                // but we highlight them to ensure they are visible/interactable
                for (let i = 0; i < Math.min(buttonCount, 5); i++) {
                    const btn = buttons.nth(i);
                    const name = await btn.innerText();
                    if (name && !name.match(/logout|delete|remove/i)) {
                        await btn.highlight();
                        await page.waitForTimeout(200);
                    }
                }
            });
        }

        console.log(`Exhaustive crawl complete. Visited ${visitedUrls.size} unique pages.`);
    });

    test('Verify footer contact links', async ({ page }) => {
        await page.goto('/');
        const contactLink = page.locator('header a, footer a').filter({ hasText: /contact|support|info/i }).first();
        await expect(contactLink).toBeVisible();
        await contactLink.highlight();
    });

    test('Verify Login and Signup triggers', async ({ page }) => {
        const authPage = new CandidateAuthPage(page);

        await test.step('Verify Login Flow starts', async () => {
            await authPage.gotoLogin();
            // Verify we are in the login state (modal or form visible)
            await expect(page.locator('input[type="email"]').first()).toBeVisible();
            await page.reload(); // reset
        });

        await test.step('Verify Signup Flow starts', async () => {
            const signupButton = page.getByRole('button', { name: /signup|get started/i }).first();
            if (await signupButton.isVisible()) {
                await signupButton.click();
                await expect(page.locator('input[type="email"]').first()).toBeVisible();
            }
        });
    });
});
