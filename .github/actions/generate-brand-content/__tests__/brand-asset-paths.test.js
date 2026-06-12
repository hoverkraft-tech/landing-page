const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const {
  normalizeGeneratedLogoCollection,
  normalizeGeneratedMascot,
  toGeneratedBrandAssetPath,
} = require('../lib/brand-asset-paths.js');

describe('brand asset path helpers', () => {
  it('rewrites asset paths to the application brand directory', () => {
    assert.equal(toGeneratedBrandAssetPath('assets/logo/logo-icon.svg'), 'assets/images/brand/logo/logo-icon.svg');
    assert.equal(toGeneratedBrandAssetPath('./assets/mascot/mascot.png'), 'assets/images/brand/mascot/mascot.png');
    assert.equal(
      toGeneratedBrandAssetPath('assets/images/brand/logo/logo-project.svg'),
      'assets/images/brand/logo/logo-project.svg'
    );
  });

  it('normalizes logo and mascot format maps without mutating other fields', () => {
    const logos = {
      do: {
        en: ['Use official files'],
        fr: ['Utiliser les fichiers officiels'],
      },
      items: [
        {
          name: { en: 'Primary', fr: 'Principal' },
          formats: {
            png: 'assets/logo/primary.png',
            svg: 'assets/logo/primary.svg',
          },
          usage: { en: 'Usage', fr: 'Utilisation' },
        },
      ],
    };
    const mascot = {
      name: { en: 'Mascot', fr: 'Mascotte' },
      formats: { png: 'assets/mascot/mascot.png' },
      usage: { en: 'Usage', fr: 'Utilisation' },
    };

    assert.deepEqual(normalizeGeneratedLogoCollection(logos), {
      do: {
        en: ['Use official files'],
        fr: ['Utiliser les fichiers officiels'],
      },
      items: [
        {
          name: { en: 'Primary', fr: 'Principal' },
          formats: {
            png: 'assets/images/brand/logo/primary.png',
            svg: 'assets/images/brand/logo/primary.svg',
          },
          usage: { en: 'Usage', fr: 'Utilisation' },
        },
      ],
    });
    assert.deepEqual(normalizeGeneratedMascot(mascot), {
      name: { en: 'Mascot', fr: 'Mascotte' },
      formats: { png: 'assets/images/brand/mascot/mascot.png' },
      usage: { en: 'Usage', fr: 'Utilisation' },
    });
  });
});
