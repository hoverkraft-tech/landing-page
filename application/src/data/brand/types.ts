/**
 * Type definitions for brand tokens and design system values
 * These types are shared between the main tokens file and generated files
 */

export type BrandLocale = 'fr' | 'en';

export type LocalizedString = Record<BrandLocale, string>;
export type LocalizedStringList = Record<BrandLocale, string[]>;

export interface ColorToken {
  name: LocalizedString;
  hex: string;
  rgb: string;
  usage: LocalizedString;
}

export interface ColorCollectionGuidelines {
  do?: LocalizedStringList;
  dont?: LocalizedStringList;
}

export interface ColorCollection extends ColorCollectionGuidelines {
  items: ColorToken[];
}

export interface TypographyToken {
  family: string;
  weights: number[];
  usage?: LocalizedString;
  fallback?: string;
}

export interface TypographyCollection {
  primary?: TypographyToken;
  monospace?: TypographyToken;
}

export interface LogoAsset {
  name: LocalizedString;
  formats: Record<string, string>;
  usage: LocalizedString;
}

export interface LogoCollectionGuidelines {
  do?: LocalizedStringList;
  dont?: LocalizedStringList;
}

export interface LogoCollection extends LogoCollectionGuidelines {
  items: LogoAsset[];
}

export interface BrandMission {
  title: LocalizedString;
  description: LocalizedString;
}

export interface MascotAsset {
  name: LocalizedString;
  formats: Record<string, string>;
  usage: LocalizedString;
}
