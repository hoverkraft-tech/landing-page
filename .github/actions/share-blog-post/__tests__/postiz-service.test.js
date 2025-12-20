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

  describe("createPost", () => {
    it("calls the Postiz SDK client and returns JSON", async () => {
      /** @type {{ payload?: any }} */
      const captured = {};

      const service = new PostizService({
        apiKey: "secret",
        apiUrl: "https://postiz.example/api",
        client: {
          post: async (payload) => {
            captured.payload = payload;
            return { ok: true };
          },
        },
      });

      const response = await service.createPost({ hello: "world" });
      assert.deepEqual(captured.payload, { hello: "world" });
      assert.deepEqual(response, { ok: true });
    });

    it("throws a helpful error when the API returns an error-shaped JSON", async () => {
      const service = new PostizService({
        apiKey: "secret",
        apiUrl: "https://postiz.example/api",
        client: {
          post: async () => ({
            statusCode: 400,
            message: "invalid payload",
            error: "Bad Request",
          }),
        },
      });

      await assert.rejects(
        () => service.createPost({}),
        /Postiz API error \(400\): invalid payload/,
      );
    });
  });
});
