/**
 * Auto-generated typography tokens from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: 0.1.0
 * Commit: 1149c11c0afa546258ff99b3e5dbe38e44e4df2a
 * Generated: 2025-11-09T09:58:56.200Z
 */

import type { TypographyCollection } from './types';

export const typography: TypographyCollection = {
  monospace: {
    fallback: 'ui-monospace, monospace',
    family: 'Roboto Mono',
    usage: {
      en: 'Monospaced typography for code samples and serials',
      fr: 'Typographie à chasse fixe pour les exemples de code et numérotations',
    },
    weights: [100, 200, 400],
  },
  primary: {
    fallback: 'system-ui, sans-serif',
    family: 'Inter',
    usage: {
      en: 'Primary typography for headings, body copy, and CTAs',
      fr: 'Typographie principale pour les titres, paragraphes et CTA',
    },
    weights: [100, 200, 400],
  },
};
