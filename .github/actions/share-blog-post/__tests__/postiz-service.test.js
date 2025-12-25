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
        contentByIntegrationType: {
          linkedin: "Hello LinkedIn",
          bluesky: "Hello Bluesky",
        },
        socialImageUrl: "https://example.com/social.png",
        date: "2025-12-24T10:00:00Z",
      });

      assert.deepEqual(response, { id: "created" });

      assert.equal(captured.payload.id, "my-post");
      assert.equal(captured.payload.type, "schedule");
      assert.equal(captured.payload.shortLink, false);
      assert.equal(captured.payload.date, "2025-12-24T10:00:00.000Z");
      assert.equal(captured.payload.posts.length, 2);
      assert.deepEqual(captured.payload.posts[0].integration, { id: "a" });
      assert.deepEqual(captured.payload.posts[0].settings, {
        __type: "linkedin",
      });
      assert.deepEqual(
        captured.payload.posts[0].value[0].content,
        "Hello LinkedIn",
      );
      assert.deepEqual(
        captured.payload.posts[1].value[0].content,
        "Hello Bluesky",
      );
      assert.deepEqual(captured.payload.posts[0].value[0].image, [
        {
          id: "my-post-preview",
          path: "https://example.com/social.png",
        },
      ]);
    });

    it("should reject invalid dates", async () => {
      const service = new PostizService({
        apiKey: "secret",
        apiUrl: "https://postiz.example/api",
        integrations: [{ id: "a", type: "linkedin" }],
        client: { post: async () => ({ id: "created" }) },
      });

      await assert.rejects(
        () =>
          service.createDraftPost({
            postId: "my-post",
            content: "Hello",
            date: "not-a-date",
          }),
        /Invalid date 'not-a-date'/,
      );
    });
  });
});
