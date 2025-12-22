const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { SocialCopyService } = require("../src/social-copy-service");

describe("SocialCopyService", () => {
  it("builds content map by integration type", async () => {
    const calls = [];

    const service = new SocialCopyService({
      integrations: [
        { id: "a", type: "linkedin" },
        { id: "b", type: "bluesky" },
      ],
      openAIService: {
        generateSocialSnippet: async (args) => {
          calls.push(args);
          return args.integrationType === "linkedin" ? "Hi" : "Yo";
        },
      },
      readMoreLabelResolver: () => "Read more:",
    });

    const result = await service.buildContentByIntegrationType({
      title: "T",
      excerpt: "E",
      url: "https://example.com/blog/s",
      language: "en",
    });

    assert.equal(calls.length, 2);
    assert.ok(result.linkedin);
    assert.ok(result.bluesky);
    assert.match(result.linkedin, /Read more:/);
    assert.doesNotMatch(result.bluesky, /Read more:/);
  });
});
