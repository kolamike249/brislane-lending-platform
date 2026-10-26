import { defineConfig, devices } from "@playwright/test";
import { environment } from "./config/environments";

const ci = Boolean(process.env.CI);
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
    { name: "api-chromium", testDir: "./tests/api", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium", testDir: "./tests", testIgnore: "**/api/**", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", testDir: "./tests", testIgnore: "**/api/**", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testDir: "./tests", testIgnore: "**/api/**", use: { ...devices["Desktop Safari"] } },
  ],
});
