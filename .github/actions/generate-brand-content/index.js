const fs = require("node:fs");
const path = require("node:path");

const {
  assertCore,
  assertIO,
  parseJsonInput,
  requireTrimmedString,
} = require("./lib/action-inputs");
const { createFileContent } = require("./lib/file-content");
const { buildGeneratedFiles } = require("./lib/generated-files");

async function writeFile(io, outputDir, filename, content) {
  await io.mkdirP(outputDir);
  fs.writeFileSync(path.join(outputDir, filename), content);
}

function parseRunInputs({
  version,
  commit,
  colors,
  brandMission,
  logos,
  mascot,
  typography,
  outputDir,
}) {
  return {
    version: requireTrimmedString("version", version),
    commit: requireTrimmedString("commit", commit),
    outputDir: requireTrimmedString("output-dir", outputDir),
    payloads: {
      colors: parseJsonInput("colors", colors),
      brandMission: parseJsonInput("brand-mission", brandMission),
      logos: parseJsonInput("logos", logos),
      mascot: parseJsonInput("mascot", mascot),
      typography: parseJsonInput("typography", typography),
    },
  };
}

async function run({ core, io, ...inputs }) {
  assertCore(core);
  assertIO(io);

  const { version, commit, outputDir, payloads } = parseRunInputs(inputs);
  const timestamp = new Date().toISOString();
  const files = buildGeneratedFiles(payloads);

  for (const file of files) {
    const content = createFileContent({
      description: file.description,
      typeName: file.typeName,
      exportName: file.exportName,
      payload: file.payload,
      version,
      commit,
      timestamp,
    });

    await writeFile(io, outputDir, file.filename, content);

    if (Array.isArray(file.payload?.items)) {
      core.info(
        `✓ Generated ${file.filename} (${file.payload.items.length} items)`,
      );
      continue;
    }

    core.info(`✓ Generated ${file.filename}`);
  }

  core.info("✅ All brand content files generated successfully");
}

module.exports = {
  run,
};
