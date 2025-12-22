const { buildPostContentForIntegration } = require("./post-content-builder");

class SocialCopyService {
  constructor({ openAIService, integrations, readMoreLabelResolver }) {
    this.openAIService = openAIService;
    this.integrations = integrations;
    this.readMoreLabelResolver = readMoreLabelResolver;
  }

  getIntegrations() {
    return Array.isArray(this.integrations) ? this.integrations : [];
  }

  getReadMoreLabel(language) {
    if (typeof this.readMoreLabelResolver === "function") {
      return this.readMoreLabelResolver(language);
    }

    const normalized = `${language || ""}`.trim().toLowerCase();
    if (normalized === "fr") {
      return "Lire la suite :";
    }
    return "Read more:";
  }

  async buildContentByIntegrationType({ title, excerpt, url, language }) {
    const integrations = this.getIntegrations();
    if (integrations.length === 0) {
      throw new Error("No Postiz integrations configured");
    }

    const readMoreLabel = this.getReadMoreLabel(language);

    /** @type {Record<string, string>} */
    const contentByIntegrationType = {};

    for (const integration of integrations) {
      const integrationType = integration?.type;
      const normalizedType = String(integrationType ?? "").trim();
      if (!normalizedType) {
        continue;
      }

      let description = await this.openAIService.generateSocialSnippet({
        title,
        excerpt,
        url,
        language,
        integrationType,
      });

      if (!description) {
        description = excerpt;
      }

      contentByIntegrationType[normalizedType] = buildPostContentForIntegration(
        {
          description,
          url,
          readMoreLabel,
          integrationType,
        },
      );
    }

    if (Object.keys(contentByIntegrationType).length === 0) {
      throw new Error(
        "No valid integration types provided. Ensure postiz-integrations contains valid platform keys.",
      );
    }

    return contentByIntegrationType;
  }
}

module.exports = { SocialCopyService };
