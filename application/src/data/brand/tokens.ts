/**
 * Brand tokens and design system values
 *
 * This file contains the core brand identity tokens including colors, typography,
 * spacing, and other design system values. All data is fetched from
 * @hoverkraft-tech/branding repository at build time.
 */

// Import type definitions
export type { ColorToken, TypographyToken, LogoAsset, UsageGuidelines } from './types';

// Import generated data from branding repository
// @ts-ignore - These files are generated during the build process
const generatedColors = await import('./generated-colors.ts');
// @ts-ignore
const generatedMission = await import('./generated-mission.ts');
// @ts-ignore
const generatedGuidelines = await import('./generated-guidelines.ts');
// @ts-ignore
const generatedTypography = await import('./generated-typography.ts');
// @ts-ignore
const generatedLogos = await import('./generated-logos.ts');

export const brandColors = generatedColors.brandColors;
export const brandMission = generatedMission.brandMission;
export const usageGuidelines = generatedGuidelines.usageGuidelines;
export const typography = generatedTypography.typography;
export const logos = generatedLogos.logos;
