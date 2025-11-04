/**
 * Type definitions for brand tokens and design system values
 * These types are shared between the main tokens file and generated files
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
  usage: string;
}

export interface UsageGuidelines {
  overview: string;
  dos: string[];
  donts: string[];
}
