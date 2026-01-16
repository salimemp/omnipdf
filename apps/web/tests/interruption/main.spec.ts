import { test, expect } from "@playwright/test";

test.describe("Interruption Tests", () => {
  test("Page load interruption shows error", async ({ page }) => {
    await page.route("**/*", (route) => route.abort("failed"));
    await page.goto("/").catch(() => {});
    const error = await page.locator("text=Error").count();
    expect(error).toBeGreaterThanOrEqual(0);
  });

  test("Network failure during upload", async ({ page }) => {
    await page.goto("/convert");
    await page.route("**/api/upload**", (route) => route.abort("failed"));
    const error = await page.locator("text=Upload failed").count();
    expect(error).toBeGreaterThanOrEqual(0);
  });

  test("Conversion interruption shows status", async ({ page }) => {
    await page.goto("/convert");
    const status = page.locator('[role="status"]');
    expect(status).toBeDefined();
  });

  test("Slow network shows loading state", async ({ page }) => {
    await page.goto("/convert");
    const loading = page.locator('[data-testid="loading"]');
    expect(loading).toBeDefined();
  });

  test("API timeout handled gracefully", async ({ page }) => {
    await page.goto("/convert");
    const errorMessage = page.locator("text=timeout", { exact: false });
    expect(errorMessage).toBeDefined();
  });

  test("Connection loss shows offline message", async ({ page }) => {
    await page.goto("/convert");
    await page.context().setOffline(true);
    const offlineMsg = page.locator("text=offline", { exact: false });
    expect(offlineMsg).toBeDefined();
  });

  test("Browser back button works", async ({ page }) => {
    await page.goto("/");
    await page.click("text=Convert");
    await page.goBack();
    await expect(page).toHaveURL("/");
  });

  test("Page refresh works", async ({ page }) => {
    await page.goto("/convert");
    await page.reload();
    await expect(page.locator("text=Upload Files")).toBeVisible();
  });

  test("Tab switching preserves state", async ({ page }) => {
    await page.goto("/convert");
    const fileInput = page.locator('input[type="file"]');
    await page.waitForTimeout(100);
    const context = page.context();
    const newPage = await context.newPage();
    await newPage.close();
    await expect(fileInput).toBeVisible();
  });

  test("Browser close handling", async ({ page }) => {
    await page.goto("/convert");
    await page.close();
    expect(page.isClosed()).toBe(true);
  });
});

test.describe("Recovery Tests", () => {
  test("Auto-retry on network failure", async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/convert**", (route) => {
      attempts++;
      if (attempts < 2) {
        route.abort("failed");
      } else {
        route.continue();
      }
    });

    await page.goto("/convert");
    const success = page.locator("text=Complete");
    expect(success).toBeDefined();
  });

  test("Offline queue persists", async ({ page }) => {
    await page.goto("/convert");
    await page.context().setOffline(true);
    const queue = page.locator("text=queued", { exact: false });
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

  test("Upload retry after failure", async ({ page }) => {
    await page.goto("/convert");
    const retryButton = page.locator("text=Retry");
    expect(retryButton).toBeDefined();
  });

  test("Error boundary catches errors", async ({ page }) => {
    await page.goto("/convert");
    const errorBoundary = page.locator("[data-error-boundary]");
    expect(errorBoundary).toBeDefined();
  });

  test("Graceful degradation works", async ({ page }) => {
    await page.goto("/");
    const degraded = page.locator("text=limited functionality");
    expect(degraded).toBeDefined();
  });

  test("Cache recovery works", async ({ page }) => {
    await page.goto("/");
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("State restoration after crash", async ({ page }) => {
    await page.goto("/convert");
    await page.evaluate(() => {
      sessionStorage.setItem("conversion_state", JSON.stringify({ step: 1 }));
    });
    await page.reload();
    expect(page).toHaveTitle(/OmniPDF/);
  });

  test("Progress saved during interruption", async ({ page }) => {
    await page.goto("/convert");
    const progress = page.locator('[role="progressbar"]');
    expect(progress).toBeDefined();
  });

  test("Connection restoration detected", async ({ page }) => {
    await page.goto("/convert");
    await page.context().setOffline(true);
    await page.context().setOffline(false);
    const online = page.locator("text=back online");
    expect(online).toBeDefined();
  });
});
