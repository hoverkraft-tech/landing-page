const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const version = core.getInput('version', { required: true });
    const commit = core.getInput('commit', { required: true });
    const outputDir = core.getInput('output-dir', { required: true });
    
    // Get manifest from environment variable (set by validate-manifest action)
    const manifestJson = process.env.BRANDING_MANIFEST;
    if (!manifestJson) {
      core.setFailed('BRANDING_MANIFEST environment variable not found');
      return;
    }
    
    core.info('Parsing manifest from environment...');
    const manifest = JSON.parse(manifestJson);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = manifest.timestamp || new Date().toISOString();
    
    // Generate colors TypeScript file
    const colorsContent = `/**
 * Auto-generated brand colors from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export const brandColors: ColorToken[] = ${JSON.stringify(manifest.colors, null, 2)};
`;
    
    const colorsFile = path.join(outputDir, 'generated-colors.ts');
    fs.writeFileSync(colorsFile, colorsContent);
    core.info(`✓ Generated ${colorsFile}`);
    
    // Generate brand mission TypeScript file
    const missionContent = `/**
 * Auto-generated brand mission from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

export const brandMission: string = ${JSON.stringify(manifest.brandMission)};
`;
    
    const missionFile = path.join(outputDir, 'generated-mission.ts');
    fs.writeFileSync(missionFile, missionContent);
    core.info(`✓ Generated ${missionFile}`);
    
    // Generate usage guidelines TypeScript file
    const guidelinesContent = `/**
 * Auto-generated usage guidelines from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

export interface UsageGuidelines {
  overview: string;
  dos: string[];
  donts: string[];
}

export const usageGuidelines: UsageGuidelines = ${JSON.stringify(manifest.usageGuidelines, null, 2)};
`;
    
    const guidelinesFile = path.join(outputDir, 'generated-guidelines.ts');
    fs.writeFileSync(guidelinesFile, guidelinesContent);
    core.info(`✓ Generated ${guidelinesFile}`);
    
    core.setOutput('success', 'true');
    core.info('✓ All brand content files generated successfully');
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
