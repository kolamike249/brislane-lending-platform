import { defineConfig, devices } from "@playwright/test";
import { environment } from "./config/environments";

const ci = Boolean(process.env.CI);
const target = environment.name;
const viewports = [
  { key: "desktop", width: 1280, height: 720 },
  { key: "tablet", width: 768, height: 1024 },
  { key: "mobile", width: 375, height: 812 },
] as const;
const browsers = [
  { key: "chromium", device: devices["Desktop Chrome"] },
  { key: "firefox", device: devices["Desktop Firefox"] },
  { key: "webkit", device: devices["Desktop Safari"] },
] as const;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_500 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }], ["junit", { outputFile: "test-results/junit.xml" }]],
  use: {
    baseURL: environment.baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    { name: `${target}-api-chromium`, testDir: "./tests/api", use: { ...devices["Desktop Chrome"] } },
    ...browsers.flatMap(({ key, device }) => viewports.map(({ key: viewport, width, height }) => ({
      name: `${target}-${key}-${viewport}`,
      testDir: "./tests",
      testIgnore: "**/api/**",
      use: { ...device, viewport: { width, height } },
    }))),
  ],
});
