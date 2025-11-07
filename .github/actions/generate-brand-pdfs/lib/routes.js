const fs = require("node:fs");
const vm = require("node:vm");

function loadRoutes(routesPath) {
  try {
    const uiContent = fs.readFileSync(routesPath, "utf8");
    const match = uiContent.match(/export const routes = (\{[\s\S]*?\});/);

    if (!match) {
      throw new Error("Routes definition not found");
    }

    const objectLiteral = match[1].replace(/;$/, "");
    return vm.runInNewContext(`(${objectLiteral})`);
  } catch (error) {
    throw new Error(
      `Failed to read routes from ${routesPath}: ${error.message}`,
      {
        cause: error,
      },
    );
  }
}

function buildLocaleSlugMap(locales, routes, defaultLocale, defaultSlug) {
  if (!defaultLocale || !defaultSlug) {
    throw new Error("default-locale and default-slug inputs are required");
  }

  const normalizedDefaultSlug = defaultSlug.trim().replace(/^\/+/, "");
  const map = {};

  for (const item of locales) {
    const locale = typeof item === "string" ? item.trim() : String(item ?? "");

    if (!locale) {
      throw new Error("Locales must contain non-empty strings");
    }

    if (locale === defaultLocale) {
      map[locale] = normalizedDefaultSlug;
      continue;
    }

    const localeRoutes = routes?.[locale] || {};
    const translatedSlug = localeRoutes?.[normalizedDefaultSlug];
    const resolvedSlug =
      typeof translatedSlug === "string" && translatedSlug.trim().length > 0
        ? translatedSlug.trim()
        : normalizedDefaultSlug;

    map[locale] = `${locale}/${resolvedSlug.replace(/^\/+/, "")}`;
  }

  return map;
}

module.exports = {
  loadRoutes,
  buildLocaleSlugMap,
};
