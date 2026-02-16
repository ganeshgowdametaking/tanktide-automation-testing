import { test, expect } from '@playwright/test';

const apiBase = process.env.API_BASE_URL;

test.describe('API health and contract @smoke @regression', () => {
  test.skip(!apiBase, 'Set API_BASE_URL to run API tests.');

  test('jobs endpoint responds with valid status', async ({ request }) => {
    const res = await request.get(`${apiBase}/jobs`);
    expect([200, 401, 403]).toContain(res.status());
  });

  test('invalid endpoint returns 404', async ({ request }) => {
    const res = await request.get(`${apiBase}/__invalid__`);
    expect(res.status()).toBe(404);
  });
});
