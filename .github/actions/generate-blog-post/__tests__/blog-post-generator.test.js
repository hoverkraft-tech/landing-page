const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");
const { BlogPostGenerator } = require("../src/blog-post-generator");

describe("BlogPostGenerator", () => {
  let mockContentGenerator;
  let mockOpenAIService;
  let mockFileSystemService;
  let blogPostGenerator;

  beforeEach(() => {
    mockContentGenerator = {
      generateFrenchContent: mock.fn(),
      generateEnglishContent: mock.fn(),
    };
    mockOpenAIService = {
      generateImage: mock.fn(),
    };
    mockFileSystemService = {
      ensureDirectory: mock.fn(),
      writeFile: mock.fn(),
      getAbsolutePath: mock.fn((...args) => args.join("/")),
      downloadFile: mock.fn(),
    };
    blogPostGenerator = new BlogPostGenerator(
      mockContentGenerator,
      mockOpenAIService,
      mockFileSystemService,
    );
  });

  describe("generate", () => {
    it("should generate complete blog post", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test",
          stars: 42,
          releases: [{ name: "v1.0.0", tag: "v1.0.0" }],
        },
      ];

      mockContentGenerator.generateFrenchContent.mock.mockImplementation(
        async () => "French content",
      );
      mockContentGenerator.generateEnglishContent.mock.mockImplementation(
        async () => "English content",
      );
      mockOpenAIService.generateImage.mock.mockImplementation(
        async () => "https://example.com/image.png",
      );
      mockFileSystemService.downloadFile.mock.mockImplementation(
        async () => {},
      );

      const result = await blogPostGenerator.generate(mockReleasesData, {
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
      });

      assert.strictEqual(result.slug, "releases-2025-11");
      assert.strictEqual(result.imageGenerated, true);
      assert.strictEqual(
        mockFileSystemService.ensureDirectory.mock.calls.length,
        2,
      );
      assert.strictEqual(mockFileSystemService.writeFile.mock.calls.length, 3); // common.yaml, fr.mdx, en.mdx
    });

    it("should create README when image generation fails", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test",
          stars: 42,
          releases: [{ name: "v1.0.0", tag: "v1.0.0" }],
        },
      ];

      mockContentGenerator.generateFrenchContent.mock.mockImplementation(
        async () => "French content",
      );
      mockContentGenerator.generateEnglishContent.mock.mockImplementation(
        async () => "English content",
      );
      mockOpenAIService.generateImage.mock.mockImplementation(async () => {
        throw new Error("API error");
      });

      const result = await blogPostGenerator.generate(mockReleasesData, {
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
      });

      assert.strictEqual(result.imageGenerated, false);
      assert.strictEqual(mockFileSystemService.writeFile.mock.calls.length, 4); // common.yaml, fr.mdx, en.mdx, README.md
    });
  });

  describe("generateSlug", () => {
    it("should generate correct slug", () => {
      const result = blogPostGenerator.generateSlug("2025-11-15T00:00:00Z");
      assert.strictEqual(result, "releases-2025-11");
    });

    it("should pad month with zero", () => {
      const result = blogPostGenerator.generateSlug("2025-01-15T00:00:00Z");
      assert.strictEqual(result, "releases-2025-01");
    });
  });

  describe("generateCommonYaml", () => {
    it("should generate valid YAML content", () => {
      const result = blogPostGenerator.generateCommonYaml("releases-2025-11");

      assert.ok(result.includes("publishDate:"));
      assert.ok(
        result.includes(
          "image: ~/assets/images/blog/releases-2025-11/preview.png",
        ),
      );
      assert.ok(result.includes("tags:"));
      assert.ok(result.includes("- releases"));
      assert.ok(result.includes("- open-source"));
      assert.ok(result.includes("category: Open Source"));
      assert.ok(result.includes("translationKey: releases-2025-11"));
    });
  });
});
