const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");
const { run } = require("../index");

describe("Action Entry Point", () => {
  let mockCore;

  beforeEach(() => {
    mockCore = {
      info: mock.fn(),
      setOutput: mock.fn(),
      setFailed: mock.fn(),
    };
  });

  it("should fail when OpenAI API key is missing", async () => {
    await assert.rejects(
      async () => {
        await run({
          core: mockCore,
          releasesData: [{ repo: "test" }],
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          outputDir: "/test",
          openAIKey: "",
        });
      },
      {
        message:
          "OpenAI API key is required. Please set OPENAI_API_KEY secret.",
      },
    );

    assert.strictEqual(mockCore.setFailed.mock.calls.length, 1);
  });

  it("should fail when no releases data provided", async () => {
    await assert.rejects(
      async () => {
        await run({
          core: mockCore,
          releasesData: [],
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          outputDir: "/test",
          openAIKey: "test-key",
        });
      },
      {
        message: "No releases data provided",
      },
    );

    assert.strictEqual(mockCore.setFailed.mock.calls.length, 1);
  });

  it("should validate core instance", async () => {
    await assert.rejects(async () => {
      await run({
        core: null,
        releasesData: [{ repo: "test" }],
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
        openAIKey: "test-key",
      });
    });
  });
});
