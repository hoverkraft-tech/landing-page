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
        postizService: { createDraftPost: async () => {} },
        socialImageUrlService: { resolveFromTildePath: () => undefined },
        socialCopyService: {
          buildContentByIntegrationType: async () => ({ linkedin: "x" }),
        },
      });

      await service.sharePosts({
        postsRaw: "\n\n",
        language: "en",
        siteBaseUrl: "https://example.com",
        blogBasePath: "blog",
      });

      assert.equal(core.calls.info[0], "No new posts to share");
    });

    it("builds payload and calls Postiz", async () => {
      const core = createCoreSpy();
      const postizCalls = [];
      const socialCopyCalls = [];

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
        postizService: {
          createDraftPost: async (data) => postizCalls.push(data),
        },
        socialImageUrlService: { resolveFromTildePath: () => undefined },
        socialCopyService: {
          buildContentByIntegrationType: async (args) => {
            socialCopyCalls.push(args);
            return {
              linkedin: "Hi LinkedIn Read more: https://example.com/blog/s",
            };
          },
        },
      });

      await service.sharePosts({
        postsRaw: "post-1",
        language: "en",
        siteBaseUrl: "https://example.com",
        blogBasePath: "blog",
      });

      assert.equal(postizCalls.length, 1);
      assert.equal(postizCalls[0].postId, "s");
      assert.ok(postizCalls[0].contentByIntegrationType);
      assert.match(
        postizCalls[0].contentByIntegrationType.linkedin,
        /Read more:/,
      );
      assert.equal(socialCopyCalls.length, 1);
      assert.equal(postizCalls[0].socialImageUrl, undefined);
    });
  });
});
