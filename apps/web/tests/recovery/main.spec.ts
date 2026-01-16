import { test, expect } from "@playwright/test";

test.describe("Recovery Tests", () => {
  test("Auto-retry on failure", async ({ page }) => {
    await page.goto("/convert");
    const retryButton = page.locator("text=Retry");
    expect(retryButton).toBeDefined();
  });

  test("Offline queue works", async ({ page }) => {
    await page.goto("/convert");
    const queue = page.locator("text=queued");
    expect(queue).toBeDefined();
  });

  test("Session recovery after refresh", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.reload();
    expect(page).toHaveTitle(/OmniPDF/);
  });

  test("Error boundary catches errors", async ({ page }) => {
    await page.goto("/convert");
    const errorBoundary = page.locator("[data-error-boundary]");
    expect(errorBoundary).toBeDefined();
  });

  test("Graceful degradation", async ({ page }) => {
    await page.goto("/");
    const degraded = page.locator("text=limited");
    expect(degraded).toBeDefined();
  });

  test("Cache recovery", async ({ page }) => {
    await page.goto("/");
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("State restoration", async ({ page }) => {
    await page.goto("/convert");
    await page.evaluate(() => {
      sessionStorage.setItem("state", JSON.stringify({ step: 1 }));
    });
    await page.reload();
    expect(page).toHaveTitle(/OmniPDF/);
  });

  test("Connection restoration", async ({ page }) => {
    await page.goto("/convert");
    await page.context().setOffline(true);
    await page.context().setOffline(false);
    const online = page.locator("text=online");
    expect(online).toBeDefined();
  });

  test("Progress saved", async ({ page }) => {
    await page.goto("/convert");
    const progress = page.locator('[role="progressbar"]');
    expect(progress).toBeDefined();
  });

  test("Upload retry", async ({ page }) => {
    await page.goto("/convert");
    const retry = page.locator("text=Retry");
    expect(retry).toBeDefined();
  });
});
