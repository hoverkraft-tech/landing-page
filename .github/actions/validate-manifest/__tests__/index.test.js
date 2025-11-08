const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const {
  run,
  parseManifest,
  loadSchema,
  validateManifest,
  buildOutputs,
  createValidator,
} = require("../index.js");

describe("validate-manifest action", () => {
  it("parses manifest JSON and reports errors", () => {
    mockFs({});
    try {
      const manifest = parseManifest('{"version":"1.0.0"}');
      assert.equal(manifest.version, "1.0.0");

      assert.throws(() => parseManifest(""), /manifest input is required/);

      assert.throws(
        () => parseManifest("not json"),
        /Unable to parse manifest JSON/,
      );
    } finally {
      mockFs.restore();
    }
  });

  it("loads schema files from disk", () => {
    const schemaPath = path.join("/tmp", "schema.json");
    mockFs({
      [schemaPath]: JSON.stringify({ type: "object" }),
    });

    try {
      const schema = loadSchema(schemaPath);
      assert.equal(schema.type, "object");

      assert.throws(
        () => loadSchema("/tmp/missing-schema.json"),
        /Schema not found/,
      );
    } finally {
      mockFs.restore();
    }
  });

  it("validates manifest against schema", () => {
    mockFs({});
    try {
      const schema = {
        type: "object",
        properties: {
          version: { type: "string" },
        },
        required: ["version"],
      };
      const manifest = { version: "1.0.0" };
      const ajv = createValidator();

      assert.equal(validateManifest(manifest, schema, ajv), true);

      assert.throws(
        () => validateManifest({}, schema, ajv),
        /Schema validation errors/,
      );
    } finally {
      mockFs.restore();
    }
  });

  it("builds outputs from manifest fields", () => {
    mockFs({});
    try {
      const manifest = {
        version: "1.2.3",
        commit: "abc123",
        colors: { items: [1, 2] },
        brandMission: { title: { fr: "Bonjour", en: "Hello" } },
        logos: { items: [{ id: "primary" }] },
      };

      const outputs = buildOutputs(manifest);
      assert.equal(outputs.version, "1.2.3");
      assert.equal(outputs.commit, "abc123");
      assert.equal(outputs.locales, JSON.stringify(["fr", "en"]));
    } finally {
      mockFs.restore();
    }
  });

  it("runs the action successfully and sets outputs", async () => {
    const workspace = "/tmp/workspace";
    const schemaPath = path.join(
      workspace,
      ".github/schemas/branding-manifest.schema.json",
    );

    mockFs({
      [schemaPath]: JSON.stringify({
        type: "object",
        properties: {
          version: { type: "string" },
        },
        required: ["version"],
      }),
    });

    try {
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
        manifest: JSON.stringify({ version: "1.0.0", colors: {}, logos: {} }),
        schemaPath,
      });

      assert.deepEqual(failures, []);
      assert.equal(outputs.version, "1.0.0");
      assert.ok(infos[0].includes("Manifest validation passed"));
    } finally {
      delete process.env.GITHUB_WORKSPACE;
      mockFs.restore();
    }
  });

  it("reports failure when validation fails", async () => {
    const workspace = "/tmp/workspace";
    const schemaPath = path.join(
      workspace,
      ".github/schemas/branding-manifest.schema.json",
    );

    mockFs({
      [schemaPath]: JSON.stringify({
        type: "object",
        properties: {
          version: { type: "string" },
        },
        required: ["version"],
      }),
    });

    try {
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
      assert.ok(failures[0].includes("Schema validation errors"));
    } finally {
      delete process.env.GITHUB_WORKSPACE;
      mockFs.restore();
    }
  });
});
