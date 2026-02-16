import { Page, expect } from '@playwright/test';

export async function assertNoCriticalConsoleErrors(page: Page): Promise<void> {
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('ERR_BLOCKED_BY_CLIENT')) {
        errors.push(text);
      }
    }
  });

  await page.waitForTimeout(200);
  expect(errors, `Console errors detected:\n${errors.join('\n')}`).toEqual([]);
}

export async function openAndAssertLive(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response, `No response for ${path}`).not.toBeNull();
  expect(response!.status(), `Unexpected status on ${path}`).toBeLessThan(500);
  await expect(page.locator('body')).toBeVisible();
}
