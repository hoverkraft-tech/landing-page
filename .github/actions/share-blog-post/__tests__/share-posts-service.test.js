const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { SharePostsService } = require("../src/share-posts-service");

function createCoreSpy() {
  const calls = { info: [], debug: [], warning: [] };
  return {
    calls,
    info: (message) => calls.info.push(message),
    debug: (message) => calls.debug.push(message),
    warning: (message) => calls.warning.push(message),
    setFailed: () => {},
  };
}

describe("SharePostsService", () => {
  describe("sharePosts", () => {
    it("no posts -> no-op", async () => {
      const core = createCoreSpy();
      const service = new SharePostsService({
        core,
        postMetadataService: {
          readPostMetadata: async () => null,
          buildPostUrl: () => "",
        },
        integrationsService: { parse: () => [{ id: "1", type: "linkedin" }] },
        openAIService: { generateSocialSnippet: async () => "" },
        postizService: { createPost: async () => {} },
      });

      await service.sharePosts({
        postsRaw: "\n\n",
        language: "en",
        siteBaseUrl: "https://example.com",
        blogBasePath: "blog",
        postizIntegrations: "",
      });

      assert.equal(core.calls.info[0], "No new posts to share");
    });

    it("throws if no integrations", async () => {
      const core = createCoreSpy();
      const service = new SharePostsService({
        core,
        postMetadataService: {
          readPostMetadata: async () => null,
          buildPostUrl: () => "",
        },
        integrationsService: { parse: () => [] },
        openAIService: { generateSocialSnippet: async () => "" },
        postizService: { createPost: async () => {} },
      });

      await assert.rejects(
        () =>
          service.sharePosts({
            postsRaw: "post-1",
            language: "en",
            siteBaseUrl: "https://example.com",
            blogBasePath: "blog",
            postizIntegrations: "",
          }),
        /No Postiz integrations configured/,
      );
    });

    it("builds payload and calls Postiz", async () => {
      const core = createCoreSpy();
      const postizCalls = [];

      const service = new SharePostsService({
        core,
        postMetadataService: {
          readPostMetadata: async () => ({
            title: "T",
            excerpt: "E",
            slug: "s",
            publishDate: "2025-01-01T00:00:00Z",
          }),
          buildPostUrl: () => "https://example.com/blog/s",
        },
        integrationsService: {
          parse: () => [
            { id: "a", type: "linkedin" },
            { id: "b", type: "linkedin" },
          ],
        },
        openAIService: { generateSocialSnippet: async () => "Hi" },
        postizService: {
          createPost: async (payload) => postizCalls.push(payload),
        },
      });

      await service.sharePosts({
        postsRaw: "post-1",
        language: "en",
        siteBaseUrl: "https://example.com",
        blogBasePath: "blog",
        postizIntegrations: "",
      });

      assert.equal(postizCalls.length, 1);
      assert.equal(postizCalls[0].type, "draft");
      assert.equal("date" in postizCalls[0], false);
      assert.equal(postizCalls[0].posts.length, 2);
      assert.match(postizCalls[0].posts[0].value[0].content, /Read more:/);
    });
  });

  describe("getReadMoreLabel", () => {
    it("uses French read-more label", async () => {
      const core = createCoreSpy();
      const postizCalls = [];

      const service = new SharePostsService({
        core,
        postMetadataService: {
          readPostMetadata: async () => ({
            title: "T",
            excerpt: "E",
            slug: "s",
            publishDate: "2025-01-01T00:00:00Z",
          }),
          buildPostUrl: () => "https://example.com/blog/s",
        },
        integrationsService: {
          parse: () => [{ id: "a", type: "linkedin" }],
        },
        openAIService: { generateSocialSnippet: async () => "Bonjour" },
        postizService: {
          createPost: async (payload) => postizCalls.push(payload),
        },
      });

      await service.sharePosts({
        postsRaw: "post-1",
        language: "fr",
        siteBaseUrl: "https://example.com",
        blogBasePath: "blog",
        postizIntegrations: "",
      });

      assert.equal(postizCalls[0].type, "draft");
      assert.equal("date" in postizCalls[0], false);
      assert.match(postizCalls[0].posts[0].value[0].content, /Lire la suite :/);
    });
  });
});
