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
  ColorToken,
  ColorCollection,
  TypographyToken,
  TypographyCollection,
  LogoAsset,
  LogoCollection,
  BrandMission,
  LocalizedString,
  LocalizedStringList,
  MascotAsset,
} from './types';

// Import generated data from branding repository
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- generated modules are emitted at build time
// @ts-ignore - These files are generated during the build process
const generatedColors = await import('./generated-colors.ts');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- generated modules are emitted at build time
// @ts-ignore - Generated at build time
const generatedMission = await import('./generated-mission.ts');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- generated modules are emitted at build time
// @ts-ignore - Generated at build time
const generatedTypography = await import('./generated-typography.ts');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- generated modules are emitted at build time
// @ts-ignore - Generated at build time
const generatedLogos = await import('./generated-logos.ts');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- generated modules are emitted at build time
// @ts-ignore - Generated at build time
const generatedMascot = await import('./generated-mascot.ts');

export const brandColors = generatedColors.brandColors;
export const brandMission = generatedMission.brandMission;
export const typography = generatedTypography.typography;
export const logos = generatedLogos.logos;
export const mascot = generatedMascot.mascot;
