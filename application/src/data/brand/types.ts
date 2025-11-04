/**
 * Type definitions for brand tokens and design system values
 * These types are shared between the main tokens file and generated files
 */

export type BrandLocale = 'fr' | 'en';

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

export interface LogoAssetCopy {
  usage: string;
  minimumSize?: string;
  clearSpace?: string;
}

export type LogoAssetLocalizedCopy = Record<BrandLocale, LogoAssetCopy>;

export interface LogoAsset {
  name: string;
  path: string;
  copy: LogoAssetLocalizedCopy;
  formats: string[];
}

export interface GuidelineSet {
  do: string[];
  dont: string[];
}

export interface UsageGuidelineEntry {
  overview: string;
  logo: GuidelineSet;
  colors: GuidelineSet;
}

export type UsageGuidelines = Record<BrandLocale, UsageGuidelineEntry>;

export interface BrandMissionEntry {
  title: string;
  description: string;
}

export type BrandMission = Record<BrandLocale, BrandMissionEntry>;
