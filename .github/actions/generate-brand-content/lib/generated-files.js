const { normalizeGeneratedLogoCollection, normalizeGeneratedMascot } = require('./brand-asset-paths');

const GENERATED_FILE_DEFINITIONS = [
  {
    key: 'colors',
    filename: 'generated-colors.ts',
    description: 'brand colors',
    typeName: 'ColorCollection',
    exportName: 'brandColors',
  },
  {
    key: 'brandMission',
    filename: 'generated-mission.ts',
    description: 'brand mission',
    typeName: 'BrandMission',
    exportName: 'brandMission',
  },
  {
    key: 'typography',
    filename: 'generated-typography.ts',
    description: 'typography tokens',
    typeName: 'TypographyCollection',
    exportName: 'typography',
  },
  {
    key: 'logos',
    filename: 'generated-logos.ts',
    description: 'logo assets',
    typeName: 'LogoCollection',
    exportName: 'logos',
    normalizePayload: normalizeGeneratedLogoCollection,
  },
  {
    key: 'mascot',
    filename: 'generated-mascot.ts',
    description: 'mascot asset',
    typeName: 'MascotAsset',
    exportName: 'mascot',
    normalizePayload: normalizeGeneratedMascot,
  },
];

function buildGeneratedFiles(payloads) {
  return GENERATED_FILE_DEFINITIONS.map(({ key, normalizePayload, ...file }) => ({
    ...file,
    payload: typeof normalizePayload === 'function' ? normalizePayload(payloads[key]) : payloads[key],
  }));
}

module.exports = {
  buildGeneratedFiles,
};
