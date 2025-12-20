function splitLines(value) {
  if (!value) {
    return [];
  }
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

class SharePostsService {
  constructor({
    core,
    postMetadataService,
    integrationsService,
    openAIService,
    postizService,
  }) {
    this.core = core;
    this.postMetadataService = postMetadataService;
    this.integrationsService = integrationsService;
    this.openAIService = openAIService;
    this.postizService = postizService;
  }

  getReadMoreLabel(language) {
    const normalized = `${language || ""}`.trim().toLowerCase();
    if (normalized === "fr") {
      return "Lire la suite :";
    }
    return "Read more:";
  }

  async sharePosts({
    postsRaw,
    language,
    siteBaseUrl,
    blogBasePath,
    postizIntegrations,
  }) {
    const folders = splitLines(postsRaw);
    if (folders.length === 0) {
      this.core.info("No new posts to share");
      return;
    }

    const integrations = this.integrationsService.parse({
      integrationsRaw: postizIntegrations,
    });

    if (!integrations || integrations.length === 0) {
      throw new Error("No Postiz integrations configured");
    }

    for (const folder of folders) {
      const metadata = await this.postMetadataService.readPostMetadata(folder, {
        language,
      });
      if (!metadata) {
        this.core.warning(`Skipping ${folder}: no ${language}.mdx found`);
        continue;
      }

      const url = this.postMetadataService.buildPostUrl({
        siteBaseUrl,
        blogBasePath,
        slug: metadata.slug,
      });

      let description = await this.openAIService.generateSocialSnippet({
        title: metadata.title,
        excerpt: metadata.excerpt,
        url,
        language,
      });

      if (!description) {
        description = metadata.excerpt;
      }

      const content = `${description} ${this.getReadMoreLabel(
        language,
      )} ${url}`;

      const payload = {
        type: "draft",
        shortLink: false,
        tags: ["blog"],
        posts: integrations.map((integration) => ({
          integration: { id: integration.id },
          value: [{ content }],
          settings: { __type: integration.type },
        })),
      };

      this.core.debug(
        `Postiz payload for ${folder}: ${JSON.stringify(payload)}`,
      );

      const response = await this.postizService.createPost(payload);
      this.core.debug(
        `Postiz response for ${folder}: ${JSON.stringify(response)}`,
      );
      this.core.info(`✅ Shared ${folder}`);
    }
  }
}

module.exports = { SharePostsService };
