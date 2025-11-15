const { describe, it, expect, beforeEach } = require("@jest/globals");
const { run } = require("../index");

describe("Action Entry Point", () => {
  let mockCore;

  beforeEach(() => {
    mockCore = {
      info: jest.fn(),
      setOutput: jest.fn(),
      setFailed: jest.fn(),
    };
  });

  it("should fail when OpenAI API key is missing", async () => {
    await expect(
      run({
        core: mockCore,
        releasesData: [{ repo: "test" }],
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
        openAIKey: "",
      }),
    ).rejects.toThrow("OpenAI API key is required");
    
    expect(mockCore.setFailed).toHaveBeenCalled();
  });

  it("should fail when no releases data provided", async () => {
    await expect(
      run({
        core: mockCore,
        releasesData: [],
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
        openAIKey: "test-key",
      }),
    ).rejects.toThrow("No releases data provided");
    
    expect(mockCore.setFailed).toHaveBeenCalled();
  });

  it("should validate core instance", async () => {
    await expect(
      run({
        core: null,
        releasesData: [{ repo: "test" }],
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
        openAIKey: "test-key",
      }),
    ).rejects.toThrow();
  });
});
