import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  expect: { toHaveScreenshot: { maxDiffPixels: 120 } },
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: {
    command: 'astro build && astro preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 180_000,
    // astro depends on am-i-vibing and detaches `astro preview` when it
    // detects an agentic shell, which makes Playwright's webServer think the
    // server died. Pinning this keeps the process in the foreground so the
    // suite behaves the same for a person and for an agent.
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
