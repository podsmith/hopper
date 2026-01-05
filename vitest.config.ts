import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '~': resolve(process.cwd(), 'tests/'),
      '@': resolve(process.cwd(), 'src/'),
    },
    bail: 1,
    coverage: {
      clean: true,
      exclude: ['**/*.d.ts', '**/_*/**', 'src/index.ts', 'src/types'],
      include: ['src/**'],
      provider: 'v8',
      reporter: ['text', 'html', 'cobertura', 'json', 'json-summary'],
      reportOnFailure: true,
      reportsDirectory: 'coverage',
      // NOTE: Keep track of thresholds, and update if necessary
      thresholds: {
        branches: 2,
        functions: 2,
        lines: 2,
        statements: 2,
      },
    },
    environment: 'node',
    expect: { requireAssertions: true },
    globals: true,
    include: ['tests/**/*.{test,spec}.{ts,js}'],
    outputFile: {
      json: 'junit.json',
      junit: 'junit.xml',
    },
    passWithNoTests: false,
    reporters: ['junit', 'json', 'default'],
    testTimeout: 10_000,
    watch: false,
    sequence: { shuffle: { files: true, tests: false } },
    setupFiles: ['tests/setup/test.setup.ts'],
  },
});
