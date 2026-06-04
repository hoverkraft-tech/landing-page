/**
 * Brand tokens and design system values
 *
 * This file contains the core brand identity tokens including colors, typography,
 * spacing, and other design system values. All data is fetched from
 * @hoverkraft-tech/branding repository at build time.
 */

// Import type definitions
export type {
  BrandLocale,
  BrandMission,
  ColorCollection,
  ColorToken,
  LocalizedString,
  LocalizedStringList,
  LogoAsset,
  LogoCollection,
  MascotAsset,
  TypographyCollection,
  TypographyToken,
} from './types';

// Import generated data from branding repository
const generatedColors = await import('./generated-colors.ts');
const generatedMission = await import('./generated-mission.ts');
const generatedTypography = await import('./generated-typography.ts');
const generatedLogos = await import('./generated-logos.ts');
const generatedMascot = await import('./generated-mascot.ts');

export const brandColors = generatedColors.brandColors;
export const brandMission = generatedMission.brandMission;
export const typography = generatedTypography.typography;
export const logos = generatedLogos.logos;
export const mascot = generatedMascot.mascot;
