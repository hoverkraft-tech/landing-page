/**
 * Content Generator
 * Generates bilingual release data + AI intro snippets
 */

const path = require("node:path");
const { pathToFileURL } = require("node:url");

const releaseSummaryConfigFileUrl = pathToFileURL(
  path.resolve(
    __dirname,
    "../../../..",
    "application/src/data/release-summary-config.mjs",
  ),
).href;

const RELEASE_HIGHLIGHT_LIMIT = 4;
const STRUCTURED_SECTION_HEADINGS = ["Release Summary", "Breaking change(s)"];

class ContentGenerator {
  constructor(openAIService) {
    this.openAIService = openAIService;
    this.releaseSummaryConfig = null;
    this.releaseSummaryConfigPromise = null;
  }

  async generateFrenchContent(releasesData, { sinceDate, untilDate, slug }) {
    return this.generateLocalizedContent("fr", releasesData, {
      sinceDate,
      untilDate,
      slug,
    });
  }

  async generateEnglishContent(releasesData, { sinceDate, untilDate, slug }) {
    return this.generateLocalizedContent("en", releasesData, {
      sinceDate,
      untilDate,
      slug,
    });
  }

  async generateLocalizedContent(
    language,
    releasesData,
    { sinceDate, untilDate, slug },
  ) {
    const releaseSummaryConfig = await this.getReleaseSummaryConfig();
    const localeConfig = releaseSummaryConfig.locales[language];
    if (!localeConfig) {
      throw new Error(
        `Missing locale configuration for language "${language}"`,
      );
    }

    const stats = this.buildStats(releasesData, {
      sinceDate,
      untilDate,
      locale: localeConfig.locale,
    });

    const introResponse = await this.generateIntroSummary(
      language,
      releasesData,
      stats,
    );
    const introMarkdown = this.normalizeMarkdownResponse(introResponse);

    const closingResponse = await this.generateClosingSummary(
      language,
      releasesData,
      stats,
    );
    const closingMarkdown = this.normalizeMarkdownResponse(closingResponse);

    const title = localeConfig.buildTitle(
      this.formatDate(untilDate, localeConfig.locale),
    );
    const excerpt = localeConfig.buildExcerpt(
      stats.totalReleases,
      this.formatDate(untilDate, localeConfig.locale),
    );

    return {
      frontmatter: this.buildFrontmatter({
        title,
        excerpt,
        slug,
        author: localeConfig.author,
        lang: language,
      }),
      data: {
        lang: language,
        introMarkdown,
        closingMarkdown: closingMarkdown || null,
        stats: this.buildStatsPayload(stats),
        repositories: this.buildRepositoriesData(releasesData),
      },
    };
  }

  buildStats(releasesData, { sinceDate, untilDate, locale }) {
    const totalRepos = releasesData.length;
    const releases = releasesData.flatMap((repo) =>
      repo.releases.map((release) => ({
        repo: repo.repo,
        repoStars: repo.stars ?? 0,
        ...release,
      })),
    );

    const sortedByDate = [...releases].sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
    );

    const busiestRepoEntry = [...releasesData]
      .map((repo) => ({ name: repo.repo, count: repo.releases.length }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0];

    return {
      totalRepos,
      totalReleases: releases.length,
      period: {
        since: sinceDate,
        until: untilDate,
      },
      periodLabel: `${this.formatFullDate(
        sinceDate,
        locale,
      )} – ${this.formatFullDate(untilDate, locale)}`,
      mostRecentRelease: sortedByDate[0]
        ? {
            repo: sortedByDate[0].repo,
            name: sortedByDate[0].name || sortedByDate[0].tag,
            publishedAt: sortedByDate[0].publishedAt,
            dateLabel: this.formatFullDate(sortedByDate[0].publishedAt, locale),
          }
        : null,
      busiestRepo: busiestRepoEntry ?? null,
    };
  }

  async generateIntroSummary(language, releasesData, stats) {
    const releaseSummaryConfig = await this.getReleaseSummaryConfig();
    const languageUi = releaseSummaryConfig.ui[language];
    const topHighlights = this.buildRepoHighlights(releasesData, languageUi);
    const prompt = releaseSummaryConfig.prompts.introduction(
      language,
      stats,
      topHighlights,
    );
    const systemPrompt = releaseSummaryConfig.prompts.system(language);

    return await this.openAIService.generateText(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      {
        temperature: 0.35,
        max_tokens: 600,
      },
    );
  }

  async generateClosingSummary(language, releasesData, stats) {
    const releaseSummaryConfig = await this.getReleaseSummaryConfig();
    const languageUi = releaseSummaryConfig.ui[language];
    const repoHighlights = this.buildRepoHighlights(releasesData, languageUi);
    const prompt = releaseSummaryConfig.prompts.closing(
      language,
      stats,
      repoHighlights,
    );
    const systemPrompt = releaseSummaryConfig.prompts.system(language);

    return await this.openAIService.generateText(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      {
        temperature: 0.4,
        max_tokens: 400,
      },
    );
  }

  buildStatsPayload(stats) {
    return {
      period: stats.period,
      totalRepos: stats.totalRepos,
      totalReleases: stats.totalReleases,
      busiestRepo: stats.busiestRepo ? { ...stats.busiestRepo } : null,
      mostRecentRelease: stats.mostRecentRelease
        ? {
            repo: stats.mostRecentRelease.repo,
            name: stats.mostRecentRelease.name,
            publishedAt: stats.mostRecentRelease.publishedAt,
          }
        : null,
    };
  }

  buildRepositoriesData(releasesData) {
    return [...releasesData]
      .sort((a, b) => a.repo.localeCompare(b.repo))
      .map((repo) => ({
        name: repo.repo,
        description: repo.description?.trim() || "",
        stars: repo.stars ?? 0,
        url: repo.url,
        releases: repo.releases
          .slice()
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .map((release) => ({
            name: release.name || "",
            tag: release.tag,
            publishedAt: release.publishedAt,
            url: release.url,
            highlights: this.extractHighlights(release.body),
          })),
      }));
  }

  extractHighlights(body) {
    if (!body) {
      return [];
    }

    const structuredSections = STRUCTURED_SECTION_HEADINGS.map((heading) =>
      this.extractMarkdownSection(body, heading),
    ).filter(Boolean);

    if (structuredSections.length) {
      const combined = structuredSections.join("\n\n").trim();
      if (combined) {
        return [combined];
      }
    }

    return body
      .split(/\r?\n+/)
      .map((line) => line.replace(/^[-*#>\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, RELEASE_HIGHLIGHT_LIMIT)
      .map((line) => this.truncate(line, 160));
  }

  extractMarkdownSection(body, heading) {
    if (!body || !heading) {
      return null;
    }

    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const sectionRegex = new RegExp(
      `(^|\\n)(##\\s+${escapedHeading}\\s*\\n+)([\\s\\S]*?)(?=(\\n##\\s+)|$)`,
      "i",
    );
    const match = body.match(sectionRegex);
    if (!match) {
      return null;
    }

    const headingLine = match[2].trim();
    const content = match[3].trim();
    return content ? `${headingLine}\n\n${content}` : headingLine;
  }

  normalizeMarkdownResponse(raw) {
    if (typeof raw !== "string") {
      return "";
    }
    const trimmed = raw.trim();
    if (!trimmed) {
      return "";
    }

    const fencedMatch = trimmed.match(/```(?:markdown)?\s*([\s\S]*?)\s*```/i);
    if (fencedMatch) {
      return fencedMatch[1].trim();
    }

    return trimmed;
  }

  async getReleaseSummaryConfig() {
    if (this.releaseSummaryConfig) {
      return this.releaseSummaryConfig;
    }

    if (!this.releaseSummaryConfigPromise) {
      this.releaseSummaryConfigPromise = import(
        releaseSummaryConfigFileUrl
      ).then((module) => module?.default ?? module);
    }

    this.releaseSummaryConfig = await this.releaseSummaryConfigPromise;
    return this.releaseSummaryConfig;
  }

  buildRepoHighlights(releasesData, languageUi) {
    return [...releasesData]
      .sort(
        (a, b) =>
          (b.stars ?? 0) - (a.stars ?? 0) ||
          b.releases.length - a.releases.length,
      )
      .slice(0, 3)
      .map(
        (repo) =>
          `${repo.repo} (${repo.releases.length} ${
            languageUi?.repo?.releaseCountShort ?? "releases"
          }, ${repo.stars ?? 0} ⭐)`,
      );
  }

  formatDate(date, locale = "fr-FR") {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
    });
  }

  formatFullDate(date, locale = "fr-FR") {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  truncate(value, maxLength) {
    if (!value) {
      return value;
    }
    return value.length > maxLength
      ? `${value.slice(0, maxLength - 1)}…`
      : value;
  }

  buildFrontmatter({ title, excerpt, slug, author, lang }) {
    return `---
title: '${title}'
excerpt: '${excerpt}'
slug: ${slug}
author: '${author}'
lang: ${lang}
---
`;
  }
}

module.exports = { ContentGenerator };
