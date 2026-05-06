/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { getViteConfig } from 'astro/config';

const astroViteConfig = getViteConfig(
  {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        'astrowind:config': path.resolve(__dirname, './src/test/stubs/astrowind-config.ts'),
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

export default defineConfig(async (env) =>
  mergeConfig(await astroViteConfig(env), {
    test: {
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      exclude: ['src/test/maturity-print-*.test.ts'],
      environment: 'node',
      coverage: {
        enabled: false,
        provider: 'v8',
        include: [
          'src/utils/permalinks.ts',
          'src/utils/utils.ts',
          'src/components/common/ContactEmailLink.astro',
          'src/components/common/SiteLink.astro',
        ],
        thresholds: {
          lines: 85,
          statements: 85,
          functions: 85,
          branches: 85,
        },
      },
    },
  })
);
