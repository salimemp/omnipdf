import { test, expect } from '@playwright/test';

test.describe('Installation Tests', () => {
  test('npm install succeeds', async () => {
    const { execSync } = require('child_process');
    try {
      execSync('npm install --silent', { 
        cwd: '/Users/abdulsalim/omnipdf',
        stdio: 'pipe',
        timeout: 120000
      });
      expect(true).toBe(true);
    } catch (error) {
      expect(false).toBe(true);
    }
  });

  test('dependencies are available', async ({ page }) => {
    await page.goto('/package.json');
    const content = await page.content();
    expect(content).toContain('next');
    expect(content).toContain('react');
    expect(content).toContain('typescript');
  });

  test('devDependencies installed', async ({ page }) => {
    await page.goto('/package.json');
    const content = await page.content();
    expect(content).toContain('playwright');
    expect(content).toContain('eslint');
    expect(content).toContain('jest');
  });

  test('scripts are defined', async ({ page }) => {
    await page.goto('/package.json');
    const content = await page.content();
    expect(content).toContain('"dev"');
    expect(content).toContain('"build"');
    expect(content).toContain('"test"');
    expect(content).toContain('"lint"');
  });

  test('typescript configuration exists', async ({ page }) => {
    await page.goto('/tsconfig.json');
    const content = await page.content();
    expect(content).toContain('compilerOptions');
    expect(content).toContain('strict');
  });

  test('next.js configuration exists', async ({ page }) => {
    await page.goto('/next.config.js');
    const content = await page.content();
    expect(content).toContain('next');
  });

  test('tailwind configuration exists', async ({ page }) => {
    await page.goto('/tailwind.config.ts');
    const content = await page.content();
    expect(content).toContain('tailwindcss');
    expect(content).toContain('content');
  });

  test('environment variables template exists', async ({ page }) => {
    await page.goto('/.env.example');
    const content = await page.content();
    expect(content).toContain('NEXT_PUBLIC_SUPABASE');
    expect(content).toContain('GOOGLE_');
  });

  test('gitignore excludes node_modules', async ({ page }) => {
    await page.goto('/.gitignore');
    const content = await page.content();
    expect(content).toContain('node_modules');
    expect(content).toContain('.next');
  });

  test('workspace packages resolve', async ({ page }) => {
    await page.goto('/package.json');
    const content = await page.content();
    expect(content).toContain('workspaces');
    expect(content).toContain('apps/*');
    expect(content).toContain('packages/*');
  });

  test('turbo configuration exists', async ({ page }) => {
    await page.goto('/turbo.json');
    const content = await page.content();
    expect(content).toContain('$schema');
  });

 .test('packageManager version is valid', async ({ page }) => {
    await page.goto('/package.json');
    const content = await page.content();
    expect(content).toContain('packageManager');
    expect(content).toContain('npm@');
  });
});
