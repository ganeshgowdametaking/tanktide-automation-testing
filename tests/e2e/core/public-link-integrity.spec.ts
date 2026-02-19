import { test, expect } from '../../../fixtures/test';

const maxLinksToCheck = Number(process.env.MAX_PUBLIC_LINK_CHECKS || 25);

test.describe('Public link integrity @smoke @regression', () => {
  test('home page internal links return non-5xx status', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const base = process.env.BASE_URL || 'http://localhost:5173';

    const links = await page.locator('a[href]').evaluateAll((anchors: HTMLAnchorElement[]) =>
      anchors
        .map(a => a.getAttribute('href') || '')
        .filter(href => href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
    );

    const unique = Array.from(new Set(links)).filter(href => href.startsWith('/') || href.startsWith(base));
    const toCheck = unique.slice(0, maxLinksToCheck);

    for (const href of toCheck) {
      const response = await page.goto(href, { waitUntil: 'domcontentloaded' });
      expect(response, `No response for ${href}`).not.toBeNull();
      expect(response!.status(), `Unexpected 5xx for ${href}`).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
