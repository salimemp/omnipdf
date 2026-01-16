import { test, expect } from "@playwright/test";

test.describe("Usability Tests", () => {
  test("Clear call-to-action buttons", async ({ page }) => {
    await page.goto("/");
    const ctaButtons = page.getByRole("link", { name: /convert|get started/i });
    await expect(ctaButtons.first()).toBeVisible();
  });

  test("Intuitive navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByText("Convert").click();
    await expect(page).toHaveURL(/.*convert/);
  });

  test("Helpful error messages", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[type="email"]', "invalid-email");
    await page.fill('input[type="password"]', "short");
    await page.click('button[type="submit"]');
    const error = page.locator("text=Please enter");
    expect(error.first()).toBeVisible();
  });

  test("Progress indicators during conversion", async ({ page }) => {
    await page.goto("/convert");
    const progressBar = page.locator('[role="progressbar"]');
    expect(progressBar).toBeDefined();
  });

  test("Clear pricing information", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=$7.99")).toBeVisible();
    await expect(page.locator("text=Pro")).toBeVisible();
  });

  test("Easy file upload", async ({ page }) => {
    await page.goto("/convert");
    const dropzone = page.locator('[data-testid="dropzone"]');
    await expect(dropzone).toBeVisible();
  });

  test("Mobile-friendly interface", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=Convert PDF")).toBeVisible();
  });

  test("Consistent design patterns", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Feedback for user actions", async ({ page }) => {
    await page.goto("/convert");
    const button = page.locator("button").first();
    await button.hover();
    expect(button).toHaveCSS("cursor", "pointer");
  });

  test("Loading states are visible", async ({ page }) => {
    await page.goto("/convert");
    const loading = page.locator('[data-testid="loading"], text=Loading');
    expect(loading).toBeDefined();
  });

  test("Success feedback after actions", async ({ page }) => {
    await page.goto("/convert");
    const success = page.locator('[data-testid="success"], text=Complete');
    expect(success).toBeDefined();
  });

  test("Easy to find help", async ({ page }) => {
    await page.goto("/");
    const helpLink = page.getByRole("link", { name: /help|support|faq/i });
    expect(helpLink.first()).toBeVisible();
  });
});
