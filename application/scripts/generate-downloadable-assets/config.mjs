import fs from 'node:fs/promises';
import yaml from 'js-yaml';
import { configPath } from './paths.mjs';

let projectConfigCache = null;
let siteOriginCache = null;

async function loadProjectConfig() {
  if (projectConfigCache) {
    return projectConfigCache;
  }

  try {
    const rawConfig = await fs.readFile(configPath, 'utf8');
    const parsed = yaml.load(rawConfig);
    projectConfigCache = parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    projectConfigCache = {};
  }

  return projectConfigCache;
}

async function getSiteOrigin() {
  if (siteOriginCache) {
    return siteOriginCache;
  }

  const config = await loadProjectConfig();
  const configuredOrigin = config?.site?.site;

  if (typeof configuredOrigin === 'string' && configuredOrigin.trim().length > 0) {
    siteOriginCache = configuredOrigin.trim().replace(/\/+$/, '');
    return siteOriginCache;
  }

  siteOriginCache = 'https://hoverkraft.cloud';
  return siteOriginCache;
}

async function getLocalizationConfig() {
  const config = await loadProjectConfig();
  const i18nConfig = (config?.i18n && typeof config.i18n === 'object' ? config.i18n : {}) ?? {};
  const configuredDefaultLang = typeof i18nConfig.language === 'string' ? i18nConfig.language.trim() : '';
  const defaultLanguage = configuredDefaultLang.length > 0 ? configuredDefaultLang : 'fr';

  const configuredLanguages =
    i18nConfig.languages && typeof i18nConfig.languages === 'object' ? Object.keys(i18nConfig.languages) : [];

  const languages = Array.from(new Set([defaultLanguage, ...configuredLanguages.filter(Boolean)]));

  return {
    defaultLanguage,
    languages,
  };
}

export { getLocalizationConfig, getSiteOrigin, loadProjectConfig };
