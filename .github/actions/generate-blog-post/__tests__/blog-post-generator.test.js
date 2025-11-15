const { describe, it, expect, beforeEach } = require("@jest/globals");
const { BlogPostGenerator } = require("../src/blog-post-generator");

describe("BlogPostGenerator", () => {
  let mockContentGenerator;
  let mockOpenAIService;
  let mockFileSystemService;
  let blogPostGenerator;

  beforeEach(() => {
    mockContentGenerator = {
      generateFrenchContent: jest.fn(),
      generateEnglishContent: jest.fn(),
    };
    mockOpenAIService = {
      generateImage: jest.fn(),
    };
    mockFileSystemService = {
      ensureDirectory: jest.fn(),
      writeFile: jest.fn(),
      getAbsolutePath: jest.fn((...args) => args.join("/")),
      downloadFile: jest.fn(),
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

      mockContentGenerator.generateFrenchContent.mockResolvedValue(
        "French content",
      );
      mockContentGenerator.generateEnglishContent.mockResolvedValue(
        "English content",
      );
      mockOpenAIService.generateImage.mockResolvedValue(
        "https://example.com/image.png",
      );
      mockFileSystemService.downloadFile.mockResolvedValue();

      const result = await blogPostGenerator.generate(mockReleasesData, {
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
      });

      expect(result.slug).toBe("releases-2025-11");
      expect(result.imageGenerated).toBe(true);
      expect(mockFileSystemService.ensureDirectory).toHaveBeenCalledTimes(2);
      expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(3); // common.yaml, fr.mdx, en.mdx
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

      mockContentGenerator.generateFrenchContent.mockResolvedValue(
        "French content",
      );
      mockContentGenerator.generateEnglishContent.mockResolvedValue(
        "English content",
      );
      mockOpenAIService.generateImage.mockRejectedValue(new Error("API error"));

      const result = await blogPostGenerator.generate(mockReleasesData, {
        sinceDate: "2025-10-01T00:00:00Z",
        untilDate: "2025-11-01T00:00:00Z",
        outputDir: "/test",
      });

      expect(result.imageGenerated).toBe(false);
      expect(mockFileSystemService.writeFile).toHaveBeenCalledTimes(4); // common.yaml, fr.mdx, en.mdx, README.md
    });
  });

  describe("generateSlug", () => {
    it("should generate correct slug", () => {
      const result = blogPostGenerator.generateSlug("2025-11-15T00:00:00Z");
      expect(result).toBe("releases-2025-11");
    });

    it("should pad month with zero", () => {
      const result = blogPostGenerator.generateSlug("2025-01-15T00:00:00Z");
      expect(result).toBe("releases-2025-01");
    });
  });

  describe("generateCommonYaml", () => {
    it("should generate valid YAML content", () => {
      const result = blogPostGenerator.generateCommonYaml("releases-2025-11");

      expect(result).toContain("publishDate:");
      expect(result).toContain(
        "image: ~/assets/images/blog/releases-2025-11/preview.png",
      );
      expect(result).toContain("tags:");
      expect(result).toContain("- releases");
      expect(result).toContain("- open-source");
      expect(result).toContain("category: Open Source");
      expect(result).toContain("translationKey: releases-2025-11");
    });
  });
});
