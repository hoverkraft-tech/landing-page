import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { distDir, routesDefinitionPath } from './paths.mjs';
import { fileExists } from './fs-utils.mjs';

let routesConfigCache = null;

async function loadRoutesConfig() {
  if (routesConfigCache) {
    return routesConfigCache;
  }

  try {
    const fileContents = await fs.readFile(routesDefinitionPath, 'utf8');
    const match = fileContents.match(/export const routes\s*=\s*(\{[\s\S]*?\});/);

    if (!match) {
      routesConfigCache = {};
      return routesConfigCache;
    }

    const literal = match[1];
    const evaluated = vm.runInNewContext(`(${literal})`);
    routesConfigCache = evaluated && typeof evaluated === 'object' ? evaluated : {};
  } catch {
    routesConfigCache = {};
  }

  return routesConfigCache;
}

function getBrandGuidelinesFilename(language, defaultLanguage) {
  return language === defaultLanguage
    ? 'hoverkraft-brand-guidelines.pdf'
    : `hoverkraft-brand-guidelines-${language}.pdf`;
}

async function resolveBrandRoutes({ defaultLanguage, languages }) {
  const routesConfig = await loadRoutesConfig();
  const defaultRoutes =
    (routesConfig?.[defaultLanguage] && typeof routesConfig[defaultLanguage] === 'object'
      ? routesConfig[defaultLanguage]
      : {}) ?? {};

  const fallbackSlugs = new Set(
    [
      typeof defaultRoutes['brand-guidelines'] === 'string' ? defaultRoutes['brand-guidelines'] : null,
      'brand-guidelines',
      'charte-graphique',
    ].filter((slug) => typeof slug === 'string' && slug.trim().length > 0)
  );

  const resolved = [];

  for (const lang of languages) {
    const normalizedLang = typeof lang === 'string' ? lang.trim() : '';
    if (!normalizedLang) {
      continue;
    }

    const currentRoutes =
      (routesConfig?.[normalizedLang] && typeof routesConfig[normalizedLang] === 'object'
        ? routesConfig[normalizedLang]
        : {}) ?? {};

    const slugCandidates = new Set(
      [
        typeof currentRoutes['brand-guidelines'] === 'string' ? currentRoutes['brand-guidelines'] : null,
        ...fallbackSlugs,
      ].filter((slug) => typeof slug === 'string' && slug.trim().length > 0)
    );

    let resolvedPath = null;

    for (const candidateSlug of slugCandidates) {
      const sanitizedSlug = candidateSlug.replace(/^\/+|\/+$/g, '');
      const segments = normalizedLang === defaultLanguage ? [sanitizedSlug] : [normalizedLang, sanitizedSlug];
      const candidateFile = path.join(distDir, ...segments, 'index.html');

      if (await fileExists(candidateFile)) {
        resolvedPath = `/${segments.join('/')}/`;
        break;
      }
    }

    if (!resolvedPath) {
      console.warn(
        `⚠ Unable to resolve brand guidelines route for language "${normalizedLang}". Skipping PDF generation.`
      );
      continue;
    }

    resolved.push({
      fileName: getBrandGuidelinesFilename(normalizedLang, defaultLanguage),
      lang: normalizedLang,
      routePath: resolvedPath,
    });
  }

  return resolved;
}

export { getBrandGuidelinesFilename, loadRoutesConfig, resolveBrandRoutes };
