# OmniPDF Test Suite Documentation

## Overview

This document describes the comprehensive test suite implemented for OmniPDF, covering unit tests, integration tests, end-to-end tests, regression tests, recovery tests, and performance tests.

## Test Statistics

| Category | Files | Suites | Tests |
|----------|-------|--------|-------|
| Unit Tests | 5 | 38 | 133 |
| Integration Tests | 2 | 2 | 6 |
| E2E Tests (Playwright) | 1 | 9 | 34 |
| Regression Tests | 1 | 5 | 11 |
| Recovery Tests | 1 | 6 | 17 |
| Performance Tests | 1 | 8 | 16 |
| **Total** | **11** | **68** | **217** |

## Test Structure

```
omnipdf/
├── jest.config.js              # Main Jest configuration
├── jest.setup.ts              # Test setup and mocks
├── packages/
│   ├── shared/src/
│   │   ├── utils.test.ts       # 57 tests for utilities
│   │   └── types.test.ts       # 26 tests for schemas
│   └── ui/src/
│       ├── Button.test.tsx     # 13 tests
│       ├── Input.test.tsx      # 18 tests
│       └── Card.test.tsx       # 19 tests
└── apps/web/
    ├── src/app/api/
    │   └── upload/route.test.ts # Integration tests
    └── tests/
        ├── e2e/
        │   └── main.spec.ts    # 34 E2E tests
        ├── regression/
        │   └── auth-payment-conversion.spec.ts
        ├── recovery/
        │   └── error-recovery.spec.ts
        └── performance/
            └── performance.spec.ts
```

## Unit Tests (133 tests)

### Shared Utilities (`packages/shared/src/utils.test.ts`)

**57 tests covering:**

- `formatBytes()` - File size formatting (6 tests)
- `formatDate()` - Date formatting (3 tests)
- `formatRelativeTime()` - Relative time display (5 tests)
- `generateId()` - UUID generation (2 tests)
- `truncate()` - String truncation (5 tests)
- `slugify()` - URL slug creation (5 tests)
- `debounce()` - Function debouncing (2 tests)
- `throttle()` - Function throttling (3 tests)
- `getFileExtension()` - File extension extraction (4 tests)
- `getFilenameWithoutExtension()` - Filename parsing (3 tests)
- `isValidFileType()` - File type validation (3 tests)
- `getMimeType()` - MIME type detection (4 tests)
- `sleep()` - Async delay (1 test)
- `retry()` - Retry logic (3 tests)
- `canConvert()` - Conversion availability (3 tests)
- `getConvertibleFormats()` - Format list (2 tests)
- `SUPPORTED_FORMATS` - Format constants (2 tests)

### Schema Validation (`packages/shared/src/types.test.ts`)

**26 tests covering:**

- `UserSchema` - User data validation (4 tests)
- `DocumentSchema` - Document metadata validation (4 tests)
- `ConversionJobSchema` - Job submission validation (4 tests)
- `SubscriptionPlanSchema` - Plan configuration (2 tests)
- `ApiResponseSchema` - API response format (3 tests)
- `ConversionOptionsSchema` - Conversion options (5 tests)
- `TIER_FEATURES` - Feature flags (4 tests)

### UI Components (`packages/ui/src/*.test.tsx`)

**50 tests covering:**

- `Button` - 13 tests (variants, sizes, states, icons, disabled, loading)
- `Input` - 18 tests (labels, validation, icons, types, accessibility)
- `Card` - 19 tests (variants, padding, headers, footers, composition)

## Integration Tests (6 tests)

### API Routes

**Upload Route (`apps/web/src/app/api/upload/route.test.ts`):**

- Returns 401 when not authenticated
- Returns 400 when no file provided
- Rejects files exceeding size limits

**Convert Route (`apps/web/src/app/api/convert/route.test.ts`):**

- Returns 401 when not authenticated
- Validates required fields
- Validates conversion type

## E2E Tests (34 tests)

### Homepage (`apps/web/tests/e2e/main.spec.ts`)

**9 test suites, 34 tests:**

1. **Homepage** (6 tests)
   - Page loads successfully
   - Hero section displays
   - CTA buttons visible
   - Tool cards visible
   - Navigation links work
   - Footer links present

2. **Convert Page** (3 tests)
   - Page loads
   - Drop zone visible
   - File selection works

3. **Pricing Page** (5 tests)
   - Page loads
   - Three tiers displayed
   - Pricing visible
   - Billing toggle works
   - CTAs visible

4. **Authentication** (4 tests)
   - Login page loads
   - Signup page loads
   - Signup form fields present
   - Social login buttons present

5. **Accessibility** (4 tests)
   - Proper language attribute
   - Correct heading hierarchy
   - Images have alt text
   - Keyboard accessible

6. **Mobile Responsiveness** (2 tests)
   - Responsive viewport
   - Usable navigation

7. **Performance** (2 tests)
   - Fast page load
   - Lazy loaded images

8. **SEO** (4 tests)
   - Meta description present
   - Open Graph tags present
   - Canonical URL present
   - Robots meta tag present

9. **Dark Mode** (1 test)
   - Dark mode support

## Regression Tests (11 tests)

### Critical Flows

**Authentication Flow** (3 tests)
- Email signup creates user
- Login returns session
- Login fails with invalid credentials

**Payment Flow** (3 tests)
- Subscription creates Stripe customer
- Subscription creates checkout session
- Subscription updates user tier

**File Conversion Flow** (3 tests)
- Upload creates document record
- Conversion updates status
- Conversion handles errors

**Email Notification Flow** (2 tests)
- Verification email sent
- Conversion complete email sent

## Recovery Tests (17 tests)

### Network Failure Recovery (3 tests)
- Retry on network failure
- Fail after max retries
- Recover from timeout

### Database Recovery (3 tests)
- Recover from connection failure
- Handle transaction commit
- Rollback on failure

### File Upload Recovery (2 tests)
- Resume interrupted upload
- Validate file integrity

### Authentication Recovery (3 tests)
- Refresh expired token
- Log out on auth error
- Redirect on session expiry

### Rate Limit Recovery (3 tests)
- Wait and retry after rate limit
- Notify user of rate limit

## Performance Tests (16 tests)

### API Response Time (3 tests)
- Upload API < 2 seconds
- Convert API < 5 seconds
- List API < 500ms

### Memory Usage (2 tests)
- Memory stays within limit
- Cleanup releases memory

### Concurrent Request Handling (2 tests)
- Handle multiple concurrent uploads
- Limit concurrent operations

### Database Query Performance (2 tests)
- Pagination query performance
- Search query performance

### Bundle Size (2 tests)
- Bundle size optimized
- Lazy loaded chunks small

### Render Performance (2 tests)
- Component renders within 16ms
- Virtual scrolling for large lists

### Cache Performance (2 tests)
- Cache hit improves response time
- Cache expiration works

## Test Execution

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
cd apps/web && npx playwright install
```

### Running Tests

```bash
# Run all unit tests
npx jest --testPathPattern="packages" --config jest.config.js

# Run all tests with coverage
npx jest --coverage --config jest.config.js

# Run E2E tests
cd apps/web && npx playwright test

# Run specific test category
npx jest --testPathPattern="performance" --config jest.config.js
npx jest --testPathPattern="regression" --config jest.config.js
npx jest --testPathPattern="recovery" --config jest.config.js

# Run E2E tests in UI mode
cd apps/web && npx playwright test --ui
```

### Test Configuration

The test suite is configured in `jest.config.js` with:
- Coverage threshold: 70% for all metrics
- Test timeout: 10 seconds
- Parallel execution enabled
- Automatic cleanup after each test

## Coverage Goals

| Metric | Target | Description |
|--------|--------|-------------|
| Branches | 70% | Decision points in code |
| Functions | 70% | Function coverage |
| Lines | 70% | Line coverage |
| Statements | 70% | Statement coverage |

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Run Tests
  run: |
    npm install --legacy-peer-deps
    npx jest --coverage --config jest.config.js
    cd apps/web && npx playwright install --with-deps
    npx playwright test
```

## Best Practices Implemented

1. **Test Isolation** - Each test runs independently
2. **Mock External Services** - Supabase, Stripe, Resend mocked
3. **Setup/Teardown** - Proper before/after hooks
4. **Descriptive Names** - Clear test descriptions
5. **Edge Cases** - Boundary value testing
6. **Error Handling** - Error path testing
7. **Accessibility Testing** - ARIA labels, keyboard nav
8. **Performance Baselines** - Response time limits

## Continuous Improvement

The test suite is designed to be:
- **Extensible** - Easy to add new tests
- **Maintainable** - Clear structure and organization
- **Fast** - Parallel execution
- **Reliable** - Minimal flakiness
- **Comprehensive** - High coverage of critical paths
