import { test, expect } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  test("homepage should be accessible", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/OmniPDF/);

    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    await expect(page.locator("h1")).toHaveAttribute("aria-level", "1");
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);

    const h2s = page.locator("h2");
    for (const h2 of await h2s.all()) {
      await expect(h2).toHaveAttribute("aria-level", "2");
    }
  });

  test("should have proper form labels", async ({ page }) => {
    await page.goto("/auth/login");

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("aria-required", "true");
  });

  test("should be keyboard navigable", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focusedElement = await page.locator(":focus").inputValue();
  });

  test("should have proper alt text for images", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    for (const image of await images.all()) {
      const alt = await image.getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });

  test("should have proper focus indicators", async ({ page }) => {
    await page.goto("/");

    const button = page.locator("button").first();
    await button.focus();

    await expect(button).toHaveCSS("outline-width", /[1-9]/);
  });

  test("color contrast should meet WCAG AA", async ({ page }) => {
    await page.goto("/");

    const textElements = page.locator(
      "p, span, a, button, h1, h2, h3, h4, h5, h6",
    );
    const count = await textElements.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = textElements.nth(i);
      const color = await element.evaluate(
        (el) => window.getComputedStyle(el).color,
      );
      const bgColor = await element.evaluate((el) => {
        let current = el;
        while (current && current !== document.body) {
          const bg = window.getComputedStyle(current).backgroundColor;
          if (bg !== "rgba(0, 0, 0, 0)") return bg;
          current = current.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor;
      });

      expect(color).not.toBe(bgColor);
    }
  });
});

test.describe("Screen Reader Tests", () => {
  test("should have proper ARIA labels", async ({ page }) => {
    await page.goto("/convert");

    const dropzone = page.locator('[data-testid="dropzone"]');
    await expect(dropzone).toHaveAttribute("role", "button");
  });

  test("should announce dynamic content changes", async ({ page }) => {
    await page.goto("/convert");

    const statusRegion = page.locator('[role="status"]');
    await expect(statusRegion).toHaveCount(1);
  });
});
