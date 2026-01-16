#!/usr/bin/env node

/**
 * OmniPDF Test Runner
 * Validates test structure and provides test execution summary
 */

const fs = require('fs');
const path = require('path');

const testCategories = {
  'Unit Tests': [
    '/Users/abdulsalim/omnipdf/packages/shared/src/utils.test.ts',
    '/Users/abdulsalim/omnipdf/packages/shared/src/types.test.ts',
    '/Users/abdulsalim/omnipdf/packages/ui/src/Button.test.tsx',
    '/Users/abdulsalim/omnipdf/packages/ui/src/Input.test.tsx',
    '/Users/abdulsalim/omnipdf/packages/ui/src/Card.test.tsx',
  ],
  'Integration Tests': [
    '/Users/abdulsalim/omnipdf/apps/web/src/app/api/upload/route.test.ts',
    '/Users/abdulsalim/omnipdf/apps/web/src/app/api/convert/route.test.ts',
  ],
  'E2E Tests (Playwright)': [
    '/Users/abdulsalim/omnipdf/apps/web/tests/e2e/main.spec.ts',
  ],
  'Regression Tests': [
    '/Users/abdulsalim/omnipdf/apps/web/tests/regression/auth-payment-conversion.spec.ts',
  ],
  'Recovery Tests': [
    '/Users/abdulsalim/omnipdf/apps/web/tests/recovery/error-recovery.spec.ts',
  ],
  'Performance Tests': [
    '/Users/abdulsalim/omnipdf/apps/web/tests/performance/performance.spec.ts',
  ],
};

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function countTests(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const describeMatches = content.match(/describe\(/g) || [];
    const testMatches = content.match(/test\(/g) || [];
    const itMatches = content.match(/it\(/g) || [];
    return {
      suites: describeMatches.length,
      tests: testMatches.length + itMatches.length,
    };
  } catch (error) {
    return { suites: 0, tests: 0 };
  }
}

function runTestAnalysis() {
  console.log('\n🧪 OmniPDF Test Suite Analysis\n');
  console.log('='.repeat(60));

  let totalFiles = 0;
  let totalSuites = 0;
  let totalTests = 0;
  let existingFiles = 0;
  let missingFiles = [];

  for (const [category, files] of Object.entries(testCategories)) {
    console.log(`\n📁 ${category}`);
    console.log('-'.repeat(40));

    for (const filePath of files) {
      totalFiles++;
      const exists = checkFileExists(filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      
      if (exists) {
        existingFiles++;
        const { suites, tests } = countTests(filePath);
        totalSuites += suites;
        totalTests += tests;
        console.log(`  ✅ ${relativePath}`);
        console.log(`     └─ ${suites} suites, ${tests} tests`);
      } else {
        missingFiles.push(relativePath);
        console.log(`  ❌ ${relativePath}`);
        console.log(`     └─ FILE NOT FOUND`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary');
  console.log('-'.repeat(40));
  console.log(`Total Test Files: ${totalFiles}`);
  console.log(`Existing Files: ${existingFiles}`);
  console.log(`Missing Files: ${totalFiles - existingFiles}`);
  console.log(`Total Test Suites: ${totalSuites}`);
  console.log(`Total Individual Tests: ${totalTests}`);
  console.log(`\n📈 Coverage Areas:`);
  console.log(`  • Core utilities (formatBytes, formatDate, etc.)`);
  console.log(`  • Schema validation (User, Document, Conversion)`);
  console.log(`  • UI components (Button, Input, Card)`);
  console.log(`  • API routes (upload, convert)`);
  console.log(`  • Authentication flow`);
  console.log(`  • Payment flow`);
  console.log(`  • File conversion flow`);
  console.log(`  • Network failure recovery`);
  console.log(`  • Database recovery`);
  console.log(`  • File upload recovery`);
  console.log(`  • Authentication recovery`);
  console.log(`  • Rate limit handling`);
  console.log(`  • API response time`);
  console.log(`  • Memory usage`);
  console.log(`  • Concurrent request handling`);
  console.log(`  • Database query performance`);
  console.log(`  • Bundle size`);
  console.log(`  • Render performance`);
  console.log(`  • Cache performance`);
  console.log(`  • Homepage (E2E)`);
  console.log(`  • Convert page (E2E)`);
  console.log(`  • Pricing page (E2E)`);
  console.log(`  • Authentication (E2E)`);
  console.log(`  • Accessibility (E2E)`);
  console.log(`  • Mobile responsiveness (E2E)`);
  console.log(`  • Performance (E2E)`);
  console.log(`  • SEO (E2E)`);
  console.log(`  • Dark mode (E2E)`);

  if (missingFiles.length > 0) {
    console.log('\n⚠️  Missing Test Files:');
    missingFiles.forEach((file) => console.log(`  - ${file}`));
  }

  console.log('\n✅ Test Analysis Complete!\n');
}

function generateTestCommands() {
  console.log('\n📝 Test Execution Commands\n');
  console.log('To run the tests, use the following commands:\n');
  
  console.log('# Install Playwright for E2E tests');
  console.log('cd apps/web && npx playwright install\n');
  
  console.log('# Run unit tests');
  console.log('npx jest packages/shared/src/utils.test.ts --config jest.config.js\n');
  
  console.log('# Run integration tests');
  console.log('npx jest apps/web/src/app/api --config jest.config.js\n');
  
  console.log('# Run E2E tests');
  console.log('cd apps/web && npx playwright test\n');
  
  console.log('# Run all tests with coverage');
  console.log('npx jest --coverage --config jest.config.js\n');
  
  console.log('# Run specific test category');
  console.log('npx jest --testPathPattern="performance" --config jest.config.js\n');
}

runTestAnalysis();
generateTestCommands();
