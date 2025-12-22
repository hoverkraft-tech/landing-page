const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { PostizService } = require("../src/postiz-service");

describe("PostizService", () => {
  describe("getBaseUrl", () => {
    it("strips trailing slashes", () => {
      const service = new PostizService({
        apiKey: "secret",
        apiUrl: "https://postiz.example/api///",
        client: { post: async () => ({}) },
      });

      assert.equal(service.getBaseUrl(), "https://postiz.example/api");
    });
  });

  describe("createDraftPost", () => {
    it("should create a draft post", async () => {
      /** @type {{ payload?: any }} */
      const captured = {};

      const service = new PostizService({
        apiKey: "secret",
        apiUrl: "https://postiz.example/api",
        integrations: [
          { id: "a", type: "linkedin" },
          { id: "b", type: "bluesky" },
        ],
        client: {
          post: async (payload) => {
            captured.payload = payload;
            return { id: "created" };
          },
        },
      });

      const response = await service.createDraftPost({
        postId: "my-post",
        content: "Hello world",
        socialImageUrl: "https://example.com/social.png",
      });

      assert.deepEqual(response, { id: "created" });

      assert.equal(captured.payload.id, "my-post");
      assert.equal(captured.payload.type, "draft");
      assert.equal(captured.payload.shortLink, false);
      assert.equal(typeof captured.payload.date, "string");
      assert.equal(captured.payload.posts.length, 2);
      assert.deepEqual(captured.payload.posts[0].integration, { id: "a" });
      assert.deepEqual(captured.payload.posts[0].settings, {
        __type: "linkedin",
      });
      assert.deepEqual(
        captured.payload.posts[0].value[0].content,
        "Hello world",
      );
      assert.deepEqual(captured.payload.posts[0].value[0].image, [
        {
          id: "my-post-preview",
          path: "https://example.com/social.png",
        },
      ]);
    });
  });
});
