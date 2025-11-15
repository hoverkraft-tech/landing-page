const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");
const { BlogPostGenerator } = require("../src/blog-post-generator");

describe("BlogPostGenerator", () => {
  let mockContentGenerator;
  let mockOpenAIService;
  let mockFileSystemService;
  let blogPostGenerator;
  const buildLocalizedPayload = (lang) => ({
    frontmatter: `---\nlang: ${lang}\n---\n\n`,
    data: {
      lang,
      intro: {
        quote: null,
        summary: `${lang} summary`,
        takeaways: [],
      },
      closing: {
        summary: `${lang} closing`,
        actions: [],
      },
      stats: {
        period: {
          since: "2025-10-01T00:00:00Z",
          until: "2025-11-01T00:00:00Z",
        },
        totalRepos: 1,
        totalReleases: 1,
        busiestRepo: null,
        mostRecentRelease: null,
      },
      repositories: [],
    },
  });

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
        async () => buildLocalizedPayload("fr"),
      );
      mockContentGenerator.generateEnglishContent.mock.mockImplementation(
        async () => buildLocalizedPayload("en"),
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

      // Slug now includes date and hash
      assert.ok(result.slug.startsWith("releases-2025-11-01-"));
      assert.strictEqual(result.imageGenerated, true);
      assert.strictEqual(
        mockFileSystemService.ensureDirectory.mock.calls.length,
        2,
      );
      assert.strictEqual(mockFileSystemService.writeFile.mock.calls.length, 5); // common.yaml + per-locale JSON & MDX

      const frenchJsonCall = mockFileSystemService.writeFile.mock.calls.find(
        (call) => call.arguments?.[0].endsWith("fr.data.json"),
      );
      assert.ok(frenchJsonCall);
      assert.match(frenchJsonCall.arguments[1], /"lang": "fr"/);

      const frenchMdxCall = mockFileSystemService.writeFile.mock.calls.find(
        (call) => call.arguments?.[0].endsWith("fr.mdx"),
      );
      assert.ok(frenchMdxCall);
      assert.match(
        frenchMdxCall.arguments[1],
        /import data from '\.\/fr\.data\.json';/,
      );
    });

    it("should fail when image generation fails", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test",
          stars: 42,
          releases: [{ name: "v1.0.0", tag: "v1.0.0" }],
        },
      ];

      mockContentGenerator.generateFrenchContent.mock.mockImplementation(
        async () => buildLocalizedPayload("fr"),
      );
      mockContentGenerator.generateEnglishContent.mock.mockImplementation(
        async () => buildLocalizedPayload("en"),
      );
      mockOpenAIService.generateImage.mock.mockImplementation(async () => {
        throw new Error("API error");
      });

      await assert.rejects(
        async () => {
          await blogPostGenerator.generate(mockReleasesData, {
            sinceDate: "2025-10-01T00:00:00Z",
            untilDate: "2025-11-01T00:00:00Z",
            outputDir: "/test",
          });
        },
        {
          message: "API error",
        },
      );
    });
  });

  describe("generateSlug", () => {
    it("should generate correct slug with hash", () => {
      const result = blogPostGenerator.generateSlug(
        "2025-11-15T00:00:00Z",
        "2025-11-15T23:59:59Z",
      );
      assert.ok(result.startsWith("releases-2025-11-15-"));
      assert.strictEqual(result.length, 28); // releases-YYYY-MM-DD-XXXXXXXX (9+5+3+3+8 = 28)
    });

    it("should generate different slugs for different date ranges", () => {
      const result1 = blogPostGenerator.generateSlug(
        "2025-11-15T00:00:00Z",
        "2025-11-15T23:59:59Z",
      );
      const result2 = blogPostGenerator.generateSlug(
        "2025-11-08T00:00:00Z",
        "2025-11-15T23:59:59Z",
      );
      assert.notStrictEqual(result1, result2);
    });
  });

  describe("generateCommonYaml", () => {
    it("should generate valid YAML content", () => {
      const result = blogPostGenerator.generateCommonYaml(
        "releases-2025-11-15-abc123de",
      );

      assert.ok(result.includes("publishDate:"));
      assert.ok(
        result.includes(
          "image: ~/assets/images/blog/releases-2025-11-15-abc123de/preview.png",
        ),
      );
      assert.ok(result.includes("tags:"));
      assert.ok(result.includes("- releases"));
      assert.ok(result.includes("- open-source"));
      assert.ok(result.includes("category: Open Source"));
      assert.ok(
        result.includes("translationKey: releases-2025-11-15-abc123de"),
      );
    });
  });
});
