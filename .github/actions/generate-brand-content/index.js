const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    // Get all inputs (no environment variables)
    const version = core.getInput('version', { required: true });
    const commit = core.getInput('commit', { required: true });
    const colorsJson = core.getInput('colors', { required: true });
    const brandMission = core.getInput('brand-mission', { required: true });
    const usageGuidelinesJson = core.getInput('usage-guidelines', { required: true });
    const logosJson = core.getInput('logos', { required: true });
    const fontsJson = core.getInput('fonts', { required: false }) || '{}';
    const outputDir = core.getInput('output-dir', { required: true });
    
    // Parse JSON inputs
    const colors = JSON.parse(colorsJson);
    const usageGuidelines = JSON.parse(usageGuidelinesJson);
    const logos = JSON.parse(logosJson);
    const fonts = JSON.parse(fontsJson);
    
    core.info(`Generating brand content files in ${outputDir}...`);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
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

import type { ColorToken } from './types';

export const brandColors: ColorToken[] = ${JSON.stringify(colors, null, 2)};
`;
    
    fs.writeFileSync(path.join(outputDir, 'generated-colors.ts'), colorsContent);
    core.info(`✓ Generated generated-colors.ts (${colors.length} colors)`);
    
    // Generate brand mission TypeScript file
    const missionContent = `/**
 * Auto-generated brand mission from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

export const brandMission: string = ${JSON.stringify(brandMission)};
`;
    
    fs.writeFileSync(path.join(outputDir, 'generated-mission.ts'), missionContent);
    core.info(`✓ Generated generated-mission.ts`);
    
    // Generate usage guidelines TypeScript file
    const guidelinesContent = `/**
 * Auto-generated usage guidelines from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { UsageGuidelines } from './types';

export const usageGuidelines: UsageGuidelines = ${JSON.stringify(usageGuidelines, null, 2)};
`;
    
    fs.writeFileSync(path.join(outputDir, 'generated-guidelines.ts'), guidelinesContent);
    core.info(`✓ Generated generated-guidelines.ts`);
    
    // Generate typography TypeScript file
    const typographyContent = `/**
 * Auto-generated typography tokens from branding repository
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding
 * Version: ${version}
 * Commit: ${commit}
 * Generated: ${timestamp}
 */

import type { TypographyToken } from './types';

export const typography: TypographyToken[] = ${JSON.stringify(fonts.fonts || [], null, 2)};
`;
    
    fs.writeFileSync(path.join(outputDir, 'generated-typography.ts'), typographyContent);
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

import type { LogoAsset } from './types';

export const logos: LogoAsset[] = ${JSON.stringify(logos, null, 2)};
`;
    
    fs.writeFileSync(path.join(outputDir, 'generated-logos.ts'), logosContent);
    core.info(`✓ Generated generated-logos.ts (${logos.length} logos)`);
    
    core.info('✅ All brand content files generated successfully');
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

run();
