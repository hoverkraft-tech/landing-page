/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        'astrowind:config': path.resolve(__dirname, './src/test/stubs/astrowind-config.ts'),
      },
    },
    test: {
      include: ['src/test/**/*.test.ts', 'src/components/**/*.test.ts'],
      exclude: ['src/test/maturity-print-*.test.ts'],
      environment: 'node',
      coverage: {
        enabled: false,
        provider: 'v8',
        thresholds: {
          lines: 85,
          statements: 85,
          functions: 85,
          branches: 85,
        },
      },
    },
  },
  {
    // Keep component/unit tests minimal and deterministic.
    // We don't want site integrations (sitemap, compress, etc.) running in unit tests.
    configFile: false,
    integrations: [],
  }
);
