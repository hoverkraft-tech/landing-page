#!/usr/bin/env node

/**
 * Parse colors.css from the branding repository and generate TypeScript tokens
 * This script is run during the build process to extract brand colors
 */

import fs from 'fs';
import path from 'path';

const COLORS_CSS_PATH = path.join(process.cwd(), 'src/data/brand/colors.css');
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/brand/generated-colors.ts');

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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
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

// Main execution
try {
  if (!fs.existsSync(COLORS_CSS_PATH)) {
    console.warn('colors.css not found. Using fallback colors.');
    process.exit(0);
  }

  const cssContent = fs.readFileSync(COLORS_CSS_PATH, 'utf-8');
  const colors = parseColorsCSS(cssContent);

  if (colors.length === 0) {
    console.warn('No colors found in colors.css. Using fallback colors.');
    process.exit(0);
  }

  const tsContent = generateTypeScript(colors);
  fs.writeFileSync(OUTPUT_PATH, tsContent, 'utf-8');

  console.log(`✓ Generated ${colors.length} brand colors from colors.css`);
  console.log(`  Output: ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Error parsing colors.css:', error);
  console.warn('Using fallback colors.');
  process.exit(0);
}
