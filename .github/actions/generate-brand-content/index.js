const fs = require("node:fs");
const path = require("node:path");

function assertCore(core) {
  if (!core || typeof core.info !== "function") {
    throw new Error("@actions/core instance must be provided");
  }
}

function assertIO(io) {
  if (!io || typeof io.mkdirP !== "function") {
    throw new Error("@actions/io instance with mkdirP must be provided");
  }
}

function parseJsonInput(name, rawValue) {
  if (rawValue === undefined || rawValue === "") {
    throw new Error(`Input ${name} is required`);
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`Failed to parse ${name} input: ${error.message}`);
  }
}

function createFileContent({
  description,
  typeName,
  exportName,
  payload,
  version,
  commit,
  timestamp,
}) {
  const serializedPayload = JSON.stringify(payload, null, 2);

  return `/**
 * Auto-generated ${description} from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { ${typeName} } from './types';

export const ${exportName}: ${typeName} = ${serializedPayload};
`;
}

async function writeFile(io, outputDir, filename, content) {
  await io.mkdirP(outputDir);
  fs.writeFileSync(path.join(outputDir, filename), content);
}

async function run({
  core,
  io,
  version,
  commit,
  colors,
  brandMission,
  logos,
  typography,
  outputDir,
}) {
  assertCore(core);
  assertIO(io);

  const safeVersion = (version ?? "").trim();
  if (!safeVersion.length) {
    throw new Error("version input is required");
  }

  const safeCommit = (commit ?? "").trim();
  if (!safeCommit.length) {
    throw new Error("commit input is required");
  }

  const parsedColors = parseJsonInput("colors", colors);
  const parsedBrandMission = parseJsonInput("brand-mission", brandMission);
  const parsedLogos = parseJsonInput("logos", logos);
  const parsedTypography = parseJsonInput("typography", typography);

  const resolvedOutputDir = (outputDir ?? "").trim();
  if (!resolvedOutputDir.length) {
    throw new Error("output-dir input is required");
  }

  const timestamp = new Date().toISOString();

  const files = [
    {
      filename: "generated-colors.ts",
      description: "brand colors",
      typeName: "ColorCollection",
      exportName: "brandColors",
      payload: parsedColors,
    },
    {
      filename: "generated-mission.ts",
      description: "brand mission",
      typeName: "BrandMission",
      exportName: "brandMission",
      payload: parsedBrandMission,
    },
    {
      filename: "generated-typography.ts",
      description: "typography tokens",
      typeName: "TypographyCollection",
      exportName: "typography",
      payload: parsedTypography,
    },
    {
      filename: "generated-logos.ts",
      description: "logo assets",
      typeName: "LogoCollection",
      exportName: "logos",
      payload: parsedLogos,
    },
  ];

  for (const file of files) {
    const content = createFileContent({
      description: file.description,
      typeName: file.typeName,
      exportName: file.exportName,
      payload: file.payload,
      version: safeVersion,
      commit: safeCommit,
      timestamp,
    });

    await writeFile(io, resolvedOutputDir, file.filename, content);

    if (Array.isArray(file.payload?.items)) {
      core.info(
        `✓ Generated ${file.filename} (${file.payload.items.length} items)`,
      );
    } else {
      core.info(`✓ Generated ${file.filename}`);
    }
  }

  core.info("✅ All brand content files generated successfully");
}

module.exports = {
  run,
};
