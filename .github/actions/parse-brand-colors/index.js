const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

function parseColorsCSS(cssContent) {
  const colors = [];
  
  // Parse CSS custom properties (--color-name: #hex;)
  const customPropertyRegex = /--([a-zA-Z0-9-]+):\s*(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})/g;
  let match;
  
  while ((match = customPropertyRegex.exec(cssContent)) !== null) {
    const [, name, hex] = match;
    
    // Convert hex to RGB
    const rgb = hexToRgb(hex);
    
    // Convert CSS variable name to readable name
    const readableName = name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    colors.push({
      name: readableName,
      hex: hex.toUpperCase(),
      rgb: rgb,
      usage: `Brand color: ${readableName}`,
    });
  }
  
  return colors;
}

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-character hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

function generateTypeScript(colors) {
  return `/**
 * Auto-generated brand colors from colors.css
 * DO NOT EDIT - This file is generated during the build process
 * Source: @hoverkraft-tech/branding/colors.css
 */

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export const brandColors: ColorToken[] = ${JSON.stringify(colors, null, 2)};
`;
}

async function run() {
  try {
    const colorsFile = core.getInput('colors-file') || 'application/src/data/brand/colors.css';
    const outputFile = core.getInput('output-file') || 'application/src/data/brand/generated-colors.ts';
    
    if (!fs.existsSync(colorsFile)) {
      core.warning(`colors.css not found at ${colorsFile}. Using fallback colors.`);
      core.setOutput('success', 'false');
      return;
    }
    
    const cssContent = fs.readFileSync(colorsFile, 'utf-8');
    const colors = parseColorsCSS(cssContent);
    
    if (colors.length === 0) {
      core.warning('No colors found in colors.css. Using fallback colors.');
      core.setOutput('success', 'false');
      return;
    }
    
    const tsContent = generateTypeScript(colors);
    fs.writeFileSync(outputFile, tsContent, 'utf-8');
    
    core.info(`✓ Generated ${colors.length} brand colors from colors.css`);
    core.info(`  Output: ${outputFile}`);
    core.setOutput('success', 'true');
  } catch (error) {
    core.warning(`Error parsing colors.css: ${error.message}`);
    core.warning('Using fallback colors.');
    core.setOutput('success', 'false');
  }
}

run();
