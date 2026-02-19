import { test, expect } from '@playwright/test';

const apiBase = process.env.API_BASE_URL;
const hasValidApiBase = (() => {
  if (!apiBase || apiBase.includes('<') || apiBase.includes('>')) return false;
  try {
    const parsed = new URL(apiBase);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
})();

test.describe('Platform API contract @smoke @regression', () => {
  test.skip(!hasValidApiBase, 'Set API_BASE_URL to a valid http(s) URL to run API tests.');

  test('jobs endpoint responds with expected status class', async ({ request }) => {
    const res = await request.get(`${apiBase}/jobs`);
    expect([200, 401, 403]).toContain(res.status());
  });

  test('invalid endpoint returns not found', async ({ request }) => {
    const res = await request.get(`${apiBase}/_nonexistent_path_qa_`);
    expect(res.status()).toBe(404);
  });
});
