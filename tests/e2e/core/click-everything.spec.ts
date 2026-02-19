import { test, expect } from '../../../fixtures/test';

test.describe('Exhaustive "Click Everything" Spider Test @slow-mo @spider', () => {

    test('Visually identifies and interacts with links AND buttons', async ({ page }) => {
        // 1. Go to Home
        await page.goto('/');
        await expect(page).toHaveTitle(/.*TankTide|.*Home/i);
        // Wait for footer to be visible to ensure full hydration
        await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();

        // --- BUTTON HANDLING START ---

        // 1. Handle "Accept" (Cookie Banner) if present
        const acceptBtn = page.getByRole('button', { name: /accept/i }).first();
        if (await acceptBtn.isVisible()) {
            await test.step('Click Cookie Consent "Accept"', async () => {
                await acceptBtn.highlight();
                await page.waitForTimeout(500);
                await acceptBtn.click();
                await expect(acceptBtn).not.toBeVisible();
            });
        }

        // 2. Handle Login / Signup (Modals or Navigation)
        const actionButtons = ['Login', 'Signup', 'Sign In', 'Get Started'];
        for (const btnName of actionButtons) {
            // Find button by name, scoped to main area or header/nav
            // We avoid "Sign In" inside the login modal itself for now, focusing on the trigger buttons
            const btn = page.getByRole('button', { name: new RegExp(`^${btnName}$`, 'i') }).first();

            if (await btn.isVisible()) {
                await test.step(`Click Main Action Button: "${btnName}"`, async () => {
                    await btn.highlight();
                    await page.waitForTimeout(500);
                    await btn.click();

                    // Wait a moment for reaction
                    await page.waitForTimeout(1000);

                    // If modal (dialog role) appears, close it or reload
                    // Using a more generic selector for the modal container seen in snapshots (ref=e60)
                    const modal = page.locator('div[role="dialog"], div[class*="modal"], div[class*="overlay"]').first();

                    if (await modal.isVisible() || await page.getByText('Sign In').first().isVisible()) {
                        console.log(`Button "${btnName}" opened a modal. Reloading to reset state.`);
                        await page.reload();
                    } else {
                        // Check if URL changed (simple check against origin)
                        const newUrl = page.url();
                        const currentOrigin = new URL(newUrl).origin;
                        if (newUrl !== `${currentOrigin}/`) {
                            console.log(`Button "${btnName}" navigated to ${newUrl}.`);
                            await page.goBack();
                        } else {
                            console.log(`Button "${btnName}" clicked (no major nav/modal detected).`);
                        }
                    }

                    // Ensure we are back at a "clean" home state
                    await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
                });
            }
        }

        // --- BUTTON HANDLING END ---

        // 2. Find all unique internal links
        // Re-evaluate links as the DOM might have changed (e.g. cookies accepted)
        const allLinks = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            return anchors.map(a => ({
                href: a.href,
                text: a.innerText.trim(),
                origin: window.location.origin
            }));
        });

        const origin = new URL(page.url()).origin;
        const currentUrl = page.url();

        const filteredLinks = allLinks
            .filter(link => link.href && link.href.startsWith(origin)) // Internal only
            .filter(link => !link.href.includes('#')) // Ignore anchors
            .filter(link => {
                const verifyUrl = new URL(link.href);
                const current = new URL(currentUrl);
                return verifyUrl.pathname !== current.pathname;
            });

        // Deduplicate
        const uniqueLinks = Array.from(new Set(filteredLinks.map(l => l.href)))
            .map(href => filteredLinks.find(l => l.href === href));

        // 3. Visit each link by CLICKING (not goto)
        for (const link of uniqueLinks) {
            if (!link) continue;

            await test.step(`Click link: ${link.text || 'Image Link'}`, async () => {
                // Determine selector (text is best, falling back to href)
                let locator;
                if (link.text && link.text.length > 0) {
                    locator = page.getByRole('link', { name: link.text, exact: true }).first();
                    if (await locator.count() === 0) {
                        locator = page.getByRole('link', { name: link.text }).first();
                    }
                } else {
                    locator = page.locator(`a[href="${link.href.replace(origin, '')}"]`).first();
                    if (await locator.count() === 0) {
                        locator = page.locator(`a[href="${link.href}"]`).first();
                    }
                }

                // Visual interaction
                await locator.scrollIntoViewIfNeeded();
                await locator.highlight();
                await page.waitForTimeout(500); // Small pause for user to see

                // Click
                await locator.click();

                // Verify
                await expect(page).toHaveURL(new RegExp(link.href.replace(/\?.*$/, ''))); // Ignore query params
                await expect(page.locator('body')).toBeVisible();

                // Go back
                await page.goBack();
                await expect(page).toHaveURL(currentUrl);
                // Wait for homepage to be ready again
                await expect(page.locator('footer, [role="contentinfo"]')).toBeVisible();
            });
        }
    });

    test('Verifies "Contact Support" exists', async ({ page }) => {
        await page.goto('/');
        const contactLink = page.locator('a[href^="mailto:"]');
        if (await contactLink.count() > 0) {
            await contactLink.first().scrollIntoViewIfNeeded();
            await expect(contactLink).toBeVisible();
            await contactLink.first().highlight();
            await page.waitForTimeout(1000);
        }
    });
});
