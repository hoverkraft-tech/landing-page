/**
 * Brand tokens and design system values
 *
 * This file contains the core brand identity tokens including colors, typography,
 * spacing, and other design system values. Colors are fetched from
 * @hoverkraft-tech/branding repository at build time when available.
 */

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface TypographyToken {
  family: string;
  weights: number[];
  usage: string;
  fallback?: string;
}

export interface LogoAsset {
  name: string;
  path: string;
  formats: string[];
  usage: string;
  minimumSize?: string;
  clearSpace?: string;
}

// Import generated data from branding repository
// @ts-ignore - These files are generated during the build process
const generatedColors = await import('./generated-colors.ts');
// @ts-ignore
const generatedMission = await import('./generated-mission.ts');
// @ts-ignore
const generatedGuidelines = await import('./generated-guidelines.ts');

export const brandColors: ColorToken[] = generatedColors.brandColors;
export const brandMission = generatedMission.brandMission;
export const usageGuidelines = generatedGuidelines.usageGuidelines;

export const typography: TypographyToken[] = [
  {
    family: 'Inter Variable',
    weights: [300, 400, 500, 600, 700, 800],
    usage: 'Primary font for headings, body text, and UI elements',
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  {
    family: 'Roboto Mono',
    weights: [400, 500, 700],
    usage: 'Code snippets, technical content, monospaced text',
    fallback: 'monospace',
  },
];

export const logos: LogoAsset[] = [
  {
    name: 'Primary Logo',
    path: '~/assets/images/logo.png',
    formats: ['PNG', 'SVG'],
    usage: 'Main logo for light backgrounds',
    minimumSize: '120px width',
    clearSpace: '20px on all sides',
  },
];
