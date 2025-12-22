const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  buildPostContentForIntegration,
} = require("../src/post-content-builder");

describe("post-content-builder", () => {
  it("does not duplicate URL if description already contains it", () => {
    const result = buildPostContentForIntegration({
      description: "Check this out https://example.com/blog/s #tag",
      url: "https://example.com/blog/s",
      readMoreLabel: "Read more:",
      integrationType: "linkedin",
    });

    assert.equal(result.match(/https:\/\/example\.com\/blog\/s/g).length, 1);
    assert.doesNotMatch(result, /Read more:/);
  });

  it("uses French read-more label when provided", () => {
    const result = buildPostContentForIntegration({
      description: "Bonjour",
      url: "https://example.com/blog/s",
      readMoreLabel: "Lire la suite :",
      integrationType: "linkedin",
    });

    assert.match(result, /Lire la suite :/);
  });

  it("appends link on a new line for Medium", () => {
    const result = buildPostContentForIntegration({
      description: "Intro\n\n- A\n- B\n- C",
      url: "https://example.com/blog/s",
      readMoreLabel: "Read more:",
      integrationType: "medium",
    });

    assert.match(result, /\n\nRead more: https:\/\/example\.com\/blog\/s$/);
  });

  it("skips read-more label for Bluesky", () => {
    const result = buildPostContentForIntegration({
      description: "Hello",
      url: "https://example.com/blog/s",
      readMoreLabel: "Read more:",
      integrationType: "bluesky",
    });

    assert.doesNotMatch(result, /Read more:/);
    assert.match(result, /https:\/\/example\.com\/blog\/s/);
  });
});
