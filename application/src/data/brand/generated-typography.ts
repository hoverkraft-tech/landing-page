/**
 * Generated typography tokens from branding repository
 * Auto-generated file - DO NOT EDIT MANUALLY
 * Last updated: 2025-11-04
 */

import type { TypographyCollection } from './types';

export const typography: TypographyCollection = {
  primary: {
    family: 'Inter Variable',
    weights: [400, 500, 600, 700],
    usage: {
      fr: 'Utiliser pour les titres et le texte principal.',
      en: 'Use for headings and main body text.',
    },
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  monospace: {
    family: 'Roboto Mono',
    weights: [400, 500],
    usage: {
      fr: 'Utiliser pour le code et les elements techniques.',
      en: 'Use for code snippets and technical elements.',
    },
    fallback: 'Consolas, Monaco, monospace',
  },
};
