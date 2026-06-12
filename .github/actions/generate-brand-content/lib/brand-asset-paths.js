function toGeneratedBrandAssetPath(assetPath) {
  if (typeof assetPath !== 'string') {
    return assetPath;
  }

  const normalizedPath = assetPath.replace(/^\.\//, '').replace(/^\/+/, '');

  if (normalizedPath.startsWith('assets/images/brand/')) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith('assets/')) {
    return normalizedPath.replace(/^assets\//, 'assets/images/brand/');
  }

  return normalizedPath;
}

function mapAssetFormats(formats) {
  if (!formats || typeof formats !== 'object' || Array.isArray(formats)) {
    return formats;
  }

  return Object.fromEntries(
    Object.entries(formats).map(([format, assetPath]) => [format, toGeneratedBrandAssetPath(assetPath)])
  );
}

function normalizeGeneratedLogoCollection(logos) {
  if (!logos || typeof logos !== 'object') {
    return logos;
  }

  const items = Array.isArray(logos.items)
    ? logos.items.map((item) => ({
        ...item,
        formats: mapAssetFormats(item?.formats),
      }))
    : logos.items;

  return {
    ...logos,
    items,
  };
}

function normalizeGeneratedMascot(mascot) {
  if (!mascot || typeof mascot !== 'object') {
    return mascot;
  }

  return {
    ...mascot,
    formats: mapAssetFormats(mascot.formats),
  };
}

module.exports = {
  normalizeGeneratedLogoCollection,
  normalizeGeneratedMascot,
  toGeneratedBrandAssetPath,
};
