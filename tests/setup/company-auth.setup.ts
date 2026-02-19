import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsCompany } from '../../utils/auth';

const authDir = path.resolve('.auth');
const companyState = path.resolve('.auth/company.json');
const companyMeta = path.resolve('.auth/company-meta.json');

setup('authenticate company session for dependent projects', async ({ page, context, baseURL }) => {
  fs.mkdirSync(authDir, { recursive: true });

  if (process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD) {
    try {
      await loginAsCompany(page, baseURL || 'http://localhost:5173');
      await context.storageState({ path: companyState });
      fs.writeFileSync(companyMeta, JSON.stringify({ authenticated: true }, null, 2));
      return;
    } catch {
      // Fall back to unauthenticated storage state so public suites can still run.
      await context.storageState({ path: companyState });
      fs.writeFileSync(companyMeta, JSON.stringify({ authenticated: false }, null, 2));
      return;
    }
  }

  // Fallback empty state to keep dependent projects runnable without auth creds.
  await context.storageState({ path: companyState });
  fs.writeFileSync(companyMeta, JSON.stringify({ authenticated: false }, null, 2));
});
