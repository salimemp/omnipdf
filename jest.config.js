/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: [
    '**/*.test.{ts,tsx}',
    '**/*.spec.{ts,tsx}',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/.next/',
    '/e2e/',
    '/playwright/',
  ],
  moduleNameMapper: {
    '^@omnipdf/shared/src/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@omnipdf/ui/src/(.*)$': '<rootDir>/packages/ui/src/$1',
    '^@omnipdf/api/src/(.*)$': '<rootDir>/packages/api/src/$1',
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    'apps/web/src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
    }],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  testTimeout: 10000,
  verbose: true,
};
