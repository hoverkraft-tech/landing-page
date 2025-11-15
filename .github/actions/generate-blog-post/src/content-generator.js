/**
 * Content Generator
 * Generates bilingual release data + AI intro snippets
 */

const path = require("node:path");

const releaseSummaryConfig = require(
  path.resolve(
    __dirname,
    "../../../..",
    "application/src/data/release-summary-config.js",
  ),
);

const RELEASE_HIGHLIGHT_LIMIT = 4;

class ContentGenerator {
  constructor(openAIService) {
    this.openAIService = openAIService;
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
    const topHighlights = this.buildRepoHighlights(releasesData, language);
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
    const repoHighlights = this.buildRepoHighlights(releasesData, language);
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

    return body
      .split(/\r?\n+/)
      .map((line) => line.replace(/^[-*#>\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, RELEASE_HIGHLIGHT_LIMIT)
      .map((line) => this.truncate(line, 160));
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

  buildRepoHighlights(releasesData, language) {
    const languageUi = releaseSummaryConfig.ui[language];
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
          }, ${repo.stars ?? 0}⭐)`,
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
