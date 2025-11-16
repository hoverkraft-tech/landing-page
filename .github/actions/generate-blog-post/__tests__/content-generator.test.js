const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");
const { ContentGenerator } = require("../src/content-generator");

describe("ContentGenerator", () => {
  let mockOpenAIService;
  let contentGenerator;

  beforeEach(() => {
    mockOpenAIService = {
      generateText: mock.fn(),
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
      mockOpenAIService.generateText.mock.mockImplementation(
        async () => mockAIContent,
      );

      const result = await contentGenerator.generateFrenchContent(
        mockReleasesData,
        {
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          slug: "releases-2025-11",
        },
      );

      assert.ok(result.includes("title: 'Releases HoverKraft Tech"));
      assert.ok(result.includes("lang: fr"));
      assert.ok(result.includes(mockAIContent));
      assert.strictEqual(mockOpenAIService.generateText.mock.calls.length, 1);
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
      mockOpenAIService.generateText.mock.mockImplementation(
        async () => mockAIContent,
      );

      const result = await contentGenerator.generateEnglishContent(
        mockReleasesData,
        {
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          slug: "releases-2025-11",
        },
      );

      assert.ok(result.includes("title: 'HoverKraft Tech Releases"));
      assert.ok(result.includes("lang: en"));
      assert.ok(result.includes(mockAIContent));
      assert.strictEqual(mockOpenAIService.generateText.mock.calls.length, 1);
    });
  });

  describe("formatDate", () => {
    it("should format date in French", () => {
      const result = contentGenerator.formatDate(
        "2025-11-01T00:00:00Z",
        "fr-FR",
      );
      assert.ok(result.includes("2025"));
      assert.ok(result.includes("novembre"));
    });

    it("should format date in English", () => {
      const result = contentGenerator.formatDate(
        "2025-11-01T00:00:00Z",
        "en-US",
      );
      assert.ok(result.includes("2025"));
      assert.ok(result.includes("November"));
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

      assert.ok(result.includes("title: 'Test Title'"));
      assert.ok(result.includes("excerpt: 'Test excerpt'"));
      assert.ok(result.includes("slug: test-slug"));
      assert.ok(result.includes("author: 'Test Author'"));
      assert.ok(result.includes("lang: fr"));
      assert.ok(result.includes("Test content"));
    });
  });
});
