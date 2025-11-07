const fs = require("node:fs");
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

function assertCore(core) {
  if (!core) {
    throw new Error("@actions/core instance must be provided");
  }
}

function parseManifest(rawManifest) {
  if (!rawManifest) {
    throw new Error("manifest input is required");
  }

  try {
    return JSON.parse(rawManifest);
  } catch (error) {
    throw new Error(`Unable to parse manifest JSON: ${error.message}`);
  }
}

function loadSchema(schemaPath) {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema not found at ${schemaPath}`);
  }

  try {
    const schemaContent = fs.readFileSync(schemaPath, "utf8");
    return JSON.parse(schemaContent);
  } catch (error) {
    throw new Error(`Unable to read schema: ${error.message}`);
  }
}

function createValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  return ajv;
}

function validateManifest(manifest, schema, ajvInstance = createValidator()) {
  const validate = ajvInstance.compile(schema);
  const valid = validate(manifest);

  if (!valid) {
    const formatted = JSON.stringify(validate.errors, null, 2);
    throw new Error(`Schema validation errors: ${formatted}`);
  }

  return true;
}

function buildOutputs(manifest) {
  const locales = Object.keys(manifest?.brandMission?.title || {});

  return {
    "artifact-id": manifest.artifactId || "",
    version: manifest.version,
    commit: manifest.commit,
    colors: JSON.stringify(manifest.colors ?? {}),
    "brand-mission": JSON.stringify(manifest.brandMission ?? {}),
    logos: JSON.stringify(manifest.logos ?? {}),
    mascot: JSON.stringify(manifest.mascot ?? {}),
    typography: JSON.stringify(manifest.typography ?? {}),
    locales: JSON.stringify(locales),
  };
}

async function run({ core, manifest, schemaPath }) {
  assertCore(core);
  try {
    manifest = parseManifest(manifest);

    const safeSchemaPath = (schemaPath ?? "").trim();
    if (!safeSchemaPath.length) {
      throw new Error("schemaPath argument is required");
    }
    const schema = loadSchema(safeSchemaPath);

    validateManifest(manifest, schema);

    const outputs = buildOutputs(manifest);

    for (const [key, value] of Object.entries(outputs)) {
      core.setOutput(key, value);
    }

    const colorCount = manifest.colors?.items?.length ?? 0;
    const logoCount = manifest.logos?.items?.length ?? 0;
    const localeSummary = JSON.parse(outputs.locales || "[]").join(", ");

    core.info(
      `✓ Manifest validation passed (${colorCount} colors, ${logoCount} logos, mission locales: ${localeSummary})`,
    );
  } catch (error) {
    core.setFailed(`Manifest validation failed: ${error.message}`);
  }
}

module.exports = {
  run,
  parseManifest,
  loadSchema,
  createValidator,
  validateManifest,
  buildOutputs,
};

if (require.main === module) {
  throw new Error(
    "This module must be executed within GitHub Actions context.",
  );
}
