import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { loginAsCompany } from '../../utils/auth';

const authDir = path.resolve('.auth');
const companyState = path.resolve('.auth/company.json');

setup('authenticate company session for dependent projects', async ({ page, context, baseURL }) => {
  fs.mkdirSync(authDir, { recursive: true });

  if (process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD) {
    await loginAsCompany(page, baseURL || 'http://localhost:5173');
    await context.storageState({ path: companyState });
    return;
  }

  // Fallback empty state to keep dependent projects runnable without auth creds.
  await context.storageState({ path: companyState });
});
