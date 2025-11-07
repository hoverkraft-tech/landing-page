const assert = require("node:assert/strict");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const {
  parseJsonInput,
  normalizeBaseUrl,
  resolveWorkspacePath,
} = require("../lib/inputs");

describe("lib/inputs", () => {
  it("parses JSON inputs and rejects invalid payloads", () => {
    mockFs({});
    try {
      const parsed = parseJsonInput("locales", '["fr", "en"]');
      assert.deepEqual(parsed, ["fr", "en"]);

      assert.throws(
        () => parseJsonInput("config", undefined),
        /Input config is required/,
      );

      assert.throws(
        () => parseJsonInput("routes", "not-json"),
        /Failed to parse routes input: /,
      );
    } finally {
      mockFs.restore();
    }
  });

  it("normalizes base URLs and validates input", () => {
    mockFs({});
    try {
      assert.equal(
        normalizeBaseUrl("https://example.com"),
        "https://example.com/",
      );
      assert.equal(
        normalizeBaseUrl("https://example.com/"),
        "https://example.com/",
      );

      assert.throws(() => normalizeBaseUrl(""), /base-url input is required/);
    } finally {
      mockFs.restore();
    }
  });

  it("resolves workspace paths for relative and absolute inputs", () => {
    mockFs({
      "/tmp/workspace": {},
    });

    try {
      const workspace = "/tmp/workspace";
      const relative = resolveWorkspacePath("docs/output", workspace);
      assert.equal(relative, path.join(workspace, "docs/output"));

      const absolute = resolveWorkspacePath("/var/data/file.txt", workspace);
      assert.equal(absolute, "/var/data/file.txt");

      assert.throws(
        () => resolveWorkspacePath("   ", workspace),
        /Path input must be a non-empty string/,
      );
    } finally {
      mockFs.restore();
    }
  });
});
