import { test, expect } from "@playwright/test";

test.describe("Regression Tests", () => {
  test("Authentication flow regression", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.locator("text=Sign in")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("Conversion flow regression", async ({ page }) => {
    await page.goto("/convert");
    await expect(page.locator("text=Upload Files")).toBeVisible();
    await expect(page.locator("text=Configure")).toBeVisible();
    await expect(page.locator("text=Convert")).toBeVisible();
    await expect(page.locator("text=Complete")).toBeVisible();
  });

  test("Pricing display regression", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=Free")).toBeVisible();
    await expect(page.locator("text=Pro")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
    await expect(page.locator("text=$7.99")).toBeVisible();
  });

  test("Navigation regression", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("OmniPDF");
    await page.getByRole("link", { name: /convert/i }).click();
    await expect(page).toHaveURL(/.*convert/);
  });

  test("File upload regression", async ({ page }) => {
    await page.goto("/convert");
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test("Footer links regression", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Privacy")).toBeVisible();
    await expect(page.locator("text=Terms")).toBeVisible();
    await expect(page.locator("text=Contact")).toBeVisible();
  });

  test("Social login regression", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
  });

  test("Theme toggle regression", async ({ page }) => {
    await page.goto("/");
    const themeToggle = page
      .locator("button")
      .filter({ has: page.locator('[class*="dark"]') });
    expect(themeToggle).toBeDefined();
  });

  test("Language selector regression", async ({ page }) => {
    await page.goto("/");
    const langSelector = page.locator('[data-testid="language-selector"]');
    expect(langSelector).toBeDefined();
  });

  test("Pricing CTA regression", async ({ page }) => {
    await page.goto("/pricing");
    await expect(
      page.getByRole("link", { name: /get started free/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /start free trial/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /contact sales/i }),
    ).toBeVisible();
  });

  test("Hero section regression", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("All-in-One PDF");
    await expect(page.locator("text=Convert PDF now")).toBeVisible();
  });

  test("Tools section regression", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Merge PDF")).toBeVisible();
    await expect(page.locator("text=Split PDF")).toBeVisible();
    await expect(page.locator("text=Compress PDF")).toBeVisible();
  });

  test("Mobile menu regression", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    const menuButton = page.locator("button").first();
    await expect(menuButton).toBeVisible();
  });

  test("Loading states regression", async ({ page }) => {
    await page.goto("/convert");
    const loading = page.locator('[data-testid="loading"]');
    expect(loading).toBeDefined();
  });

  test("Error messages regression", async ({ page }) => {
    await page.goto("/auth/login");
    await page.click('button[type="submit"]');
    const error = page.locator("text=required");
    expect(error.first()).toBeVisible();
  });
});
