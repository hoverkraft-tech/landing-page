const { describe, it, mock } = require("node:test");
const assert = require("node:assert/strict");

const { OpenAIService, humanizeText } = require("../src/openai-service");

describe("OpenAIService", () => {
  describe("humanizeText", () => {
    it("normalizes NBSP and trims", () => {
      const value = `Hello\u00A0world  `;
      assert.equal(humanizeText(value), "Hello world");
    });
  });

  describe("generateSocialSnippet", () => {
    it("uses the responses API and normalizes the returned text", async () => {
      const service = new OpenAIService("test-key");
      service.client = {
        responses: {
          create: mock.fn(async () => ({
            output_text: "Hello\u00A0world  ",
          })),
        },
      };

      const result = await service.generateSocialSnippet({
        title: "Hello",
        excerpt: "World",
        url: "https://example.com/post",
        language: "en",
        integrationType: "linkedin",
      });

      assert.equal(result, "Hello world");

      const request =
        service.client.responses.create.mock.calls[0].arguments[0];
      assert.equal(request.model, "gpt-5.4-nano");
      assert.equal(request.max_tokens, 200);
      assert.match(request.instructions, /Write a LinkedIn post/);
      assert.match(request.instructions, /Write the post in English/);
      assert.match(request.input, /Title: Hello/);
      assert.match(request.input, /Excerpt: World/);
      assert.match(
        request.input,
        /Link \(for context only, do not repeat\): https:\/\/example\.com\/post/,
      );
    });
  });
});
