const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, it, beforeEach, afterEach } = require('node:test');

const { run, parseManifest, loadSchema, validateManifest, buildOutputs, createValidator } = require('../index.js');

describe('validate-manifest action', () => {
  const tempDirectories = [];

  beforeEach(() => {
    delete process.env.GITHUB_WORKSPACE;
  });

  afterEach(async () => {
    delete process.env.GITHUB_WORKSPACE;

    await Promise.all(
      tempDirectories.splice(0).map((directory) => fs.promises.rm(directory, { recursive: true, force: true }))
    );
  });

  it('parses manifest JSON and reports errors', () => {
    const manifest = parseManifest('{"version":"1.0.0"}');
    assert.equal(manifest.version, '1.0.0');

    assert.throws(() => parseManifest(''), /manifest input is required/);

    assert.throws(() => parseManifest('not json'), /Unable to parse manifest JSON/);
  });

  it('loads schema files from disk', () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-manifest-'));
    tempDirectories.push(workspace);
    const schemaPath = path.join(workspace, 'schema.json');
    fs.writeFileSync(schemaPath, JSON.stringify({ type: 'object' }));

    const schema = loadSchema(schemaPath);
    assert.equal(schema.type, 'object');

    assert.throws(() => loadSchema(path.join(workspace, 'missing-schema.json')), /Schema not found/);
  });

  it('validates manifest against schema', () => {
    const schema = {
      type: 'object',
      properties: {
        version: { type: 'string' },
      },
      required: ['version'],
    };
    const manifest = { version: '1.0.0' };
    const ajv = createValidator();

    assert.equal(validateManifest(manifest, schema, ajv), true);

    assert.throws(() => validateManifest({}, schema, ajv), /Schema validation errors/);
  });

  it('builds outputs from manifest fields', () => {
    const manifest = {
      version: '1.2.3',
      commit: 'abc123',
      colors: { items: [1, 2] },
      brandMission: { title: { fr: 'Bonjour', en: 'Hello' } },
      logos: { items: [{ id: 'primary' }] },
    };

    const outputs = buildOutputs(manifest);
    assert.equal(outputs.version, '1.2.3');
    assert.equal(outputs.commit, 'abc123');
    assert.equal(outputs.locales, JSON.stringify(['fr', 'en']));
  });

  it('runs the action successfully and sets outputs', async () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-manifest-'));
    tempDirectories.push(workspace);
    const schemaPath = path.join(workspace, '.github/schemas/branding-manifest.schema.json');

    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(
      schemaPath,
      JSON.stringify({
        type: 'object',
        properties: {
          version: { type: 'string' },
        },
        required: ['version'],
      })
    );

    const outputs = {};
    const failures = [];
    const infos = [];
    const core = {
      setOutput: (key, value) => {
        outputs[key] = value;
      },
      setFailed: (message) => failures.push(message),
      info: (message) => infos.push(message),
    };

    process.env.GITHUB_WORKSPACE = workspace;

    await run({
      core,
      manifest: JSON.stringify({ version: '1.0.0', colors: {}, logos: {} }),
      schemaPath,
    });

    assert.deepEqual(failures, []);
    assert.equal(outputs.version, '1.0.0');
    assert.ok(infos[0].includes('Manifest validation passed'));
  });

  it('reports failure when validation fails', async () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-manifest-'));
    tempDirectories.push(workspace);
    const schemaPath = path.join(workspace, '.github/schemas/branding-manifest.schema.json');

    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(
      schemaPath,
      JSON.stringify({
        type: 'object',
        properties: {
          version: { type: 'string' },
        },
        required: ['version'],
      })
    );

    const outputs = {};
    const failures = [];
    const infos = [];
    const core = {
      setOutput: (key, value) => {
        outputs[key] = value;
      },
      setFailed: (message) => failures.push(message),
      info: (message) => infos.push(message),
    };

    process.env.GITHUB_WORKSPACE = workspace;

    await run({
      core,
      manifest: JSON.stringify({ colors: {} }),
      schemaPath,
    });

    assert.equal(outputs.version, undefined);
    assert.equal(failures.length, 1);
    assert.ok(failures[0].includes('Schema validation errors'));
  });
});
