import { expect, test, type Page } from "@playwright/test";

async function noHorizontalOverflow(page: Page) {
  const [scroll, inner] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(scroll, "page must not scroll sideways").toBeLessThanOrEqual(inner);
}

test("home renders the hero, groups and résumé link", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Zuhaib Ahmad Khan/ })).toBeAttached();
  for (const g of ["Today", "How I work", "What I've shipped", "Lab", "About"]) {
    await expect(page.getByRole("heading", { level: 2, name: g })).toBeAttached();
  }
  await expect(page.locator("[data-tile]")).toHaveCount(25);
  await expect(page.getByRole("link", { name: /Download résumé/ }).first()).toHaveAttribute("href", "/api/resume");
  await noHorizontalOverflow(page);
});

test("a card opens as a sheet with its own URL and Esc closes it", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is desktop-only");
  await page.goto("/");
  const tile = page.locator('[data-tile="safeguards"]');
  await tile.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/story\/safeguards$/);
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { level: 1 })).toHaveText("Production holds no surprises.");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute("data-tile"))).toBe("safeguards");
});

test("browser back closes an open sheet", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-tile="surgyfield"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("tapping a card works on touch and the sheet fits the screen", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-tile="surgy-assist"]').click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close story" })).toBeVisible();
  await noHorizontalOverflow(page);
  await page.getByRole("button", { name: "Close story" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("deep link renders a full page that closes to home", async ({ page }) => {
  await page.goto("/story/surgycrm");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: "SurgyCRM" })).toBeVisible();
  await noHorizontalOverflow(page);
  await page.getByRole("link", { name: "All stories" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("command palette searches and navigates", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /Search/ }).last().click();
  else await page.keyboard.press("ControlOrMeta+k");
  const input = page.getByPlaceholder("Search stories, skills, actions…");
  await expect(input).toBeVisible();
  await input.fill("SurgyField");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/story\/surgyfield$/);
});

test("résumé downloads go through the counter and redirect to the PDF", async ({ request }) => {
  const res = await request.get("/api/resume", { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers()["location"]).toMatch(/\.pdf$/);
  expect(res.headers()["cache-control"]).toContain("no-store");
  const pdf = await request.get(res.headers()["location"]!);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
});

test("tracking endpoint is a silent no-op without configuration", async ({ request }) => {
  const res = await request.post("/api/t", { data: JSON.stringify({ t: "pageview", p: "/", sid: crypto.randomUUID() }) });
  expect(res.status()).toBe(204);
});

test("admin pages are private", async ({ page, request }) => {
  const res = await request.get("/admin", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toContain("/admin/login");
  const content = await request.get("/admin/content", { maxRedirects: 0 });
  expect(content.status()).toBe(307);
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Owner dashboard" })).toBeVisible();
  expect((await request.get("/admin/login")).headers()["x-robots-tag"]).toContain("noindex");
});

test("no sideways scroll on small phones, sheet open or closed", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 760 });
    await page.goto("/");
    await noHorizontalOverflow(page);
    await page.locator('[data-tile="agentic-workflow"]').click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await noHorizontalOverflow(page);
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("the sheet appears immediately", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-tile="performance"]').click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 1000 });
  });
});
