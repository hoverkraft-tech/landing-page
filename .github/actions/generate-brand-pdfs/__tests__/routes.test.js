const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const { loadRoutes, buildLocaleSlugMap } = require("../lib/routes");

describe("lib/routes", () => {
  it("loads Astro route definitions from file", () => {
    const filePath = path.join("/tmp", "routes.ts");
    mockFs({
      [filePath]: `export const routes = {
        fr: { "brand-guidelines": "brand-guidelines" },
        en: { "brand-guidelines": "brand-guidelines-en" }
      };`,
    });

    try {
      const routes = loadRoutes(filePath);
      assert.deepEqual(routes.en["brand-guidelines"], "brand-guidelines-en");
    } finally {
      mockFs.restore();
    }
  });

  it("throws when routes file cannot be parsed", () => {
    const filePath = path.join("/tmp", "invalid.ts");
    mockFs({
      [filePath]: "export const somethingElse = {}",
    });

    try {
      assert.throws(() => loadRoutes(filePath), /Routes definition not found/);
    } finally {
      mockFs.restore();
    }
  });

  it("builds locale slug map and uses fallbacks", () => {
    mockFs({});
    try {
      const locales = ["fr", "en", "de"];
      const routes = {
        en: { "brand-guidelines": "brand-guidelines-en" },
      };
      const result = buildLocaleSlugMap(
        locales,
        routes,
        "fr",
        "brand-guidelines",
      );

      assert.deepEqual(result, {
        fr: "brand-guidelines",
        en: "en/brand-guidelines-en",
        de: "de/brand-guidelines",
      });

      assert.throws(
        () => buildLocaleSlugMap(["", "en"], routes, "fr", "brand-guidelines"),
        /Locales must contain non-empty strings/,
      );
    } finally {
      mockFs.restore();
    }
  });
});
