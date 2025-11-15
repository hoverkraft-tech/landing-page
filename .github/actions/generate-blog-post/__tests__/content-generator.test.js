const { describe, it, expect, beforeEach } = require("@jest/globals");
const { ContentGenerator } = require("../src/content-generator");

describe("ContentGenerator", () => {
  let mockOpenAIService;
  let contentGenerator;

  beforeEach(() => {
    mockOpenAIService = {
      generateText: jest.fn(),
    };
    contentGenerator = new ContentGenerator(mockOpenAIService);
  });

  describe("generateFrenchContent", () => {
    it("should generate French content with AI", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test description",
          stars: 42,
          url: "https://github.com/test/repo",
          releases: [
            {
              name: "v1.0.0",
              tag: "v1.0.0",
              body: "Test release notes",
            },
          ],
        },
      ];

      const mockAIContent = "> 🚀 Innovation\n\n## Test Content";
      mockOpenAIService.generateText.mockResolvedValue(mockAIContent);

      const result = await contentGenerator.generateFrenchContent(
        mockReleasesData,
        {
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          slug: "releases-2025-11",
        },
      );

      expect(result).toContain("title: 'Releases HoverKraft Tech");
      expect(result).toContain("lang: fr");
      expect(result).toContain(mockAIContent);
      expect(mockOpenAIService.generateText).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateEnglishContent", () => {
    it("should generate English content with AI", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test description",
          stars: 42,
          url: "https://github.com/test/repo",
          releases: [
            {
              name: "v1.0.0",
              tag: "v1.0.0",
              body: "Test release notes",
            },
          ],
        },
      ];

      const mockAIContent = "> 🚀 Innovation\n\n## Test Content";
      mockOpenAIService.generateText.mockResolvedValue(mockAIContent);

      const result = await contentGenerator.generateEnglishContent(
        mockReleasesData,
        {
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          slug: "releases-2025-11",
        },
      );

      expect(result).toContain("title: 'HoverKraft Tech Releases");
      expect(result).toContain("lang: en");
      expect(result).toContain(mockAIContent);
      expect(mockOpenAIService.generateText).toHaveBeenCalledTimes(1);
    });
  });

  describe("formatDate", () => {
    it("should format date in French", () => {
      const result = contentGenerator.formatDate(
        "2025-11-01T00:00:00Z",
        "fr-FR",
      );
      expect(result).toContain("2025");
      expect(result).toContain("novembre");
    });

    it("should format date in English", () => {
      const result = contentGenerator.formatDate(
        "2025-11-01T00:00:00Z",
        "en-US",
      );
      expect(result).toContain("2025");
      expect(result).toContain("November");
    });
  });

  describe("buildFrontmatter", () => {
    it("should build frontmatter with content", () => {
      const result = contentGenerator.buildFrontmatter({
        title: "Test Title",
        excerpt: "Test excerpt",
        slug: "test-slug",
        author: "Test Author",
        lang: "fr",
        content: "Test content",
      });

      expect(result).toContain("title: 'Test Title'");
      expect(result).toContain("excerpt: 'Test excerpt'");
      expect(result).toContain("slug: test-slug");
      expect(result).toContain("author: 'Test Author'");
      expect(result).toContain("lang: fr");
      expect(result).toContain("Test content");
    });
  });
});
