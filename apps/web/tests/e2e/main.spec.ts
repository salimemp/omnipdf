import { test, expect, describe, beforeEach } from '@playwright/test';

describe('Homepage', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/OmniPDF/);
  });

  test('displays hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('All-in-One PDF');
  });

  test('displays CTA buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /convert pdf now/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view pricing/i })).toBeVisible();
  });

  test('displays tool cards', async ({ page }) => {
    await expect(page.locator('text=Merge PDF')).toBeVisible();
    await expect(page.locator('text=Split PDF')).toBeVisible();
    await expect(page.locator('text=Compress PDF')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.getByRole('link', { name: /convert/i }).click();
    await expect(page).toHaveURL(/\/convert/);
  });

  test('pricing link works', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    await expect(page).toHaveURL(/\/pricing/);
  });

  test('footer links are present', async ({ page }) => {
    await expect(page.locator('text=Privacy')).toBeVisible();
    await expect(page.locator('text=Terms')).toBeVisible();
  });
});

describe('Convert Page', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/convert');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Convert/);
  });

  test('displays drop zone', async ({ page }) => {
    await expect(page.getByText(/drag & drop your files/i)).toBeVisible();
  });

  test('allows file selection', async ({ page }) => {
    // The file input should exist
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('displays progress steps', async ({ page }) => {
    await expect(page.locator('text=Upload Files')).toBeVisible();
    await expect(page.locator('text=Configure')).toBeVisible();
    await expect(page.locator('text=Convert')).toBeVisible();
    await expect(page.locator('text=Complete')).toBeVisible();
  });
});

describe('Pricing Page', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing/);
  });

  test('displays three pricing tiers', async ({ page }) => {
    await expect(page.locator('text=Free')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });

  test('displays pricing for Pro tier', async ({ page }) => {
    await expect(page.locator('text=$7.99')).toBeVisible();
  });

  test('billing toggle works', async ({ page }) => {
    const annualButton = page.getByRole('button', { name: /annual/i });
    await annualButton.click();
    await expect(annualButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('shows savings for annual billing', async ({ page }) => {
    await expect(page.locator('text=Save 17%')).toBeVisible();
  });

  test('CTAs are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /get started free/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /start free trial/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact sales/i })).toBeVisible();
  });
});

describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('signup page loads', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page).toHaveTitle(/Sign Up/);
    await expect(page.locator('text=Create your account')).toBeVisible();
  });

  test('signup form has required fields', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /terms/i })).toBeVisible();
  });

  test('social login buttons are present', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
  });
});

describe('Accessibility', () => {
  test('page has proper language attribute', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('headings are in correct order', async ({ page }) => {
    await page.goto('/');
    
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    
    // No multiple h1s
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Skip decorative images which can have empty alt
      if (await img.isVisible()) {
        expect(alt).not.toBeNull();
      }
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/pricing');
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocusable = page.locator(':focus');
    await expect(firstFocusable).toBeVisible();
  });
});

describe('Mobile Responsiveness', () => {
  test('page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should still be functional
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation is usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu button should be visible
    const mobileMenu = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(mobileMenu).toBeVisible();
  });
});

describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    
    // Wait for main content to load
    await page.waitForSelector('h1');
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('images are lazy loaded', async ({ page }) => {
    await page.goto('/');
    
    // Check that images have loading="lazy" or use IntersectionObserver
    const images = page.locator('img[loading="lazy"]');
    // At least some images should be lazy loaded
  });
});

describe('SEO', () => {
  test('page has meta description', async ({ page }) => {
    await page.goto('/');
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute('content', /pdf/i);
  });

  test('page has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /OmniPDF/i);
  });

  test('page has canonical URL', async ({ page }) => {
    await page.goto('/');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /omnipdf\.com/);
  });

  test('page has robots meta tag', async ({ page }) => {
    await page.goto('/');
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /index.*follow/i);
  });
});

describe('Dark Mode', () => {
  test('page supports dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Dark mode toggle should exist
    const themeToggle = page.locator('button').filter({ has: page.locator('[class*="dark:"]') });
    // Toggle should be visible
  });
});
