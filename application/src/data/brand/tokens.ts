/**
 * Brand tokens and design system values
 *
 * This file contains the core brand identity tokens including colors, typography,
 * spacing, and other design system values. Colors are fetched from
 * @hoverkraft-tech/branding repository at build time when available.
 */

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface TypographyToken {
  family: string;
  weights: number[];
  usage: string;
  fallback?: string;
}

export interface LogoAsset {
  name: string;
  path: string;
  formats: string[];
  usage: string;
  minimumSize?: string;
  clearSpace?: string;
}

// Try to import generated colors from branding repository, fall back to defaults
let brandColors: ColorToken[];

try {
  // @ts-ignore - This file may not exist if branding assets haven't been fetched
  const generatedColors = await import('./generated-colors.ts');
  brandColors = generatedColors.brandColors;
} catch {
  // Fallback colors if branding repository colors are not available
  brandColors = [
    {
      name: 'Primary Blue',
      hex: '#1E3A8A',
      rgb: '30, 58, 138',
      usage: 'Primary brand color, main CTAs, key UI elements',
    },
    {
      name: 'Secondary Blue',
      hex: '#3B82F6',
      rgb: '59, 130, 246',
      usage: 'Accent color, links, secondary CTAs',
    },
    {
      name: 'Dark Gray',
      hex: '#1F2937',
      rgb: '31, 41, 55',
      usage: 'Primary text color, headings',
    },
    {
      name: 'Medium Gray',
      hex: '#6B7280',
      rgb: '107, 114, 128',
      usage: 'Secondary text, captions',
    },
    {
      name: 'Light Gray',
      hex: '#F3F4F6',
      rgb: '243, 244, 246',
      usage: 'Backgrounds, borders',
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      rgb: '255, 255, 255',
      usage: 'Primary background, text on dark backgrounds',
    },
  ];
}

export { brandColors };

export const typography: TypographyToken[] = [
  {
    family: 'Inter Variable',
    weights: [300, 400, 500, 600, 700, 800],
    usage: 'Primary font for headings, body text, and UI elements',
    fallback: 'system-ui, -apple-system, sans-serif',
  },
  {
    family: 'Roboto Mono',
    weights: [400, 500, 700],
    usage: 'Code snippets, technical content, monospaced text',
    fallback: 'monospace',
  },
];

export const logos: LogoAsset[] = [
  {
    name: 'Primary Logo',
    path: '~/assets/images/logo.png',
    formats: ['PNG', 'SVG'],
    usage: 'Main logo for light backgrounds',
    minimumSize: '120px width',
    clearSpace: '20px on all sides',
  },
];

export const brandMission = {
  fr: {
    title: 'Notre Mission',
    description:
      "Libérer les développeurs et accélérer le time-to-market grâce à une méthodologie Platform Engineering orientée connecteurs, ancrée dans l'open source et adaptée aux réalités des PME/ETI françaises.",
  },
  en: {
    title: 'Our Mission',
    description:
      'Empower developers and accelerate time-to-market through a connector-oriented Platform Engineering methodology, rooted in open source and tailored to the realities of French SMEs.',
  },
};

export const usageGuidelines = {
  fr: {
    logo: {
      do: [
        'Utilisez le logo dans sa forme originale sans modification',
        'Maintenez un espace libre minimum de 20px autour du logo',
        'Utilisez le logo principal sur des fonds clairs',
        'Respectez les proportions originales du logo',
      ],
      dont: [
        "Ne déformez pas le logo en l'étirant ou en le compressant",
        "N'ajoutez pas d'effets (ombres, contours, dégradés)",
        'Ne changez pas les couleurs du logo',
        "N'utilisez pas le logo sur des images complexes",
      ],
    },
    colors: {
      do: [
        'Utilisez les couleurs primaires pour les éléments clés',
        'Respectez les ratios de contraste WCAG AA (4.5:1 minimum)',
        'Utilisez les codes hexadécimaux ou RGB fournis',
        'Maintenez la cohérence des couleurs sur tous les supports',
      ],
      dont: [
        'Ne créez pas de nouvelles couleurs en dehors de la palette',
        "N'utilisez pas de dégradés non approuvés",
        'Ne modifiez pas la transparence sans validation',
        "N'utilisez pas de couleurs similaires mais non exactes",
      ],
    },
  },
  en: {
    logo: {
      do: [
        'Use the logo in its original form without modification',
        'Maintain a minimum clear space of 20px around the logo',
        'Use the primary logo on light backgrounds',
        'Respect the original proportions of the logo',
      ],
      dont: [
        'Do not distort the logo by stretching or compressing it',
        'Do not add effects (shadows, outlines, gradients)',
        'Do not change the logo colors',
        'Do not use the logo on complex images',
      ],
    },
    colors: {
      do: [
        'Use primary colors for key elements',
        'Respect WCAG AA contrast ratios (4.5:1 minimum)',
        'Use the provided hexadecimal or RGB codes',
        'Maintain color consistency across all media',
      ],
      dont: [
        'Do not create new colors outside the palette',
        'Do not use unapproved gradients',
        'Do not modify transparency without validation',
        'Do not use similar but non-exact colors',
      ],
    },
  },
};
