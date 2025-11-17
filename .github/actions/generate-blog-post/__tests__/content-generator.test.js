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
    it("should return frontmatter and Markdown intro/closing", async () => {
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
              publishedAt: "2025-10-15T00:00:00Z",
              url: "https://github.com/test/repo/releases/v1.0.0",
              body: "Première version stable\n- Ajout d'une API\n- Documentation enrichie",
            },
          ],
        },
      ];

      const mockAIContent = `> 🚀 Innovation partagée

Période dense chez HoverKraft.

- Insight 1
- Insight 2`;

      const mockClosingContent = `Nous clôturons cette période avec une belle dynamique.

- Testez les nouveautés
- Partagez vos retours`;

      const responses = [mockAIContent, mockClosingContent];
      mockOpenAIService.generateText.mock.mockImplementation(async () => {
        return responses.length ? responses.shift() : "";
      });

      const result = await contentGenerator.generateFrenchContent(
        mockReleasesData,
        {
          sinceDate: "2025-10-01T00:00:00Z",
          untilDate: "2025-11-01T00:00:00Z",
          slug: "releases-2025-11",
        },
      );

      assert.match(result.frontmatter, /lang: fr/);
      assert.match(result.frontmatter, /title: 'Releases HoverKraft Tech/);
      assert.deepStrictEqual(result.data.lang, "fr");
      assert.strictEqual(result.data.repositories.length, 1);
      assert.ok(result.data.introMarkdown.startsWith("> 🚀 Innovation"));
      assert.ok(result.data.introMarkdown.includes("Insight 2"));
      assert.strictEqual(
        result.data.repositories[0].releases[0].highlights[0],
        "Première version stable",
      );
      assert.ok(result.data.closingMarkdown?.includes("Nous clôturons"));
      assert.ok(result.data.closingMarkdown?.includes("Partagez vos retours"));
      assert.strictEqual(mockOpenAIService.generateText.mock.calls.length, 2);
    });
  });

  describe("generateEnglishContent", () => {
    it("should fallback when AI summary is empty", async () => {
      const mockReleasesData = [
        {
          repo: "test-repo",
          description: "Test description",
          stars: 10,
          url: "https://github.com/test/repo",
          releases: [
            {
              name: "v0.1.0",
              tag: "v0.1.0",
              publishedAt: "2025-09-01T00:00:00Z",
              url: "https://github.com/test/repo/releases/v0.1.0",
              body: "",
            },
          ],
        },
      ];

      mockOpenAIService.generateText.mock.mockImplementation(async () => "");

      const result = await contentGenerator.generateEnglishContent(
        mockReleasesData,
        {
          sinceDate: "2025-08-01T00:00:00Z",
          untilDate: "2025-09-30T00:00:00Z",
          slug: "releases-2025-09",
        },
      );

      assert.match(result.frontmatter, /lang: en/);
      assert.strictEqual(result.data.lang, "en");
      assert.strictEqual(result.data.introMarkdown, "");
      assert.deepStrictEqual(
        result.data.repositories[0].releases[0].highlights,
        [],
      );
      assert.strictEqual(result.data.closingMarkdown, null);
    });
  });

  describe("buildFrontmatter", () => {
    it("should build valid frontmatter block", () => {
      const result = contentGenerator.buildFrontmatter({
        title: "Test Title",
        excerpt: "Test excerpt",
        slug: "test-slug",
        author: "Test Author",
        lang: "fr",
      });

      assert.ok(result.startsWith("---"));
      assert.ok(result.includes("title: 'Test Title'"));
      assert.ok(result.includes("excerpt: 'Test excerpt'"));
      assert.ok(result.includes("slug: test-slug"));
      assert.ok(result.includes("author: 'Test Author'"));
      assert.ok(result.includes("lang: fr"));
      assert.ok(result.trim().endsWith("---"));
    });
  });

  describe("extractHighlights", () => {
    it("should capture structured release summary sections", () => {
      const body = `Introduction

## Release Summary

We stabilized the API and improved documentation.

## Breaking change(s)

- API authentication now requires tokens.
- Deprecated endpoints removed.

## What's changed

- Misc updates`;

      const highlights = contentGenerator.extractHighlights(body);

      assert.strictEqual(highlights.length, 1);
      assert.ok(highlights[0].includes("## Release Summary"));
      assert.ok(highlights[0].includes("## Breaking change(s)"));
      assert.ok(highlights[0].includes("tokens"));
    });

    it("should fallback to basic bullet extraction when sections missing", () => {
      const body = `- First improvement\n- Second improvement`;
      const highlights = contentGenerator.extractHighlights(body);

      assert.deepStrictEqual(highlights, [
        "First improvement",
        "Second improvement",
      ]);
    });
  });
});
