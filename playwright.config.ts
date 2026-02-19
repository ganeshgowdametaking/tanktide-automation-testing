import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:5173';
const workers = Number(process.env.WORKERS || 4);
const headless = (process.env.HEADLESS || 'true') !== 'false';
const slowMo = Number(process.env.SLOW_MO_MS || 0);
const retries = process.env.CI ? 2 : 0;
const scope = process.env.TEST_SCOPE || 'public';

const mainUiIgnore = [/tests\/api\//, /tests\/a11y\//, /tests\/visual\//, /tests\/setup\//];
const nonCompanyIgnore = [/tests\/e2e\/company\//];
const nonPublicUiIgnore = [/tests\/e2e\/app\//];
const scopedUiIgnore =
  scope === 'full'
    ? [...mainUiIgnore, ...nonCompanyIgnore, ...nonPublicUiIgnore]
    : [...mainUiIgnore, ...nonCompanyIgnore, ...nonPublicUiIgnore];

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 }
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries,
  workers: process.env.CI ? 2 : (headless ? workers : 1),
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL,
    headless,
    launchOptions: {
      slowMo: headless ? 0 : (slowMo || 500)
    },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'desktop-chrome',
      dependencies: ['setup'],
      testIgnore: scopedUiIgnore,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'candidate-journey',
      // No dependencies, so no company auth setup required
      testMatch: /tests\/e2e\/core\/human-like-website-journey.spec.ts/,
      use: {
        ...devices['Desktop Chrome']
        // uses default storage state (empty)
      }
    },
    {
      name: 'desktop-firefox',
      dependencies: ['setup'],
      testIgnore: scopedUiIgnore,
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'desktop-webkit',
      dependencies: ['setup'],
      testIgnore: scopedUiIgnore,
      use: {
        ...devices['Desktop Safari'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'mobile-chrome',
      dependencies: ['setup'],
      testIgnore: scopedUiIgnore,
      use: {
        ...devices['Pixel 7'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'mobile-safari',
      dependencies: ['setup'],
      testIgnore: scopedUiIgnore,
      use: {
        ...devices['iPhone 14'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/
    },
    {
      name: 'a11y',
      dependencies: ['setup'],
      testMatch: /tests\/a11y\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/company.json'
      }
    },
    {
      name: 'visual',
      dependencies: ['setup'],
      testMatch: /tests\/visual\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/company.json'
      }
    }
  ],
  outputDir: 'test-results/artifacts'
});
