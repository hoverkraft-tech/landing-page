const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { createFileContent, serializePayload } = require('../lib/file-content.js');

describe('file content helpers', () => {
  it('serializes nested payloads with readable JavaScript formatting', () => {
    const serialized = serializePayload({
      title: { en: 'Mission', fr: 'Mission' },
      description: {
        en: 'Line 1\nLine 2',
        fr: 'Ligne 1 avec "citation" et apostrophe \'',
      },
      items: [{ id: 'primary', enabled: true }],
    });

    assert.match(serialized, /description: \{/);
    assert.match(serialized, /en: `Line 1/);
    assert.match(serialized, /fr: `Ligne 1 avec "citation" et apostrophe '/);
    assert.match(serialized, /enabled: true/);
  });

  it('builds a generated file with metadata, import, and export', () => {
    const fileContent = createFileContent({
      description: 'logo assets',
      typeName: 'LogoCollection',
      exportName: 'logos',
      payload: {
        items: [{ formats: { svg: 'assets/images/brand/logo/logo-icon.svg' } }],
      },
      version: '1.2.3',
      commit: 'deadbeef',
      timestamp: '2026-05-18T10:00:00.000Z',
    });

    assert.match(fileContent, /Auto-generated logo assets from branding repository/);
    assert.match(fileContent, /Version: 1\.2\.3/);
    assert.match(fileContent, /Commit: deadbeef/);
    assert.match(fileContent, /import type \{ LogoCollection \} from '\.\/types';/);
    assert.match(fileContent, /export const logos: LogoCollection =/);
  });
});
