const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { PostizService } = require("../src/postiz-service");

describe("PostizService", () => {
  describe("createPost", () => {
    it("POSTs to baseUrl + /posts (no trailing slash)", async () => {
      const originalFetch = global.fetch;

      /** @type {{ url?: string, options?: any }} */
      const captured = {};

      global.fetch = async (url, options) => {
        captured.url = String(url);
        captured.options = options;

        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => "",
        };
      };

      try {
        const service = new PostizService({
          apiKey: "secret",
          apiUrl: "https://postiz.example/api",
        });

        await service.createPost({ hello: "world" });

        assert.equal(captured.url, "https://postiz.example/api/posts");
        assert.equal(captured.options.method, "POST");
        assert.equal(captured.options.headers.Authorization, "secret");
        assert.equal(
          captured.options.headers["Content-Type"],
          "application/json",
        );
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("handles trailing slash in base URL", async () => {
      const originalFetch = global.fetch;
      let calledUrl;

      global.fetch = async (url) => {
        calledUrl = String(url);
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => "",
        };
      };

      try {
        const service = new PostizService({
          apiKey: "secret",
          apiUrl: "https://postiz.example/api/",
        });

        await service.createPost({});
        assert.equal(calledUrl, "https://postiz.example/api/posts");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("does not double-append /posts if already provided", async () => {
      const originalFetch = global.fetch;
      let calledUrl;

      global.fetch = async (url) => {
        calledUrl = String(url);
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          text: async () => "",
        };
      };

      try {
        const service = new PostizService({
          apiKey: "secret",
          apiUrl: "https://postiz.example/api/posts",
        });

        await service.createPost({});
        assert.equal(calledUrl, "https://postiz.example/api/posts");
      } finally {
        global.fetch = originalFetch;
      }
    });

    it("throws a helpful error when Postiz returns non-OK", async () => {
      const originalFetch = global.fetch;

      global.fetch = async () => {
        return {
          ok: false,
          status: 400,
          statusText: "Bad Request",
          text: async () => "invalid payload",
        };
      };

      try {
        const service = new PostizService({
          apiKey: "secret",
          apiUrl: "https://postiz.example/api",
        });

        await assert.rejects(
          () => service.createPost({}),
          /Postiz API error \(400\): invalid payload/,
        );
      } finally {
        global.fetch = originalFetch;
      }
    });
  });
});
