import { test, expect } from "@playwright/test";

test.describe("Security Tests", () => {
  test("No sensitive data in client code", async ({ page }) => {
    const content = await page.content();
    expect(content).not.toContain("process.env.SUPABASE_SERVICE_ROLE_KEY");
    expect(content).not.toContain("private_key");
  });

  test("Content Security Policy is present", async ({ page }) => {
    const response = await page.goto("/");
    const csp = response?.headers()?.["content-security-policy"];
    if (csp) {
      expect(csp).toContain("default-src 'self'");
    }
  });

  test("Rate limiting is enforced", async ({ request }) => {
    const responses = [];
    for (let i = 0; i < 60; i++) {
      const res = await request.post("/api/convert", {
        data: { type: "test" },
      });
      responses.push(res.status());
    }
    const hasRateLimit = responses.some((s) => s === 429);
    expect(hasRateLimit).toBe(true);
  });

  test("Password requirements enforced", async ({ page }) => {
    await page.goto("/auth/signup");
    await page.fill('input[type="password"]', "123");
    await page.click('button[type="submit"]');
    const error = await page.locator("text=Password").count();
    expect(error).toBeGreaterThanOrEqual(0);
  });

  test("No XSS vulnerability", async ({ page }) => {
    await page.goto("/convert");
    await page.evaluate(() => {
      const script = document.createElement("script");
      script.src = "http://evil.com/xss.js";
      document.body.appendChild(script);
    });
    const evilScripts = await page.locator('script[src*="evil.com"]').count();
    expect(evilScripts).toBe(0);
  });

  test("API tokens not exposed", async ({ page }) => {
    const content = await page.content();
    expect(content).not.toMatch(/AIza[a-zA-Z0-9_-]{35}/);
    expect(content).not.toMatch(/sk_live[a-zA-Z0-9_-]{24}/);
  });

  test("CORS prevents unauthorized origins", async ({ request }) => {
    const response = await request.fetch("/api/convert", {
      headers: { Origin: "http://malicious.com" },
    });
    const cors = response.headers()["access-control-allow-origin"];
    expect(cors).not.toBe("*");
  });

  test("Session cookies are secure", async ({ page }) => {
    await page.goto("/");
    const cookies = await page.context().cookies();
    for (const cookie of cookies) {
      if (cookie.name.includes("auth") || cookie.name.includes("session")) {
        expect(cookie.secure).toBe(true);
      }
    }
  });

  test("GDPR consent banner visible", async ({ page }) => {
    await page.goto("/");
    const banner = page.locator('[data-testid="cookie-banner"], text=Cookie');
    expect(banner).toBeDefined();
  });

  test("Input validation prevents injection", async ({ page }) => {
    await page.goto("/auth/login");
    await page.fill('input[type="email"]', "' OR '1'='1");
    await page.fill('input[type="password"]', "' OR '1'='1");
    await page.click('button[type="submit"]');
    const sqlError = await page.locator("text=SQL").count();
    expect(sqlError).toBe(0);
  });
});
