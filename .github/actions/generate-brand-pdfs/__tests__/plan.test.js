const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const { createGenerationPlan } = require("../lib/plan");

describe("lib/plan", () => {
  it("creates a generation plan for each locale", () => {
    mockFs({});
    try {
      const map = {
        fr: "brand-guidelines",
        en: "en/brand-guidelines",
      };
      const downloadsDir = "/tmp/downloads";
      const plan = createGenerationPlan(
        map,
        "https://example.com/",
        downloadsDir,
      );

      assert.deepEqual(plan, [
        {
          locale: "fr",
          pageUrl: "https://example.com/brand-guidelines",
          outputFile: path.join(
            downloadsDir,
            "hoverkraft-brand-guidelines-fr.pdf",
          ),
        },
        {
          locale: "en",
          pageUrl: "https://example.com/en/brand-guidelines",
          outputFile: path.join(
            downloadsDir,
            "hoverkraft-brand-guidelines-en.pdf",
          ),
        },
      ]);
    } finally {
      mockFs.restore();
    }
  });

  it("validates locale and slug entries", () => {
    mockFs({});
    try {
      assert.throws(
        () =>
          createGenerationPlan(
            { " ": "slug" },
            "https://example.com/",
            "/tmp/out",
          ),
        /Locale key at index 0 must be a non-empty string/,
      );

      assert.throws(
        () =>
          createGenerationPlan(
            { fr: "   " },
            "https://example.com/",
            "/tmp/out",
          ),
        /Slug for locale "fr" must be a non-empty string/,
      );
    } finally {
      mockFs.restore();
    }
  });
});
