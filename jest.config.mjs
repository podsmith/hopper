/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  verbose: false,
  workerIdleMemoryLimit: 0.5,
  rootDir: import.meta.dirname,
  projects: ['<rootDir>'],
  bail: 1,
  clearMocks: true,
  collectCoverage: false,
  errorOnDeprecated: true,
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/tests/**/*.(test|spec).ts'],
  transformIgnorePatterns: [],
  passWithNoTests: true,
  detectOpenHandles: true,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '~/(.*)': '<rootDir>/tests/$1',
  },
  cache: true,
  cacheDirectory: '<rootDir>/.cache/jest',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html', 'cobertura'],
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'junit.xml',
      },
    ],
  ],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  // NOTE: Coverage threshold to be constantly monitored and updated, if needed
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/.*.d.ts',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/.*/_.*',
    '<rootDir>/tests/',
    '<rootDir>/src/types',
  ],
  globalSetup: '<rootDir>/tests/setup/test.global.setup.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/test.setup.ts'],
};

export default config;
