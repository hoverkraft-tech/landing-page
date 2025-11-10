import type { ImageMetadata } from 'astro';
import type { BrandLocale } from '~/data/brand/types';

const brandAssetModules = import.meta.glob<ImageMetadata>('~/assets/images/brand/**/*.{png,svg,webp}', {
  eager: true,
  import: 'default',
});

const brandAssetMap = new Map<string, ImageMetadata>();

export const normalizeBrandAssetPath = (rawPath: string): string => rawPath.replace(/^\.\//, '').replace(/^\//, '');

for (const [fullPath, metadata] of Object.entries(brandAssetModules)) {
  const normalizedPath = fullPath.split('/assets/images/brand/')[1];

  if (normalizedPath && metadata) {
    brandAssetMap.set(normalizeBrandAssetPath(normalizedPath), metadata);
  }
}

export const getBrandAssetMetadata = (rawPath: string, context?: string): ImageMetadata => {
  const normalizedPath = normalizeBrandAssetPath(rawPath);
  const metadata = brandAssetMap.get(normalizedPath);

  if (!metadata) {
    const description = context ? `${context} asset file` : 'Brand asset file';
    throw new Error(`${description} "${rawPath}" was not found under assets/images/brand.`);
  }

  return metadata;
};

const DOWNLOAD_LABEL_BY_LOCALE: Record<BrandLocale, string> = {
  en: 'Download',
  fr: 'Télécharger',
};

export const getBrandDownloadLabel = (lang: BrandLocale): string =>
  DOWNLOAD_LABEL_BY_LOCALE[lang] ?? DOWNLOAD_LABEL_BY_LOCALE.en;
