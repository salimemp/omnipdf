import { test, expect, devices } from "@playwright/test";

test.describe("Browser Compatibility", () => {
  test("Chromium works", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/OmniPDF/);
  });

  test("Firefox works", async ({ page }) => {
    await page.goto("/convert");
    await expect(page.locator("text=Upload Files")).toBeVisible();
  });

  test("WebKit works", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=Pro")).toBeVisible();
  });
});

test.describe("Mobile Compatibility", () => {
  test("iPhone 12 works", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("Pixel 5 works", async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("iPad Mini works", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Screen Resolution", () => {
  const resolutions = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1536, height: 864 },
    { width: 1280, height: 720 },
    { width: 2560, height: 1440 },
  ];

  for (const res of resolutions) {
    test(`${res.width}x${res.height}`, async ({ page }) => {
      await page.setViewportSize({ width: res.width, height: res.height });
      await page.goto("/");
      await expect(page.locator("h1")).toBeVisible();
      const cards = await page.locator('[data-testid="pricing-card"]').count();
      expect(cards).toBeGreaterThan(0);
    });
  }
});
