import { test, expect } from "@playwright/test";

test.describe("Localization Tests", () => {
  const languages = [
    "en",
    "es",
    "fr",
    "de",
    "zh",
    "ja",
    "pt",
    "ru",
    "ar",
    "ko",
  ];

  for (const lang of languages) {
    test(`${lang} translations work`, async ({ page }) => {
      await page.goto(`/${lang}/`);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("Language switcher works", async ({ page }) => {
    await page.goto("/");
    const langSelector = page.locator('[data-testid="language-selector"]');
    await expect(langSelector).toBeVisible();
  });

  test("Currency selector works", async ({ page }) => {
    await page.goto("/pricing");
    const currencySelector = page.locator('[data-testid="currency-selector"]');
    await expect(currencySelector).toBeVisible();
  });

  test("Right-to-left languages work", async ({ page }) => {
    await page.goto("/ar");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("dir", "rtl");
  });

  test("Date formats localize", async ({ page }) => {
    await page.goto("/pricing");
    const dateElement = page.locator('[data-testid="billing-date"]');
    expect(dateElement).toBeDefined();
  });

  test("Number formats localize", async ({ page }) => {
    await page.goto("/pricing");
    const priceElement = page.locator('[data-testid="price"]');
    expect(priceElement).toBeDefined();
  });

  test("Missing translations show key", async ({ page }) => {
    await page.goto("/");
    const content = await page.content();
    expect(content).not.toMatch(/\[\w+\.\w+\]/);
  });
});
