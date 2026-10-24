import { defineConfig, devices } from '@playwright/test';

/*
  Visual + smoke coverage for the docs shell.

  The browser is the system Chrome installation (`channel: 'chrome'`), so no
  `playwright install` step is required locally. CI's ubuntu image ships Chrome
  as well. `PLAYWRIGHT_BROWSERS_PATH` is respected automatically when set.
*/

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.08,
      animations: 'disabled',
    },
  },
  /* Baselines are checked in without a platform suffix so the Linux CI runner
     reuses the same images. */
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'desktop-1440',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'mobile-390',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],
  webServer: {
    command: 'npm run preview -w @nasaq-ui/docs -- --host 127.0.0.1 --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
