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
  const serializedPayload = serializePayload(payload);

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

const INDENT = "  ";

function serializePayload(payload) {
  return formatValue(payload, 0);
}

function formatValue(value, level) {
  const primitive = formatPrimitiveValue(value);
  if (primitive !== null) {
    return primitive;
  }

  if (Array.isArray(value)) {
    return formatArray(value, level);
  }

  if (typeof value === "object") {
    return formatObject(value, level);
  }

  throw new TypeError(`Unsupported value type: ${typeof value}`);
}

function formatArray(values, level) {
  if (!values.length) {
    return "[]";
  }

  const inline = tryFormatInlineArray(values, level);
  if (inline) {
    return inline;
  }

  const nextLevel = level + 1;
  const indent = INDENT.repeat(level);
  const childIndent = INDENT.repeat(nextLevel);
  const items = values
    .map((item) => `${childIndent}${formatValue(item, nextLevel)},`)
    .join("\n");

  return `[\n${items}\n${indent}]`;
}

function tryFormatInlineArray(values, level) {
  const parts = [];

  for (const value of values) {
    const primitive = formatPrimitiveValue(value);
    if (primitive === null) {
      return null;
    }

    parts.push(primitive);
  }

  const inlineContent = `[${parts.join(", ")}]`;
  const inlineLength = INDENT.length * level + inlineContent.length;

  if (inlineLength <= 120) {
    return inlineContent;
  }

  return null;
}

function formatObject(object, level) {
  const entries = Object.entries(object);

  if (!entries.length) {
    return "{}";
  }

  const nextLevel = level + 1;
  const indent = INDENT.repeat(level);
  const childIndent = INDENT.repeat(nextLevel);

  const lines = entries.map(([key, val]) => {
    return `${childIndent}${formatPropertyKey(key)}: ${formatValue(val, nextLevel)},`;
  });

  return `{
${lines.join("\n")}
${indent}}`;
}

function formatString(value) {
  // If the string contains a single quote, use double quotes to avoid escaping
  if (value.includes("'")) {
    return JSON.stringify(value);
  }

  // Otherwise, use single quotes (escape backslashes and control characters)
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");

  return `'${escaped}'`;
}

function formatPropertyKey(key) {
  if (/^[$A-Z_][0-9A-Z_$]*$/i.test(key)) {
    return key;
  }

  return formatString(key);
}

function formatPrimitiveValue(value) {
  if (value === null) {
    return "null";
  }

  switch (typeof value) {
    case "string":
      return formatString(value);
    case "number":
    case "boolean":
      return String(value);
    default:
      return null;
  }
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
  mascot,
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
  const parsedMascot = parseJsonInput("mascot", mascot);
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
    {
      filename: "generated-mascot.ts",
      description: "mascot asset",
      typeName: "MascotAsset",
      exportName: "mascot",
      payload: parsedMascot,
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
        `✓ Generated ${file.filename} (${file.payload.items.length} items)`
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
