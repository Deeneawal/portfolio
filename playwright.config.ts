import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "iphone-15", use: { ...devices["iPhone 15"] } },
    { name: "pixel-7", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    // Blank analytics config: the site must work with tracking as a silent no-op.
    env: { SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "", ADMIN_PASSWORD: "", ADMIN_SESSION_SECRET: "", VISITOR_SALT_SECRET: "" },
  },
});
