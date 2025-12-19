const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { humanizeText } = require("../src/openai-service");

describe("OpenAIService", () => {
  describe("humanizeText", () => {
    it("normalizes NBSP and trims", () => {
      const value = `Hello\u00A0world  `;
      assert.equal(humanizeText(value), "Hello world");
    });
  });
});
