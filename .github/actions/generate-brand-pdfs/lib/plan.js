const path = require("node:path");

function createGenerationPlan(localeSlugMap, baseUrl, downloadsDir) {
  return Object.entries(localeSlugMap).map(([locale, slug], index) => {
    if (typeof locale !== "string" || locale.trim().length === 0) {
      throw new Error(
        `Locale key at index ${index} must be a non-empty string`,
      );
    }

    if (typeof slug !== "string" || slug.trim().length === 0) {
      throw new Error(`Slug for locale "${locale}" must be a non-empty string`);
    }

    const normalizedSlug = slug.trim().replace(/^\/+/, "");
    const pageUrl = new URL(normalizedSlug, baseUrl).toString();
    const outputFile = path.join(
      downloadsDir,
      `hoverkraft-brand-guidelines-${locale}.pdf`,
    );

    return {
      locale,
      pageUrl,
      outputFile,
    };
  });
}

module.exports = {
  createGenerationPlan,
};
