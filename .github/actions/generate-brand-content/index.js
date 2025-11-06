const core = require("@actions/core");
const io = require("@actions/io");
const fs = require("fs");
const path = require("path");

async function run() {
  try {
    // Get all inputs (no environment variables)
    const version = core.getInput("version", { required: true });
    const commit = core.getInput("commit", { required: true });
    const colorsJson = core.getInput("colors", { required: true });
    const brandMissionJson = core.getInput("brand-mission", { required: true });
    const logosJson = core.getInput("logos", { required: true });
    const typographyJson =
      core.getInput("typography", { required: false }) || "{}";
    const outputDir = core.getInput("output-dir", { required: true });

    // Parse JSON inputs
    const colorCollection = JSON.parse(colorsJson);
    const brandMission = JSON.parse(brandMissionJson);
    const logoCollection = JSON.parse(logosJson);
    const typography = JSON.parse(typographyJson);

    core.info(`Generating brand content files in ${outputDir}...`);

    // Ensure output directory exists
    await io.mkdirP(outputDir);

    const timestamp = new Date().toISOString();

    // Generate colors TypeScript file
    const colorsContent = `/**
 * Auto-generated brand colors from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { ColorCollection } from './types';

export const brandColors: ColorCollection = ${JSON.stringify(
      colorCollection,
      null,
      2,
    )};
`;

    fs.writeFileSync(
      path.join(outputDir, "generated-colors.ts"),
      colorsContent,
    );
    const colorCount = Array.isArray(colorCollection.items)
      ? colorCollection.items.length
      : Array.isArray(colorCollection)
        ? colorCollection.length
        : 0;
    core.info(`✓ Generated generated-colors.ts (${colorCount} colors)`);

    // Generate brand mission TypeScript file
    const missionContent = `/**
 * Auto-generated brand mission from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { BrandMission } from './types';

export const brandMission: BrandMission = ${JSON.stringify(
      brandMission,
      null,
      2,
    )};
`;

    fs.writeFileSync(
      path.join(outputDir, "generated-mission.ts"),
      missionContent,
    );
    core.info(`✓ Generated generated-mission.ts`);

    // Generate typography TypeScript file
    const typographyContent = `/**
 * Auto-generated typography tokens from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { TypographyCollection } from './types';

export const typography: TypographyCollection = ${JSON.stringify(
      typography,
      null,
      2,
    )};
`;

    fs.writeFileSync(
      path.join(outputDir, "generated-typography.ts"),
      typographyContent,
    );
    core.info(`✓ Generated generated-typography.ts`);

    // Generate logos TypeScript file
    const logosContent = `/**
 * Auto-generated logo assets from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { LogoCollection } from './types';

export const logos: LogoCollection = ${JSON.stringify(logoCollection, null, 2)};
`;

    fs.writeFileSync(path.join(outputDir, "generated-logos.ts"), logosContent);

    const logoCount = Array.isArray(logoCollection.items)
      ? logoCollection.items.length
      : Array.isArray(logoCollection)
        ? logoCollection.length
        : 0;
    core.info(`✓ Generated generated-logos.ts (${logoCount} logos)`);

    core.info("✅ All brand content files generated successfully");
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
