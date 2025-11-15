/**
 * Content Generator
 * Responsible for generating blog post content
 */

class ContentGenerator {
  constructor(openAIService) {
    this.openAIService = openAIService;
  }

  /**
   * Generate French blog post content
   */
  async generateFrenchContent(releasesData, { sinceDate, untilDate, slug }) {
    const aiContent = await this.generateBlogContent(
      releasesData,
      sinceDate,
      untilDate,
      "fr",
    );

    const totalReleases = releasesData.reduce(
      (sum, repo) => sum + repo.releases.length,
      0,
    );

    return this.buildFrontmatter({
      title: `Releases HoverKraft Tech - ${this.formatDate(untilDate, "fr-FR")}`,
      excerpt: `Découvrez les dernières mises à jour de nos projets open source : ${totalReleases} nouvelle${totalReleases > 1 ? "s" : ""} release${totalReleases > 1 ? "s" : ""} publiée${totalReleases > 1 ? "s" : ""} en ${this.formatDate(untilDate, "fr-FR")}.`,
      slug,
      author: "Équipe HoverKraft",
      lang: "fr",
      content: `${aiContent}\n\n**HoverKraft Tech** - _Simplifier la complexité, accélérer la delivery_`,
    });
  }

  /**
   * Generate English blog post content
   */
  async generateEnglishContent(releasesData, { sinceDate, untilDate, slug }) {
    const aiContent = await this.generateBlogContent(
      releasesData,
      sinceDate,
      untilDate,
      "en",
    );

    const totalReleases = releasesData.reduce(
      (sum, repo) => sum + repo.releases.length,
      0,
    );

    return this.buildFrontmatter({
      title: `HoverKraft Tech Releases - ${this.formatDate(untilDate, "en-US")}`,
      excerpt: `Discover the latest updates from our open source projects: ${totalReleases} new release${totalReleases > 1 ? "s" : ""} published in ${this.formatDate(untilDate, "en-US")}.`,
      slug,
      author: "HoverKraft Team",
      lang: "en",
      content: `${aiContent}\n\n**HoverKraft Tech** - _Simplifying complexity, accelerating delivery_`,
    });
  }

  /**
   * Generate blog content using AI (factorized for both languages)
   */
  async generateBlogContent(releasesData, sinceDate, untilDate, language) {
    const isFrench = language === "fr";
    const locale = isFrench ? "fr-FR" : "en-US";
    const period = `${this.formatDate(sinceDate, locale)} - ${this.formatDate(untilDate, locale)}`;
    const totalRepos = releasesData.length;
    const totalReleases = releasesData.reduce(
      (sum, repo) => sum + repo.releases.length,
      0,
    );

    const releasesSummary = releasesData
      .map((repo) => {
        const releases = repo.releases
          .map(
            (r) =>
              `- ${r.name || r.tag} (${r.tag}): ${r.body ? r.body.substring(0, 300) : isFrench ? "Pas de notes" : "No notes"}`,
          )
          .join("\n");
        return `**${repo.repo}** (${repo.stars} ⭐)\n${repo.description || (isFrench ? "Pas de description" : "No description")}\n${releases}`;
      })
      .join("\n\n");

    const prompt = isFrench
      ? `Tu es un rédacteur technique professionnel pour le blog HoverKraft Tech. Crée un article de blog en français sur les dernières releases de projets open source.

**Contexte:**
- Période: ${period}
- ${totalRepos} projet${totalRepos > 1 ? "s" : ""} avec ${totalReleases} release${totalReleases > 1 ? "s" : ""}
- Style HoverKraft: professionnel mais accessible, orienté action, concis

**Releases:**
${releasesSummary}

**Instructions:**
1. Commence par une citation inspirante sur l'innovation (40-80 caractères, format: > citation)
2. Section d'introduction: résumé enthousiaste de l'activité
3. Pour chaque projet: titre (##), description, lien, étoiles, et releases (####)
4. Pour chaque release: version, date, lien GitHub, notes principales (résumées)
5. Section finale: appel à l'action communautaire (essayer, contribuer, partager)
6. Garde un ton professionnel mais engageant
7. Maximum 1 emoji par section
8. Reste concis et direct

Génère UNIQUEMENT le contenu markdown (sans les métadonnées frontmatter). Commence directement par la citation.`
      : `You are a professional technical writer for HoverKraft Tech blog. Create a blog post in English about the latest open source project releases.

**Context:**
- Period: ${period}
- ${totalRepos} project${totalRepos > 1 ? "s" : ""} with ${totalReleases} release${totalReleases > 1 ? "s" : ""}
- HoverKraft Style: professional yet accessible, action-oriented, concise

**Releases:**
${releasesSummary}

**Instructions:**
1. Start with an inspiring quote about innovation (40-80 chars, format: > quote)
2. Introduction section: enthusiastic summary of activity
3. For each project: title (##), description, link, stars, and releases (####)
4. For each release: version, date, GitHub link, main notes (summarized)
5. Final section: community call-to-action (try, contribute, share)
6. Keep a professional but engaging tone
7. Maximum 1 emoji per section
8. Stay concise and direct

Generate ONLY the markdown content (without frontmatter metadata). Start directly with the quote.`;

    const systemContent = isFrench
      ? "Tu es un expert en rédaction technique pour blogs tech français."
      : "You are an expert technical writer for tech blogs.";

    return await this.openAIService.generateText([
      { role: "system", content: systemContent },
      { role: "user", content: prompt },
    ]);
  }

  /**
   * Format date for locale
   */
  formatDate(date, locale = "fr-FR") {
    return new Date(date).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
    });
  }

  /**
   * Build frontmatter with content
   */
  buildFrontmatter({ title, excerpt, slug, author, lang, content }) {
    return `---
title: '${title}'
excerpt: '${excerpt}'
slug: ${slug}
author: '${author}'
lang: ${lang}
---

${content}
`;
  }
}

module.exports = { ContentGenerator };
